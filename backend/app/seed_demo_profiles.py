"""Add reversible, non-destructive local demo accounts based on survey skill themes."""

import json
import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BACKEND_DIR.parent
load_dotenv(BACKEND_DIR / ".env")

from app.core.database import Base, SessionLocal, engine  # noqa: E402
from app.core.security import get_password_hash  # noqa: E402
from app.ml.taxonomy import SKILL_TAXONOMY, normalize_skill  # noqa: E402
from app.models import MatchRequest, User, UserSkillOffered, UserSkillWanted  # noqa: E402


DEMO_COUNT = 6
DEMO_EMAIL_TEMPLATE = "swap-demo-{number:03d}@example.com"
LEGACY_EMAIL_TEMPLATE = "swap-demo-{number:03d}@example.invalid"
LEVELS = {
    "анхан": "beginner", "суурь": "beginner", "дунд": "intermediate",
    "ахисан": "advanced", "мэргэшсэн": "expert", "expert": "expert",
}


def _category_for(skill_name: str) -> str:
    canonical = normalize_skill(skill_name).casefold()
    for category, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            if normalize_skill(skill).casefold() == canonical:
                return category
    return "Бусад чадвар"


def seed_demo_profiles() -> None:
    app_env = os.getenv("APP_ENV", "development").strip().lower()
    if app_env not in {"development", "dev", "local", "test"}:
        raise RuntimeError("Demo accounts can only be created when APP_ENV is development/local/test.")

    demo_password = os.getenv("DEMO_ACCOUNT_PASSWORD", "")
    if len(demo_password) < 12:
        raise RuntimeError("Set DEMO_ACCOUNT_PASSWORD to at least 12 characters in backend/.env before seeding.")

    source = PROJECT_DIR / "frontend" / "src" / "data" / "surveyProfiles.json"
    with source.open(encoding="utf-8") as source_file:
        profiles = json.load(source_file)
    profiles = [
        profile for profile in profiles
        if any(skill.get("skill_name") != "Байхгүй" for skill in profile.get("skills_offered", []))
        and profile.get("skills_wanted")
    ][:DEMO_COUNT]
    if len(profiles) < DEMO_COUNT:
        raise RuntimeError("Not enough anonymized sample profiles to create demo accounts.")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    created = 0
    try:
        demo_users = []
        for index, profile in enumerate(profiles, start=1):
            email = DEMO_EMAIL_TEMPLATE.format(number=index)
            user = db.query(User).filter(User.email == email).first()
            if user is None:
                # Migrate only the synthetic accounts created by an earlier local seeder.
                legacy_email = LEGACY_EMAIL_TEMPLATE.format(number=index)
                user = db.query(User).filter(User.email == legacy_email).first()
                if user is not None:
                    user.email = email
            if user is None:
                offered = [skill for skill in profile.get("skills_offered", []) if skill.get("skill_name") != "Байхгүй"]
                wanted = profile.get("skills_wanted", [])
                user = User(
                    email=email,
                    hashed_password=get_password_hash(demo_password),
                    full_name=profile["full_name"],
                    headline=f"Жишээ профайл · {wanted[0]['skill_name']} сурах хүсэлтэй",
                    bio="Судалгааны чадварын хариултаас санаа авсан локал туршилтын профайл. Бодит хүний бүртгэл биш.",
                    location="Жишээ профайл",
                    timezone="Asia/Ulaanbaatar",
                    is_active=True,
                )
                db.add(user)
                db.flush()
                for skill in offered:
                    db.add(UserSkillOffered(
                        user_id=user.id,
                        skill_name=skill["skill_name"],
                        category=_category_for(skill["skill_name"]),
                        proficiency_level=LEVELS.get(skill.get("proficiency_level", "").casefold(), "beginner"),
                        description="Судалгаанд суурилсан туршилтын жишээ чадвар.",
                    ))
                for skill in wanted:
                    db.add(UserSkillWanted(
                        user_id=user.id,
                        skill_name=skill["skill_name"],
                        category=_category_for(skill["skill_name"]),
                        target_level=LEVELS.get(skill.get("target_level", "").casefold(), "beginner"),
                        goals="Локал туршилтын жишээ зорилго.",
                    ))
                created += 1
            demo_users.append(user)

        db.flush()
        # Pending requests let the demo inbox be tested with the documented demo login.
        for sender, receiver in ((demo_users[0], demo_users[1]), (demo_users[2], demo_users[3]), (demo_users[4], demo_users[5])):
            existing = db.query(MatchRequest).filter(
                MatchRequest.sender_id == sender.id,
                MatchRequest.receiver_id == receiver.id,
                MatchRequest.status.in_(["pending", "accepted"]),
            ).first()
            if existing:
                continue
            offered = sender.skills_offered[0].skill_name if sender.skills_offered else "Чадвар солилцоо"
            wanted = receiver.skills_offered[0].skill_name if receiver.skills_offered else "Шинэ чадвар"
            db.add(MatchRequest(
                sender_id=sender.id,
                receiver_id=receiver.id,
                offered_skill_name=offered,
                wanted_skill_name=wanted,
                message="ТУРШИЛТЫН ХҮСЭЛТ — Локал demo хэрэглэгчдийн хоорондын жишээ хүсэлт.",
                status="pending",
            ))

        db.commit()
        print(f"{created} жишээ профайл нэмэгдлээ; 3 demo хүсэлт шалгалаа.")
        print(f"Нэвтрэх имэйл: {DEMO_EMAIL_TEMPLATE.format(number=2)} (ирсэн хүсэлттэй demo account)")
        print("Нууц үг: backend/.env дахь DEMO_ACCOUNT_PASSWORD утга.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_profiles()
