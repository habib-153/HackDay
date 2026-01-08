from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services import gemini_service, openai_service, pattern_service
from app.utils.image_processing import validate_image

router = APIRouter()


class PatternAnalysisRequest(BaseModel):
    image: str  # Base64 encoded image
    userId: str


class PatternFeatures(BaseModel):
    shapeType: str
    colorMood: str
    lineQuality: str
    density: float
    symmetry: float
    description: Optional[str] = None


class PatternAnalysisResponse(BaseModel):
    features: PatternFeatures
    embedding: Optional[List[float]] = None


class PatternInterpretRequest(BaseModel):
    image: str
    senderId: str
    recipientId: str


class PatternInterpretResponse(BaseModel):
    interpretation: str
    matchedPatterns: List[str]
    confidence: float


@router.post("/analyze", response_model=PatternAnalysisResponse)
async def analyze_pattern(request: PatternAnalysisRequest):
    """
    Analyze a pattern/drawing and extract visual features using Gemini Flash.
    """
    try:
        # Validate image
        is_valid, error_msg = validate_image(request.image)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Analyze pattern with Gemini
        features_dict = await gemini_service.analyze_pattern(request.image)
        
        # Generate embedding
        embedding = await gemini_service.generate_embedding(
            request.image,
            features_dict
        )
        
        # Create response
        features = PatternFeatures(**features_dict)
        
        return PatternAnalysisResponse(
            features=features,
            embedding=embedding
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in analyze_pattern: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Pattern analysis failed: {str(e)}"
        )


@router.post("/interpret", response_model=PatternInterpretResponse)
async def interpret_pattern(request: PatternInterpretRequest):
    """
    Interpret a pattern based on sender's pattern library using GPT-4o.
    """
    try:
        # Validate image
        is_valid, error_msg = validate_image(request.image)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Analyze the received pattern
        features_dict = await gemini_service.analyze_pattern(request.image)
        
        # Get sender's pattern library
        sender_patterns = await pattern_service.get_user_patterns(
            request.senderId,
            limit=20
        )
        
        # Find similar patterns
        similar_patterns = await pattern_service.find_similar_patterns(
            features_dict,
            sender_patterns,
            threshold=0.4
        )
        
        # Generate interpretation with GPT-4o
        interpretation_result = await openai_service.interpret_pattern(
            pattern_features=features_dict,
            sender_patterns=similar_patterns,
            sender_name="Your friend"  # TODO: Get actual sender name
        )
        
        return PatternInterpretResponse(**interpretation_result)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in interpret_pattern: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Pattern interpretation failed: {str(e)}"
        )


@router.post("/generate-text")
async def generate_emotion_text(
    emotion: str,
    intensity: float = 0.5,
    context: Optional[str] = None
):
    """
    Generate text suggestions based on emotion.
    """
    try:
        suggestions = await openai_service.generate_emotion_text(
            emotion=emotion,
            intensity=intensity,
            context=context
        )
        
        return {
            "suggestions": suggestions,
            "emotion": emotion,
            "intensity": intensity
        }
        
    except Exception as e:
        print(f"Error generating text: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Text generation failed: {str(e)}"
        )
