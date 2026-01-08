"""
Emotion Analysis API Routes for HeartSpeak.
Uses LangChain-powered emotion translator agent.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.agents.emotion_translator import get_emotion_translator
from app.memory import get_emotion_memory

router = APIRouter()


class EmotionAnalysisRequest(BaseModel):
    """Request model for emotion analysis."""
    image: str  # Base64 encoded image
    userId: str
    callId: Optional[str] = None
    context: Optional[str] = None


class EmotionAnalysisResponse(BaseModel):
    """Response model for emotion analysis."""
    success: bool
    emotions: List[str]
    dominantEmotion: str
    confidence: float
    intensity: Optional[float] = 0.5
    generatedText: str
    faceDetected: Optional[bool] = True
    nuances: Optional[Dict[str, Any]] = None
    faceMetrics: Optional[Dict[str, float]] = None


class EmotionHistoryRequest(BaseModel):
    """Request model for emotion history."""
    callId: str
    userId: str
    limit: Optional[int] = 10


class EmotionHistoryResponse(BaseModel):
    """Response model for emotion history."""
    emotions: List[Dict[str, Any]]
    summary: Optional[str] = None
    transitions: Optional[List[Dict[str, str]]] = None


class EmotionSummaryRequest(BaseModel):
    """Request model for emotion summary."""
    callId: str
    userId: str


class EmotionSummaryResponse(BaseModel):
    """Response model for emotion summary."""
    summary: Optional[str] = None
    dominantEmotions: List[str] = []
    totalAnalyzed: int = 0
    transitions: List[Dict[str, str]] = []


@router.post("/analyze", response_model=EmotionAnalysisResponse)
async def analyze_emotion(request: EmotionAnalysisRequest):
    """
    Analyze facial expressions from an image and generate emotion text.
    
    Uses the LangChain-powered EmotionTranslatorAgent which:
    1. Preprocesses with MediaPipe for face detection
    2. Analyzes emotions with Gemini Vision via LangChain
    3. Generates natural language text with context awareness
    4. Maintains session memory for continuity
    """
    try:
        print(f"[Emotion] Analyzing for user {request.userId}, callId: {request.callId}")
        
        translator = get_emotion_translator()
        
        result = await translator.translate(
            image_base64=request.image,
            user_id=request.userId,
            call_id=request.callId,
            context=request.context
        )
        
        print(f"[Emotion] Result: success={result.get('success')}, emotion={result.get('dominantEmotion')}")
        
        return EmotionAnalysisResponse(
            success=result.get("success", False),
            emotions=result.get("emotions", ["unknown"]),
            dominantEmotion=result.get("dominantEmotion", "unknown"),
            confidence=result.get("confidence", 0),
            intensity=result.get("intensity", 0.5),
            generatedText=result.get("generatedText", "Unable to analyze emotions."),
            faceDetected=result.get("faceDetected", False),
            nuances=result.get("nuances"),
            faceMetrics=result.get("faceMetrics")
        )
        
    except Exception as e:
        import traceback
        print(f"[Emotion] ERROR: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Emotion analysis failed: {str(e)}"
        )


@router.post("/history", response_model=EmotionHistoryResponse)
async def get_emotion_history(request: EmotionHistoryRequest):
    """
    Get emotion history for a call session.
    Includes summary and emotional transitions if enough data exists.
    """
    try:
        memory = get_emotion_memory()
        translator = get_emotion_translator()
        
        emotions = memory.get_call_emotions(
            call_id=request.callId,
            user_id=request.userId,
            limit=request.limit
        )
        
        # Generate summary if enough emotions
        summary = None
        transitions = None
        
        if len(emotions) >= 3:
            summary = translator.get_emotion_summary(
                request.callId, 
                request.userId
            )
            transitions = translator.get_emotion_transitions(
                request.callId,
                request.userId
            )
        
        return EmotionHistoryResponse(
            emotions=emotions,
            summary=summary,
            transitions=transitions
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to get emotion history: {str(e)}"
        )


@router.post("/summary", response_model=EmotionSummaryResponse)
async def get_call_summary(request: EmotionSummaryRequest):
    """
    Get a comprehensive summary of emotions detected during a call.
    """
    try:
        memory = get_emotion_memory()
        translator = get_emotion_translator()
        
        # Get all emotions
        emotions = memory.get_call_emotions(
            call_id=request.callId,
            user_id=request.userId,
            limit=50
        )
        
        # Count emotions
        emotion_counts: Dict[str, int] = {}
        for e in emotions:
            dominant = e.get("dominant", "unknown")
            emotion_counts[dominant] = emotion_counts.get(dominant, 0) + 1
        
        # Sort by frequency
        sorted_emotions = sorted(
            emotion_counts.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        dominant_emotions = [e[0] for e in sorted_emotions[:5]]
        
        # Get summary and transitions
        summary = translator.get_emotion_summary(request.callId, request.userId)
        transitions = translator.get_emotion_transitions(request.callId, request.userId)
        
        return EmotionSummaryResponse(
            summary=summary,
            dominantEmotions=dominant_emotions,
            totalAnalyzed=len(emotions),
            transitions=transitions
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get emotion summary: {str(e)}"
        )


@router.delete("/session/{call_id}/{user_id}")
async def clear_session(call_id: str, user_id: str):
    """
    Clear emotion session data for a call.
    Should be called when a call ends.
    """
    try:
        translator = get_emotion_translator()
        translator.clear_session(call_id, user_id)
        
        return {"success": True, "message": "Session cleared"}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear session: {str(e)}"
        )
