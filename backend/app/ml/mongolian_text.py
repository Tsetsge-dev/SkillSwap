"""Normalize common Latin-script Mongolian chat spelling for local NLP."""

import re


_WORD_MAP = {
    "bi": "би", "chi": "чи", "chamtai": "чамтай", "ta": "та", "nadad": "надад", "namaig": "намайг",
    "chamd": "чамд", "chamaas": "чамаас", "minii": "миний", "chinii": "чиний",
    "sain": "сайн", "baina": "байна", "bna": "байна", "bn": "байна", "bnu": "байна уу",
    "baigaa": "байгаа", "bga": "байгаа", "bgaa": "байгаа", "bh": "байх", "buh": "бүх",
    "yaj": "яаж", "yaaj": "яаж", "yamar": "ямар", "ymar": "ямар", "yagaad": "яагаад",
    "yu": "юу", "yuu": "юу", "uu": "уу", "haana": "хаана", "hezee": "хэзээ", "hen": "хэн",
    "surmaar": "сурмаар", "surah": "сурах", "surj": "сурч", "surch": "сурч",
    "surdag": "сурдаг", "suraad": "сураад", "surya": "суръя", "surii": "суръя",
    "zaana": "заана", "zaaj": "зааж", "zaagaad": "заагаад", "zaadag": "заадаг",
    "hiih": "хийх", "hii": "хий", "hiine": "хийнэ", "hiisen": "хийсэн",
    "boloh": "болох", "bolomjtoi": "боломжтой", "bolno": "болно", "bolohgui": "болохгүй",
    "mongol": "монгол", "mongoloor": "монголоор", "hel": "хэл", "kiril": "кирилл",
    "latin": "латин", "angli": "англи", "japan": "япон", "solongos": "солонгос",
    "oros": "орос", "hyatad": "хятад", "uulzaya": "уулзъя", "yavah": "явах",
    "yavmaar": "явмаар", "heregtei": "хэрэгтэй", "hereglegch": "хэрэглэгч",
    "medeh": "мэдэх", "meddeg": "мэддэг", "medne": "мэднэ", "medehgui": "мэдэхгүй",
    "oilgoh": "ойлгох", "oilgono": "ойлгоно", "oilgohgui": "ойлгохгүй",
    "zgr": "зүгээр", "yrn": "ер нь", "yer": "ер", "nileen": "нэлээн", "odoo": "одоо",
    "joohon": "жаахан", "tgd": "тэгээд", "tegeed": "тэгээд", "gehdee": "гэхдээ",
    "bas": "бас", "ene": "энэ", "ter": "тэр", "yg": "яг", "shig": "шиг",
    "uuniig": "үүнийг", "uunees": "үүнээс", "heseg": "хэсэг", "hesegt": "хэсэгт",
    "burtgel": "бүртгэл", "burtguulsen": "бүртгүүлсэн", "hereglegchdiig": "хэрэглэгчдийг",
    "profile": "профайл", "profileuudaas": "профайлуудаас", "huselt": "хүсэлт",
    "yvuulah": "явуулах", "yvuulna": "явуулна", "irsen": "ирсэн", "heden": "хэдэн",
    "sudalgaa": "судалгаа", "sudalgaanaas": "судалгаанаас", "ashiglah": "ашиглах",
    "ashiglaya": "ашиглая", "ashiglacih": "ашиглачих",
    "tugs": "төгс", "ajildag": "ажилладаг", "ajilluul": "ажиллуул",
    "local": "локал", "mini": "миний", "serveriig": "серверийг", "og": "өг",
    "namaas": "надаас",
    "bich": "бич", "bicheed": "бичээд", "bicheerei": "бичээрэй", "bayarlalaa": "баярлалаа",
}

_MONGOLIAN_MARKERS = {
    "yaj", "yaaj", "yamar", "ymar", "yagaad", "yu", "yuu", "haana", "hezee", "hen",
    "bna", "bn", "bnu", "surmaar", "surya", "zaana", "zaaj", "bga", "bgaa", "zgr",
    "yrn", "tgd", "mongoloor", "bayarlalaa", "uuniig", "hesegt", "burtguulsen", "huselt",
    "profileuudaas", "sudalgaanaas", "yvuulah", "ashiglaya", "ashiglacih", "tugs", "serveriig",
}
_LATIN_WORD = re.compile(r"(?<![A-Za-z])[A-Za-z]+(?![A-Za-z])")
_CYRILLIC = re.compile(r"[А-Яа-яЁёӨөҮү]")


def normalize_mongolian_latin(text: str) -> str:
    """Convert common informal Mongolian transliterations while preserving unknown words.

    This is intentionally conservative: original Latin spelling is retained in the
    Gemini prompt, and English skill names not in the Mongolian lexicon stay intact.
    """
    if not isinstance(text, str) or not text:
        return text

    words = {match.group(0).lower() for match in _LATIN_WORD.finditer(text)}
    has_cyrillic = bool(_CYRILLIC.search(text))
    if not has_cyrillic and not (words & _MONGOLIAN_MARKERS) and len(words & _WORD_MAP.keys()) < 2:
        return text

    return _LATIN_WORD.sub(lambda match: _WORD_MAP.get(match.group(0).lower(), match.group(0)), text)
