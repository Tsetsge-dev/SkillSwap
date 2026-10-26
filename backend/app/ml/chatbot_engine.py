"""Gemini conversation and local database-backed SkillSwap matching."""

import os
import logging
import re
import requests
from typing import Optional, List, Dict, Any

from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.models import User
from app.ml.matcher import skill_matcher
from app.ml.taxonomy import normalize_skill
from app.ml.train_model import SUBJECT_KNOWLEDGE
from app.ml.chatbot_utils import build_gemini_contents, parse_gemini_payload
from app.ml.mongolian_text import normalize_mongolian_latin

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()
if not re.fullmatch(r"[A-Za-z0-9._-]{1,100}", GEMINI_MODEL):
    GEMINI_MODEL = "gemini-3.8-flash"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
logger = logging.getLogger(__name__)


# ============================================================
# SYSTEM PROMPT — Gemini-д SkillSwap-ийн бүх мэдлэгийг өгнө
# ============================================================
_SYSTEM_PROMPT = """
Та SkillSwap-ийн туслах. Хэрэглэгчтэй хүн шиг дулаан, энгийн, шууд ярь. Монгол хэлээр хариулж, Монгол бичвэрийг кириллээр гарга.
Хэрэглэгч Монгол хэлийг латин үсгээр галиглан, товчилж бичсэн байж болно. Жишээ нь “sain bna uu”, “bi python zaana, solongos hel surmaar bna”. Үгийн алдаа болон галигийн хувилбарыг утгаар нь тааж ойлго; ойлгосноо байнга тайлбарлаж, өөрийгөө AI гэж давтан танилцуулах хэрэггүй.

## Тан тухай
- Та SkillSwap-ийн хэрэглэгчдэд тусладаг чадварлаг AI туслах.
- Та хэрэглэгчийн бичсэн зүйлс дотроос тэдний ЗААХ болон СУРАХ чадваруудыг ялгаж авдаг.
- Та платформын бүх талаар мэддэг: чат, видео дуудлага, swap request, хуваарь, үнэлгээ.

## SkillSwap платформын мэдлэг
- **Чадвар солилцоо (Swap)**: Хэрэглэгч А нь Б-д ямар нэгэн зүйл заадаг, оронд нь Б нь А-д өөр зүйл заадаг — мөнгөгүй.
- **Хайлт (Explore)**: Бүх хэрэглэгчдийг харах, чадварын категори болон search-ээр шүүх.
- **Санал (Match Request)**: Explore-оос хэрэглэгч сонгоод "Санал илгээх" товчоор хүсэлт явуулна.
- **Чат**: WebSocket бодит цагийн зурвас, дуут зурвас (🎙️), файл/зураг хавсаргах (📎).
- **Видео дуудлага**: WebRTC P2P 1-on-1 видео дуудлага + дэлгэц хуваалцах (Screen Share). Чатын баруун дээд 📹 товчоор нээнэ.
- **Session**: 30/45/60/90 минутын хичээл товлох, "Hours Swapped" цаг бүртгэл.
- **Үнэлгээ**: Хичээл дууссаны дараа 1-5 одтой review үлдээх.
- **Study Buddy**: Тохирох bagsh олдохгүй үед, тантай адил зүйл сурч буй найзыг хайж өгдөг.

## Суралцах категориуд (ямар ч байж болно)
Програмчлал (Python, JavaScript, Flutter, AI/ML, DevOps), Хиймэл оюун ухаан, Гадаад хэл (Япон, Солонгос, Англи, Хятад, Герман, Франц, Испани, Орос, Монгол бичиг), Шинжлэх ухаан (Математик, Физик, Хими, Биологи, Статистик), Хөгжим (Гитар, Морин хуур, Төгөлдөр хуур, Ятга, Бит хийх, Дуулалт), Дизайн (UI/UX, Figma, Photoshop, Blender 3D, Видео эвлүүлэг), Бизнес (Маркетинг, SEO, Санхүү, Нягтлан бодох, Илтгэх урлаг), Спорт (Шатар, Иог, Фитнесс, Усанд сэлэлт, Бокс).

## Таны үүрэг
1. **Skill Extraction**: Хэрэглэгчийн мессежнээс OFFERED болон WANTED чадваруудыг ялгаж JSON гаргана.
2. **Roadmap / Зөвлөгөө**: Хэрэглэгч ямар нэгэн чадвар яаж сурах тухай асуувал дэлгэрэнгүй, практик алхамуудтай roadmap өгнө.
3. **Платформын тусламж**: Ямар ч функцийн талаар асуувал тайлбарлана.
4. **Ерөнхий асуулт**: Шинжлэх ухаан, технологи, хэл, өдөр тутмын сэдэв, бичвэр найруулах зэрэг асуултад өөрийн мэдлэгээр хариул. SkillSwap-ийн тухай мэдээлэл биш бол зөвхөн платформоор хязгаарлагдахгүй.
5. **Харилцан яриа**: Өмнөх ярианы утгыг санаж, хэрэгтэй үед нэг тодруулах асуулт асуу. Хариултыг асуултынхаа төвөгтэй байдалд тааруул; хиймэл магтаал, давтагдсан мэндчилгээ бүү хэрэглэ.

## Хариултын бүтэц
Зөвхөн дараах JSON бүтэцтэй хариул:
{
  "reply": "Хэрэглэгчид харуулах монгол хариулт текст энд байна. Markdown ашиглаж болно.",
  "offered_skills": ["Skill1", "Skill2"],
  "wanted_skills": ["Skill3"],
  "intent": "one of: find_friend | co_learning | how_to_learn | skill_exchange | video_call_help | chat_help | request_help | session_help | about_platform | greeting | general"
}

### Чухал дүрмүүд:
- `offered_skills`: Хэрэглэгч ЗААЖ чадна гэж хэлсэн чадваруудын жагсаалт (монгол эсвэл англиар хэвийнчлэн бич, жишээ: "Python", "Япон хэл")
- `wanted_skills`: Хэрэглэгч СУРМААР байна гэж хэлсэн чадваруудын жагсаалт
- Хэрэв skill дурдаагүй бол хоосон массив [] байна
- `reply` нь заавал байх ёстой, дор хаяж 1 өгүүлбэр
- JSON-оос өөр текст нэмж болохгүй.
- Товч бөгөөд хэрэгтэй байдлаар хариул; дэлгэрэнгүйг хүсвэл алхамчил. Эргэлзээтэй эсвэл цаг хугацаанаас хамаарах баримтыг баттай мэт бүү хэл, таамгаа ил тод тэмдэглэ. Гадаад эх сурвалжаас шалгасан мэт бүү дүр эсгэ.
- SkillSwap-ийн одоогийн боломжийн талаар системийн зааварт байхгүй зүйлийг амласан мэт бүү хэл.
- Тохирох хэрэглэгч санал болгохдоо зөвхөн backend-ийн бодит зөвлөмжийн жагсаалт ашиглагдана гэдгийг анхаар; өөрөө нэр, хэрэглэгч зохиож болохгүй.
""".strip()


def _mongolian_model_context(text: str) -> str:
    normalized = normalize_mongolian_latin(text)
    if normalized == text:
        return text
    return (
        "Хэрэглэгчийн эх бичвэр (латин галигтай Монгол байж болно):\n"
        f"{text}\n\n"
        "Түгээмэл үгийн галигийг кириллээр ойролцуулсан хувилбар (утгыг эх бичвэртэй тулгаж ойлго):\n"
        f"{normalized}"
    )


def _find_matches_in_db(
    db: Session,
    current_user: Optional[User],
    offered_skills: List[str],
    wanted_skills: List[str],
    intent: str
) -> List[Dict[str, Any]]:
    """
    Use our trained ML Matcher to find compatible users from the database.
    This is the local ML model layer.
    """
    user_offered_raw = [{"skill_name": s} for s in offered_skills]
    user_wanted_raw = [{"skill_name": s} for s in wanted_skills]

    # Fall back to profile skills if user didn't specify any
    if current_user:
        if not user_offered_raw and current_user.skills_offered:
            user_offered_raw = [{"skill_name": s.skill_name, "proficiency_level": s.proficiency_level}
                                 for s in current_user.skills_offered]
        if not user_wanted_raw and current_user.skills_wanted:
            user_wanted_raw = [{"skill_name": s.skill_name}
                                for s in current_user.skills_wanted]

    # Query active users from DB
    query = db.query(User).filter(User.is_active == True)
    if current_user:
        query = query.filter(User.id != current_user.id)
    all_candidates = query.all()

    ranked = []
    study_buddies = []

    is_search = intent in ["find_friend", "co_learning", "skill_exchange", "how_to_learn"] or (user_offered_raw or user_wanted_raw)
    if not is_search:
        return []

    for cand in all_candidates:
        cand_offered = [{"skill_name": s.skill_name, "proficiency_level": s.proficiency_level}
                        for s in cand.skills_offered]
        cand_wanted = [{"skill_name": s.skill_name} for s in cand.skills_wanted]

        match_res = skill_matcher.compute_bilateral_match(
            user_a_offered=user_offered_raw,
            user_a_wanted=user_wanted_raw,
            user_b_offered=cand_offered,
            user_b_wanted=cand_wanted,
            user_b_rating=cand.rating or 5.0
        )

        score = match_res["match_score"]
        a_teaches_b = match_res["a_teaches_b"]
        b_teaches_a = match_res["b_teaches_a"]

        # Study Buddy: both wanting same skill
        shared = []
        for my_w in user_wanted_raw:
            for their_w in cand_wanted:
                sim = skill_matcher.calculate_skill_similarity(
                    my_w.get("skill_name", ""), their_w.get("skill_name", ""))
                if sim >= 0.55:
                    shared.append(my_w.get("skill_name", ""))

        if match_res.get("is_bilateral") or (score >= 45.0 and a_teaches_b and b_teaches_a):
            ranked.append({
                "user_id": cand.id,
                "full_name": cand.full_name,
                "avatar": cand.avatar,
                "headline": cand.headline,
                "match_score": score,
                "offered_skill": b_teaches_a or (cand_offered[0]["skill_name"] if cand_offered else "Чадвар"),
                "wanted_skill": a_teaches_b or (cand_wanted[0]["skill_name"] if cand_wanted else "Сурах"),
                "match_reason": "✨ Төгс хоёр талт солилцоо — харилцан зааж суралцана!",
                "match_type": "bilateral",
                "match_badge": "🔄 Харилцан солилцох",
            })
        elif b_teaches_a:
            ranked.append({
                "user_id": cand.id,
                "full_name": cand.full_name,
                "avatar": cand.avatar,
                "headline": cand.headline,
                "match_score": max(score, 50.0),
                "offered_skill": b_teaches_a,
                "wanted_skill": cand_wanted[0]["skill_name"] if cand_wanted else "Чадвар",
                "match_reason": f"👨‍🏫 Ментор — Танд {b_teaches_a} заах туршлагатай.",
                "match_type": "mentor",
                "match_badge": "👨‍🏫 Ментор",
            })
        elif a_teaches_b:
            ranked.append({
                "user_id": cand.id,
                "full_name": cand.full_name,
                "avatar": cand.avatar,
                "headline": cand.headline,
                "match_score": max(score, 45.0),
                "offered_skill": cand_offered[0]["skill_name"] if cand_offered else "Чадвар",
                "wanted_skill": a_teaches_b,
                "match_reason": f"🎓 Суралцагч — Танаас {a_teaches_b} сурах хүсэлтэй.",
                "match_type": "learner",
                "match_badge": "🎓 Суралцагч",
            })
        elif shared:
            study_buddies.append({
                "user_id": cand.id,
                "full_name": cand.full_name,
                "avatar": cand.avatar,
                "headline": cand.headline,
                "match_score": 65.0,
                "offered_skill": cand_offered[0]["skill_name"] if cand_offered else shared[0],
                "wanted_skill": shared[0],
                "match_reason": f"🤝 Хамтран суралцагч — Тантай адил {shared[0]} сурч байна!",
                "match_type": "study_buddy",
                "match_badge": "🤝 Хамтран суралцагч",
            })

    ranked.sort(key=lambda x: x["match_score"], reverse=True)
    final = ranked[:4]
    if len(final) < 4 and study_buddies:
        final.append(study_buddies[0])
    if not final and all_candidates:
        for c in all_candidates[:3]:
            final.append({
                "user_id": c.id,
                "full_name": c.full_name,
                "avatar": c.avatar,
                "headline": c.headline,
                "match_score": 40.0,
                "offered_skill": c.skills_offered[0].skill_name if c.skills_offered else "Ерөнхий",
                "wanted_skill": c.skills_wanted[0].skill_name if c.skills_wanted else "Сурах",
                "match_reason": "🌟 Идэвхтэй гишүүн — холбогдож яриа эхлүүлэх боломжтой.",
                "match_type": "member",
                "match_badge": "🌟 Идэвхтэй гишүүн",
            })
    return final


def _fallback_local_response(user_message: str, current_user: Optional[User]) -> Dict[str, Any]:
    """Useful local answers when Gemini is unavailable or not configured."""
    from app.ml.extractor import skill_extractor

    normalized_message = normalize_mongolian_latin(user_message)
    parsed = skill_extractor.parse_conversation(normalized_message)
    intent = parsed["intent"]
    offered = parsed["offered_skills"]
    wanted = parsed["wanted_skills"]
    lower = normalized_message.lower()

    learning_question = any(phrase in lower for phrase in (
        "яаж сурах", "яаж сур", "суралцаж эхлэх", "сурах төлөвлөгөө", "roadmap", "how to learn"
    ))
    if learning_question:
        intent = "how_to_learn"
        if not wanted:
            wanted = skill_extractor.extract_skills_from_text(user_message)

    if intent == "how_to_learn" or learning_question:
        topic = wanted[0] if wanted else None
        knowledge = None
        if topic:
            normalized_topic = normalize_skill(topic).casefold()
            for key, value in SUBJECT_KNOWLEDGE.items():
                if normalize_skill(key).casefold() == normalized_topic:
                    knowledge = value
                    break
        if knowledge:
            reply = (
                f"{knowledge['title']}\n{knowledge['description']}\n\n"
                f"Сурах дараалал:\n" + "\n".join(knowledge["roadmap"]) +
                f"\n\nДадлагын зөвлөгөө: {knowledge['tip']}"
            )
        elif topic:
            reply = (
                f"{topic}-ийг эхлүүлэх энгийн төлөвлөгөө:\n"
                "1. Суурь ойлголт, түгээмэл нэр томьёог судал.\n"
                "2. Өдөр бүр 20–30 минутын богино дадлага хий.\n"
                "3. Долоо хоног бүр сурсан зүйлээ ашигласан жижиг төсөл эсвэл даалгавар хий.\n"
                "4. Өөрийн ахицыг тэмдэглэж, мэддэг хүнээс санал хүс.\n\n"
                "Хэрэв түвшин болон зорилгоо хэлбэл төлөвлөгөөг илүү нарийвчилж өгнө."
            )
        else:
            reply = "Ямар чадвар сурахыг хүсэж байгаагаа бичээрэй. Жишээ нь: “Япон хэл яаж сурах вэ?”"
        return {"reply": reply, "offered_skills": offered, "wanted_skills": wanted, "intent": intent}

    simple_responses = {
        "video_call_help": "Видео дуудлага хийхдээ хамтрагчтайгаа чатыг нээгээд дээд хэсгийн видео дуудлагын товчийг дарна. Хөтөч микрофон, камер ашиглах зөвшөөрөл асууж болно.",
        "chat_help": "Чат хэсэгт бодит цагийн зурвас илгээж, файл, зураг эсвэл дуут зурвас хавсаргаж болно.",
        "request_help": "Суралцагч хайх хэсгээс профайл сонгоод “Санал илгээх” товчийг дарна. Хүлээн авсан хариуг “Хүсэлтүүд” хэсгээс харна.",
        "session_help": "Холбогдсон хэрэглэгчтэйгээ “Хуваарь” хэсгээс хичээлийн цаг тохируулж болно.",
        "about_platform": "SkillSwap нь суралцагчид мэддэг чадвараа зааж, өөр чадвар сурах түншээ олох платформ юм.",
        "greeting": "Сайн байна уу! Би SkillSwap-ийн туслах. Заах эсвэл сурахыг хүссэн чадвараа бичвэл тохирох суралцагч хайж өгнө.",
        "find_friend": "Танд тохирох хүн хайхад тусалъя. Сурах эсвэл заах чадвараа нэрлэж бичээрэй.",
        "co_learning": "Хамтран суралцах хүн хайхад тусална. Ямар чадварыг хэнтэй хамт сурахыг хүсэж байгаагаа хэлнэ үү.",
        "skill_exchange": "Солилцох хоёр чадвараа бичээрэй. Жишээ нь: “Би Python заана, Япон хэл сурмаар байна.”",
    }

    reply = simple_responses.get(intent)
    if not reply and (offered or wanted):
        details = []
        if offered:
            details.append("Заах чадвар: " + ", ".join(offered))
        if wanted:
            details.append("Сурах хүсэл: " + ", ".join(wanted))
        reply = "Ойлголоо. " + ". ".join(details) + ". Тохирох бодит хэрэглэгч байгаа эсэхийг хайж байна."
    if not reply:
        reply = "Энэ асуултад ерөнхий мэдлэгээр хариулахын тулд серверийн Gemini тохиргоо хэрэгтэй байна. SkillSwap-ийн хэрэглээний талаар асуултаа бичвэл одоогийн туслах боломжтой мэдээллээр тусалъя."
    return {"reply": reply, "offered_skills": offered, "wanted_skills": wanted, "intent": intent}


def _generate_gemini_response(
    user_message: str,
    chat_history: Optional[List[Dict[str, str]]],
    current_user: Optional[User],
) -> Optional[Dict[str, Any]]:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return None

    system_instruction = _SYSTEM_PROMPT
    if current_user:
        offered = [skill.skill_name for skill in current_user.skills_offered[:10]]
        wanted = [skill.skill_name for skill in current_user.skills_wanted[:10]]
        if offered or wanted:
            system_instruction += (
                "\n\nНэвтэрсэн хэрэглэгчийн профайлын чадварын мэдээлэл. "
                "Нэр, имэйл зэрэг шаардлагагүй хувийн мэдээлэл бүү асуу. "
                f"Заах чадвар: {', '.join(offered) or 'байхгүй'}. "
                f"Сурах хүсэл: {', '.join(wanted) or 'байхгүй'}."
            )

    payload = {
        "system_instruction": {"parts": [{"text": system_instruction}]},
        "contents": build_gemini_contents(chat_history, user_message),
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.7,
            "maxOutputTokens": 1600,
        },
    }
    try:
        normalized_history = []
        for turn in chat_history or []:
            normalized_turn = dict(turn)
            if normalized_turn.get("role") == "user" and isinstance(normalized_turn.get("content"), str):
                normalized_turn["content"] = _mongolian_model_context(normalized_turn["content"])
            normalized_history.append(normalized_turn)

        response = requests.post(
            GEMINI_API_URL,
            headers={"x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json"},
            json={
                **payload,
                "contents": build_gemini_contents(normalized_history, _mongolian_model_context(user_message)),
            },
            timeout=(5, 30),
        )
        if response.status_code >= 400:
            logger.warning("Gemini API returned HTTP %s", response.status_code)
            return None
        parsed = parse_gemini_payload(response.json())
        if parsed is None:
            logger.warning("Gemini API response did not match the chatbot contract")
        return parsed
    except requests.RequestException as error:
        logger.warning("Gemini request failed (%s)", type(error).__name__)
    except (TypeError, ValueError):
        logger.warning("Gemini returned an unreadable response")
    return None


class GeminiChatbotEngine:
    """Gemini conversation with stateless request-local context and local matching."""

    def process_message(
        self,
        db: Session,
        current_user: Optional[User],
        user_message: str,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        ai_result = _generate_gemini_response(user_message, chat_history, current_user)
        response_source = "gemini" if ai_result else "local_ml"
        result = ai_result or _fallback_local_response(user_message, current_user)

        try:
            recommendations = _find_matches_in_db(
                db=db,
                current_user=current_user,
                offered_skills=result["offered_skills"],
                wanted_skills=result["wanted_skills"],
                intent=result["intent"],
            )
        except Exception:
            logger.exception("SkillSwap chatbot recommendations failed")
            recommendations = []

        return {
            "reply": result["reply"],
            "extracted_skills_offered": result["offered_skills"],
            "extracted_skills_wanted": result["wanted_skills"],
            "recommendations": recommendations,
            "intent": result["intent"],
            "powered_by": response_source,
        }


# Singleton instance
chatbot_engine = GeminiChatbotEngine()
