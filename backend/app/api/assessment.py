from fastapi import APIRouter, HTTPException
from app.ml.assessment_recommender import recommend_from_answers
from app.schemas import AssessmentRequest, AssessmentResponse

router = APIRouter(prefix="/assessment", tags=["Assessment Recommendations"])


@router.post("/recommendations", response_model=AssessmentResponse)
def get_assessment_recommendations(payload: AssessmentRequest):
    if not payload.answers:
        raise HTTPException(status_code=422, detail="Асуулгын хариу хоосон байна.")

    recommendations = recommend_from_answers(payload.answers)
    return {
        "recommendations": recommendations,
        "scoring_note": "Энэ нь зөвлөмжийн оноо бөгөөд сэтгэлзүйн онош эсвэл баталгаат дүгнэлт биш.",
    }
