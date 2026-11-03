import unittest

from app.ml.chatbot_utils import build_gemini_contents, parse_gemini_payload
from app.ml.mongolian_text import normalize_mongolian_latin


class ChatbotUtilsTests(unittest.TestCase):
    def test_common_latin_mongolian_chat_is_normalized_to_cyrillic(self):
        self.assertEqual(normalize_mongolian_latin("sain bna uu"), "сайн байна уу")
        self.assertEqual(
            normalize_mongolian_latin("bi python zaana, solongos hel surmaar bna"),
            "би python заана, солонгос хэл сурмаар байна",
        )

    def test_english_and_mixed_script_are_not_damaged(self):
        self.assertEqual(normalize_mongolian_latin("What is WebRTC?"), "What is WebRTC?")
        self.assertEqual(normalize_mongolian_latin("Би python zaana"), "Би python заана")

    def test_common_platform_terms_in_latin_mongolian_are_normalized(self):
        self.assertEqual(
            normalize_mongolian_latin("uuniig local serveriig mini og"),
            "үүнийг локал серверийг миний өг",
        )

    def test_history_drops_initial_assistant_greeting_and_preserves_turn_order(self):
        contents = build_gemini_contents(
            [
                {"role": "assistant", "content": "Initial welcome"},
                {"role": "user", "content": "Би Python заана"},
                {"role": "assistant", "content": "Ойлголоо"},
            ],
            "Япон хэл сурмаар байна",
        )
        self.assertEqual([item["role"] for item in contents], ["user", "model", "user"])
        self.assertEqual(contents[-1]["parts"][0]["text"], "Япон хэл сурмаар байна")
        self.assertNotIn("Initial welcome", str(contents))

    def test_history_is_bounded_and_separate_per_request(self):
        first = build_gemini_contents([], "Нууц асуулт")
        second = build_gemini_contents([], "Өөр асуулт")
        self.assertNotIn("Нууц асуулт", str(second))
        self.assertEqual(first[0]["parts"][0]["text"], "Нууц асуулт")
        many_turns = [{"role": "user", "content": str(index)} for index in range(12)]
        bounded = build_gemini_contents(many_turns, "Одоо")
        self.assertLessEqual(len(bounded), 9)

    def test_gemini_payload_parses_and_normalizes_contract(self):
        parsed = parse_gemini_payload({
            "candidates": [{"content": {"parts": [{"text": (
                '{"reply":"Сайн байна уу","offered_skills":[" Python ", 3],'
                '"wanted_skills":["Япон хэл"],"intent":"not_allowed"}'
            )}]}}]
        })
        self.assertEqual(parsed["reply"], "Сайн байна уу")
        self.assertEqual(parsed["offered_skills"], ["Python"])
        self.assertEqual(parsed["wanted_skills"], ["Япон хэл"])
        self.assertEqual(parsed["intent"], "general")

    def test_invalid_gemini_payload_is_rejected_for_local_fallback(self):
        self.assertIsNone(parse_gemini_payload({"candidates": []}))
        self.assertIsNone(parse_gemini_payload({
            "candidates": [{"content": {"parts": [{"text": "{}"}]}}]
        }))


if __name__ == "__main__":
    unittest.main()
