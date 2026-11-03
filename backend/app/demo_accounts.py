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
        "offered": [("Python", "Programming & IT", "expert"), ("JavaScript / React", "Programming & IT", "advanced")],
        "wanted": [("Япон хэл", "Languages", "intermediate"), ("Гитар", "Music & Audio", "beginner")],
    },
    {
        "email": "yuki.tanaka@skillswap.io",
        "full_name": "Ариунзаяа (Ariunzaya)",
        "headline": "Japanese language tutor",
        "bio": "Demo profile for practicing Japanese and exploring language exchange.",
        "offered": [("Япон хэл", "Languages", "expert"), ("UI/UX дизайн", "Design & Creative", "intermediate")],
        "wanted": [("Python", "Programming & IT", "intermediate"), ("Machine Learning", "AI & Data", "beginner")],
    },
    {
        "email": "elena.rostova@skillswap.io",
        "full_name": "Энхжин (Enkhjin)",
        "headline": "UI/UX designer · Figma",
        "bio": "Demo profile for exchanging design and language skills.",
        "offered": [("UI/UX дизайн", "Design & Creative", "expert"), ("Graphic design", "Design & Creative", "advanced")],
        "wanted": [("Англи хэл", "Languages", "intermediate"), ("Web development", "Programming & IT", "beginner")],
    },
    {
        "email": "marcus.vance@skillswap.io",
        "full_name": "Тэмүүлэн (Temuulen)",
        "headline": "Music producer · Piano player",
        "bio": "Demo profile for exchanging music and marketing skills.",
        "offered": [("Төгөлдөр хуур", "Music & Audio", "expert"), ("Music production", "Music & Audio", "advanced")],
        "wanted": [("Digital marketing", "Business & Marketing", "intermediate"), ("Video editing", "Design & Creative", "beginner")],
    },
    {
        "email": "sophia.martinez@skillswap.io",
        "full_name": "Сарнай (Sarnai)",
        "headline": "Digital marketing strategist · Spanish tutor",
        "bio": "Demo profile for exploring marketing, languages, and music.",
        "offered": [("Digital marketing", "Business & Marketing", "expert"), ("Испани хэл", "Languages", "advanced")],
        "wanted": [("Төгөлдөр хуур", "Music & Audio", "beginner"), ("Франц хэл", "Languages", "beginner")],
    },
    {
        "email": "khangal.morin@skillswap.io",
        "full_name": "Хангал (Khangal)",
        "headline": "Morin khuur musician · Traditional music teacher",
        "bio": "Demo profile for learning traditional Mongolian music and mathematics.",
        "offered": [("Морин хуур", "Music & Audio", "expert"), ("Монгол бичиг", "Languages", "advanced")],
        "wanted": [("Математик", "Science & School", "intermediate"), ("Англи хэл", "Languages", "intermediate")],
    },
    {
        "email": "otgon.math@skillswap.io",
        "full_name": "Отгонбаяр (Otgonbayar)",
        "headline": "Mathematics and physics tutor",
        "bio": "Demo profile for exploring STEM tutoring and music lessons.",
        "offered": [("Математик", "Science & School", "expert"), ("Физик", "Science & School", "advanced")],
        "wanted": [("Морин хуур", "Music & Audio", "beginner"), ("Шатар", "Health & Sports", "intermediate")],
    },
    {
        "email": "bat.chess@skillswap.io",
        "full_name": "Бат-Эрдэнэ (Bat-Erdene)",
        "headline": "Chess coach · Yoga instructor",
        "bio": "Demo profile for exploring chess, yoga, and digital design.",
        "offered": [("Шатар", "Health & Sports", "expert"), ("Иог", "Health & Sports", "intermediate")],
        "wanted": [("3D design", "Design & Creative", "beginner"), ("Солонгос хэл", "Languages", "beginner")],
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

