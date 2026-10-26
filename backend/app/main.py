import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base
import app.models # Register all models

# Import Routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.skills import router as skills_router
from app.api.matches import router as matches_router
from app.api.requests import router as requests_router
from app.api.messages import router as messages_router
from app.api.sessions import router as sessions_router
from app.api.chatbot import router as chatbot_router
from app.api.websocket import router as ws_router
from app.api.assessment import router as assessment_router
from app.api.calls import router as calls_router
from app.api.survey_recommendations import router as survey_recommendations_router

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SkillSwap - AI-Powered Bilateral Skill Exchange & Collaboration Platform"
)

FRONTEND_DIST = Path(__file__).resolve().parents[1] / "frontend-dist"

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads directory for static asset delivery
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(skills_router, prefix=settings.API_V1_STR)
app.include_router(matches_router, prefix=settings.API_V1_STR)
app.include_router(requests_router, prefix=settings.API_V1_STR)
app.include_router(messages_router, prefix=settings.API_V1_STR)
app.include_router(sessions_router, prefix=settings.API_V1_STR)
app.include_router(chatbot_router, prefix=settings.API_V1_STR)
app.include_router(assessment_router, prefix=settings.API_V1_STR)
app.include_router(calls_router, prefix=settings.API_V1_STR)
app.include_router(survey_recommendations_router, prefix=settings.API_V1_STR)
app.include_router(ws_router)

@app.get("/")
def root():
    frontend_index = FRONTEND_DIST / "index.html"
    if frontend_index.is_file():
        return FileResponse(frontend_index)
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# In a Render single-service deployment, the API and built React app share one
# origin. Local development continues to use Vite on port 5173.
@app.get("/{frontend_path:path}", include_in_schema=False)
def frontend_routes(frontend_path: str):
    index_file = FRONTEND_DIST / "index.html"
    if not index_file.is_file():
        return {"detail": "Not Found"}

    requested_file = (FRONTEND_DIST / frontend_path).resolve()
    if requested_file.is_relative_to(FRONTEND_DIST.resolve()) and requested_file.is_file():
        return FileResponse(requested_file)
    return FileResponse(index_file)
