from typing import Any, Dict, List

SKILL_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "programming",
        "name": "Программчлал",
        "category": "Технологи",
        "level": "Анхан шатнаас эхлэх боломжтой",
        "tags": ["Python", "JavaScript", "Веб апп", "Алгоритм"],
        "signals": ["technology", "logic", "curiosity", "project", "career", "portfolio", "solo", "mentor"],
        "nextSteps": ["Python-ийн үндэс", "Жижиг тооцоолуур эсвэл quiz апп", "GitHub дээр бүтээлээ хадгалах"],
        "explanation": "Логик сэтгэлгээ, технологийн сонирхол, асуудлыг алхамчилж шийдэх хандлагатай сайн нийцдэг.",
    },
    {
        "id": "uiux",
        "name": "UI/UX дизайн",
        "category": "Дизайн",
        "level": "Санаа, ажиглалтаас эхэлнэ",
        "tags": ["Figma", "Прототип", "Хэрэглэгчийн судалгаа", "Визуал систем"],
        "signals": ["creative", "visual", "communication", "project", "portfolio", "career", "buddy", "team"],
        "nextSteps": ["Figma дээр 3 дэлгэцийн прототип", "Найзаасаа хэрэглээний санал авах", "Өнгө, spacing-ийн жижиг систем гаргах"],
        "explanation": "Юмыг ойлгомжтой, цэгцтэй болгох сонирхол болон хэрэглэгчийн хэрэгцээг ажиглах чадвартай тохирно.",
    },
    {
        "id": "content",
        "name": "Контент бүтээлт",
        "category": "Бүтээлч",
        "level": "Гар утаснаас эхэлж болно",
        "tags": ["Бичлэг", "Storytelling", "Монтаж", "Сошиал санаа"],
        "signals": ["creative", "writing", "communication", "curiosity", "project", "portfolio", "confidence", "team"],
        "nextSteps": ["30 секундын тайлбар бичлэг", "Долоо хоногийн контент төлөвлөгөө", "Нэг сэдвээр 3 өөр формат турших"],
        "explanation": "Санаагаа богино, ойлгомжтой, сонирхолтой хэлбэрээр хүргэх хүсэлтэй хэрэглэгчдэд сайн тохирдог.",
    },
    {
        "id": "public-speaking",
        "name": "Илтгэх ба харилцаа",
        "category": "Харилцаа",
        "level": "Өдөр тутмын дасгалаар ахина",
        "tags": ["Илтгэл", "Дебат", "Ярилцлага", "Багийн манлайлал"],
        "signals": ["communication", "teamwork", "writing", "mentor", "practice", "confidence", "team", "buddy"],
        "nextSteps": ["1 минутын богино илтгэл бичих", "Дуу хоолойгоо бичиж сонсох", "Найзтайгаа асуулт-хариулт хийх"],
        "explanation": "Хүмүүстэй ажиллах, санаагаа тодорхой илэрхийлэх, өөртөө итгэл нэмэх зорилготой хүчтэй нийцнэ.",
    },
    {
        "id": "data-science",
        "name": "Дата шинжилгээ",
        "category": "Шинжлэх ухаан",
        "level": "Суурь математикаас эхэлнэ",
        "tags": ["Excel", "Python", "График", "Судалгаа"],
        "signals": ["science", "technology", "logic", "curiosity", "reading", "project", "career", "solo"],
        "nextSteps": ["Жижиг хүснэгт цэвэрлэх", "Графикаар дүгнэлт гаргах", "Python pandas-ийн үндэс үзэх"],
        "explanation": "Тоон мэдээллээс утга олох, нотолгоонд тулгуурлаж шийдвэр гаргах сонирхолтой хэрэглэгчдэд тохиромжтой.",
    },
    {
        "id": "entrepreneurship",
        "name": "Бизнес санаа ба төсөл",
        "category": "Бизнес",
        "level": "Асуудал ажиглахаас эхэлнэ",
        "tags": ["Lean canvas", "Судалгаа", "Маркетинг", "Pitch"],
        "signals": ["business", "communication", "teamwork", "curiosity", "project", "career", "team", "mentor"],
        "nextSteps": ["Сургуулийн орчны нэг асуудал сонгох", "5 хүнээс богино ярилцлага авах", "1 хуудас санааны зураглал гаргах"],
        "explanation": "Санаачилгатай, хүмүүстэй ярилцаж хэрэгцээ ойлгох, жижиг төсөл эхлүүлэх хүсэлтэй үед сайн тохирно.",
    },
    {
        "id": "language",
        "name": "Гадаад хэлний практик",
        "category": "Хэл",
        "level": "Өдөр бүрийн жижиг дадлаар ахина",
        "tags": ["Яриа", "Сонсгол", "Үгсийн сан", "Солилцоо"],
        "signals": ["communication", "writing", "discipline", "mentor", "practice", "confidence", "buddy"],
        "nextSteps": ["Өдөрт 10 шинэ үг", "7 хоногт 2 удаа ярианы buddy", "Сонирхдог сэдвээр богино тэмдэглэл бичих"],
        "explanation": "Тогтмол давтах, хүнтэй ярилцаж сурах, өөрийгөө илэрхийлэх зорилготой хэрэглэгчдэд тохирно.",
    },
    {
        "id": "sports-coaching",
        "name": "Спорт ба дасгалжуулалт",
        "category": "Хөдөлгөөн",
        "level": "Аюулгүй суурь дадлаас эхэлнэ",
        "tags": ["Багийн ажил", "Дадал", "Тэсвэр", "Зорилго"],
        "signals": ["movement", "discipline", "teamwork", "practice", "health", "team", "buddy"],
        "nextSteps": ["7 хоногийн бодит хуваарь", "Суурь техникээ зөв сурах", "Ахицын тэмдэглэл хөтлөх"],
        "explanation": "Хөдөлгөөнөөр сурах, тууштай дадал бий болгох, багийн орчинд өсөх хүсэлтэй хэрэглэгчдэд нийцнэ.",
    },
]


def recommend_from_answers(answers: Dict[str, Any]) -> List[Dict[str, Any]]:
    selected_signals = _flatten_answer_values(answers)
    total_signals = max(len(selected_signals), 1)
    recommendations = []

    for skill in SKILL_CATALOG:
        matched = [signal for signal in skill["signals"] if signal in selected_signals]
        base_score = len(matched) / max(len(skill["signals"]), 1)
        coverage_bonus = len(matched) / total_signals
        score = round(min(98, 48 + base_score * 38 + coverage_bonus * 18))
        recommendations.append(
            {
                **skill,
                "score": score,
                "matchedSignals": matched,
                "reasons": _build_reasons(skill, answers, matched),
            }
        )

    recommendations.sort(key=lambda item: item["score"], reverse=True)
    return recommendations[:5]


def _flatten_answer_values(answers: Dict[str, Any]) -> List[str]:
    values: List[str] = []
    for value in answers.values():
        if isinstance(value, list):
            values.extend(str(item) for item in value if item)
        elif value:
            values.append(str(value))
    return values


def _build_reasons(skill: Dict[str, Any], answers: Dict[str, Any], matched: List[str]) -> List[str]:
    reasons = []
    signals = set(skill["signals"])

    if any(value in signals for value in answers.get("interests", [])):
        reasons.append("Таны сонгосон сонирхлын чиглэлтэй давхцаж байна.")
    if any(value in signals for value in answers.get("strengths", [])):
        reasons.append("Одоогийн давуу талууд тань энэ чиглэлд хэрэг болох суурь өгч байна.")
    if answers.get("learningStyle") in signals:
        reasons.append("Таны сурах хэв маяг энэ чиглэлийн эхлэх аргатай нийцэж байна.")
    if answers.get("goal") in signals:
        reasons.append("Ойрын зорилгод тань хэрэг болох бодит үр дүн гаргах боломжтой.")
    if answers.get("collaboration") in signals:
        reasons.append("Таны хүссэн хамтрах хэлбэрээр SkillSwap дээр туршихад тохиромжтой.")

    if not reasons and matched:
        reasons.append("Таны зарим сонголт энэ чиглэлийн суурь чадвартай огтлолцож байна.")

    return reasons[:4]
