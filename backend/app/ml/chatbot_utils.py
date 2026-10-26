"""Small, dependency-free helpers for the Gemini chat request/response contract."""

import json
import re
from typing import Any, Dict, Iterable, List, Optional


ALLOWED_INTENTS = {
    "find_friend", "co_learning", "how_to_learn", "skill_exchange",
    "video_call_help", "chat_help", "request_help", "session_help",
    "about_platform", "greeting", "general",
}


def build_gemini_contents(history: Optional[Iterable[Any]], message: str) -> List[Dict[str, Any]]:
    """Build bounded, request-local Gemini contents; never keep a server-side chat session."""
    normalized = []
    for item in list(history or [])[-8:]:
        if hasattr(item, "model_dump"):
            item = item.model_dump()
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        content = item.get("content")
        if role not in {"user", "assistant"} or not isinstance(content, str):
            continue
        content = content.strip()[:4000]
        if not content:
            continue
        if normalized and normalized[-1]["role"] == role:
            normalized[-1]["content"] += "\n" + content
        else:
            normalized.append({"role": role, "content": content})

    # Gemini conversation history must start with a user turn. This also removes
    # the frontend's initial assistant greeting from the model context.
    while normalized and normalized[0]["role"] != "user":
        normalized.pop(0)

    current_message = message.strip()[:2000]
    if normalized and normalized[-1]["role"] == "user":
        normalized[-1]["content"] += "\n" + current_message
    else:
        normalized.append({"role": "user", "content": current_message})

    return [
        {
            "role": "model" if turn["role"] == "assistant" else "user",
            "parts": [{"text": turn["content"]}],
        }
        for turn in normalized[-9:]
    ]


def parse_gemini_payload(payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Validate Gemini's structured response before it reaches API consumers."""
    try:
        parts = payload["candidates"][0]["content"]["parts"]
        raw_text = "".join(part.get("text", "") for part in parts if isinstance(part, dict)).strip()
        clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.IGNORECASE).strip()
        parsed = json.loads(clean)
    except (KeyError, IndexError, TypeError, ValueError):
        return None

    if not isinstance(parsed, dict):
        return None
    reply = parsed.get("reply")
    if not isinstance(reply, str) or not reply.strip():
        return None

    def skills(value: Any) -> List[str]:
        if not isinstance(value, list):
            return []
        return [item.strip()[:100] for item in value if isinstance(item, str) and item.strip()][:10]

    intent = parsed.get("intent", "general")
    if intent not in ALLOWED_INTENTS:
        intent = "general"

    return {
        "reply": reply.strip()[:6000],
        "offered_skills": skills(parsed.get("offered_skills")),
        "wanted_skills": skills(parsed.get("wanted_skills")),
        "intent": intent,
    }
