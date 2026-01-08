from fastapi import APIRouter
from app.api.v1 import emotion_routes, pattern_routes, chat_routes, avatar_routes

api_router = APIRouter()

api_router.include_router(emotion_routes.router, prefix="/emotion", tags=["Emotion"])
api_router.include_router(pattern_routes.router, prefix="/pattern", tags=["Pattern"])
api_router.include_router(chat_routes.router, prefix="/chat", tags=["Chat"])
api_router.include_router(avatar_routes.router, prefix="/avatar", tags=["Avatar"])
