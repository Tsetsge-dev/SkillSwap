"""Create harmless public demo profiles without touching existing accounts."""

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models import User, UserSkillOffered, UserSkillWanted


DEMO_PASSWORD = "password123"

DEMO_PROFILES = [
    {
        "email": "alex.chen@skillswap.io",
        "full_name": "Билгүүн (Bilguun)",
        "headline": "Full-stack engineer · Python developer",
        "bio": "Demo profile for exploring programming skill exchanges.",
        "offered": [("Python", "Програмчлал & IT", "expert"), ("JavaScript / React", "Програмчлал & IT", "advanced")],
        "wanted": [("Япон хэл", "Гадаад хэл", "intermediate"), ("Гитар", "Хөгжим & Аудио", "beginner")],
    },
    {
        "email": "yuki.tanaka@skillswap.io",
        "full_name": "Ариунзаяа (Ariunzaya)",
        "headline": "Japanese language tutor",
        "bio": "Demo profile for practicing Japanese and exploring language exchange.",
        "offered": [("Япон хэл", "Гадаад хэл", "expert"), ("UI/UX дизайн", "Дизайн & Бүтээлч", "intermediate")],
        "wanted": [("Python", "Програмчлал & IT", "intermediate"), ("Machine Learning", "Хиймэл оюун & Дата", "beginner")],
    },
    {
        "email": "elena.rostova@skillswap.io",
        "full_name": "Энхжин (Enkhjin)",
        "headline": "UI/UX designer · Figma",
        "bio": "Demo profile for exchanging design and language skills.",
        "offered": [("UI/UX дизайн", "Дизайн & Бүтээлч", "expert"), ("Graphic design", "Дизайн & Бүтээлч", "advanced")],
        "wanted": [("Англи хэл", "Гадаад хэл", "intermediate"), ("Web development", "Програмчлал & IT", "beginner")],
    },
    {
        "email": "marcus.vance@skillswap.io",
        "full_name": "Тэмүүлэн (Temuulen)",
        "headline": "Music producer · Piano player",
        "bio": "Demo profile for exchanging music and marketing skills.",
        "offered": [("Төгөлдөр хуур", "Хөгжим & Аудио", "expert"), ("Music production", "Хөгжим & Аудио", "advanced")],
        "wanted": [("Digital marketing", "Бизнес & Маркетинг", "intermediate"), ("Video editing", "Дизайн & Бүтээлч", "beginner")],
    },
    {
        "email": "sophia.martinez@skillswap.io",
        "full_name": "Сарнай (Sarnai)",
        "headline": "Digital marketing strategist · Spanish tutor",
        "bio": "Demo profile for exploring marketing, languages, and music.",
        "offered": [("Digital marketing", "Бизнес & Маркетинг", "expert"), ("Испани хэл", "Гадаад хэл", "advanced")],
        "wanted": [("Төгөлдөр хуур", "Хөгжим & Аудио", "beginner"), ("Франц хэл", "Гадаад хэл", "beginner")],
    },
    {
        "email": "khangal.morin@skillswap.io",
        "full_name": "Хангал (Khangal)",
        "headline": "Morin khuur musician · Traditional music teacher",
        "bio": "Demo profile for learning traditional Mongolian music and mathematics.",
        "offered": [("Морин хуур", "Хөгжим & Аудио", "expert"), ("Монгол бичиг", "Гадаад хэл", "advanced")],
        "wanted": [("Математик", "Шинжлэх ухаан & Хичээл", "intermediate"), ("Англи хэл", "Гадаад хэл", "intermediate")],
    },
    {
        "email": "otgon.math@skillswap.io",
        "full_name": "Отгонбаяр (Otgonbayar)",
        "headline": "Mathematics and physics tutor",
        "bio": "Demo profile for exploring STEM tutoring and music lessons.",
        "offered": [("Математик", "Шинжлэх ухаан & Хичээл", "expert"), ("Физик", "Шинжлэх ухаан & Хичээл", "advanced")],
        "wanted": [("Морин хуур", "Хөгжим & Аудио", "beginner"), ("Шатар", "Эрүүл мэнд & Спорт", "intermediate")],
    },
    {
        "email": "bat.chess@skillswap.io",
        "full_name": "Бат-Эрдэнэ (Bat-Erdene)",
        "headline": "Chess coach · Yoga instructor",
        "bio": "Demo profile for exploring chess, yoga, and digital design.",
        "offered": [("Шатар", "Эрүүл мэнд & Спорт", "expert"), ("Иог", "Эрүүл мэнд & Спорт", "intermediate")],
        "wanted": [("3D design", "Дизайн & Бүтээлч", "beginner"), ("Солонгос хэл", "Гадаад хэл", "beginner")],
    },
]


def ensure_demo_accounts() -> int:
    """Insert missing demo users and their skills; never edit existing users."""
    db = SessionLocal()
    created = 0
    try:
        for profile in DEMO_PROFILES:
            if db.query(User.id).filter(User.email == profile["email"]).first():
                continue

            user = User(
                email=profile["email"],
                hashed_password=get_password_hash(DEMO_PASSWORD),
                full_name=profile["full_name"],
                headline=profile["headline"],
                bio=profile["bio"],
                location="Ulaanbaatar, Mongolia",
                timezone="Asia/Ulaanbaatar",
                is_active=True,
            )
            db.add(user)
            db.flush()

            for skill_name, category, level in profile["offered"]:
                db.add(UserSkillOffered(
                    user_id=user.id,
                    skill_name=skill_name,
                    category=category,
                    proficiency_level=level,
                    description="Fictional demo skill for presentation purposes.",
                ))
            for skill_name, category, level in profile["wanted"]:
                db.add(UserSkillWanted(
                    user_id=user.id,
                    skill_name=skill_name,
                    category=category,
                    target_level=level,
                    goals="Demo learning goal.",
                ))
            created += 1

        db.commit()
        return created
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

