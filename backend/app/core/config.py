import os
import secrets
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from pydantic_settings import BaseSettings


BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")

_APP_ENV = os.getenv("APP_ENV", "development").strip().lower()
_DEVELOPMENT_SECRET = secrets.token_urlsafe(48) if _APP_ENV in {"dev", "development", "local", "test"} else ""


class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillSwap"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    APP_ENV: str = _APP_ENV
    SECRET_KEY: str = os.getenv("SECRET_KEY") or _DEVELOPMENT_SECRET
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./skillswap.db")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

    # Comma-separated TURN URLs. Credentials are generated server-side per user.
    TURN_URLS: str = os.getenv("TURN_URLS", "")
    TURN_SHARED_SECRET: str = os.getenv("TURN_SHARED_SECRET", "")
    TURN_CREDENTIAL_TTL_SECONDS: int = int(os.getenv("TURN_CREDENTIAL_TTL_SECONDS", "3600"))

    UPLOAD_DIR: str = str(BACKEND_DIR / "uploads")
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    class Config:
        case_sensitive = True


settings = Settings()
if settings.APP_ENV.strip().lower() not in {"dev", "development", "local", "test"} and len(settings.SECRET_KEY) < 32:
    raise RuntimeError("SECRET_KEY must be set to at least 32 characters outside development.")

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
for folder in ("photos", "audio", "documents", "avatars"):
    os.makedirs(os.path.join(settings.UPLOAD_DIR, folder), exist_ok=True)
