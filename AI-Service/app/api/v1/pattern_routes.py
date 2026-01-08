"""
Pattern Analysis API Routes for HeartSpeak.
Handles pattern analysis, feature extraction, and interpretation using LangChain + Gemini Vision.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.chains.pattern_analysis_chain import get_pattern_chain

router = APIRouter()


# ============ Request/Response Models ============

class PatternAnalysisRequest(BaseModel):
    """Request model for pattern analysis."""
    image: str  # Base64 encoded image


class PatternFeatures(BaseModel):
    """Pattern visual features."""
    shapeType: str
    colorMood: str
    lineQuality: str
    density: float
    symmetry: float
    dominantColors: Optional[List[str]] = []
    movement: Optional[str] = "static"
    complexity: Optional[str] = "moderate"


class PatternAnalysisResponse(BaseModel):
    """Response model for pattern analysis."""
    success: bool
    features: PatternFeatures
    suggestedEmotion: str
    suggestedIntensity: float
    interpretation: str
    suggestedTags: List[str]
    error: Optional[str] = None


class PatternInterpretRequest(BaseModel):
    """Request model for pattern interpretation."""
    image: str  # Base64 encoded image
    senderName: str
    patternName: str
    emotion: str
    intensity: int  # 0-100
    tags: List[str] = []
    features: Optional[Dict[str, Any]] = None
    libraryPatterns: Optional[List[Dict[str, Any]]] = None


class PatternInterpretResponse(BaseModel):
    """Response model for pattern interpretation."""
    success: bool
    interpretation: str
    emotionalContext: str
    suggestedResponses: List[str]
    patternInfo: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class PatternMatchRequest(BaseModel):
    """Request for matching a pattern against user's library."""
    image: str  # Base64 encoded image of received pattern
    senderId: str
    recipientId: str
    libraryPatterns: List[Dict[str, Any]]  # Sender's pattern library


class PatternMatchResponse(BaseModel):
    """Response with matched patterns and interpretation."""
    success: bool
    matchedPatterns: List[Dict[str, Any]]
    bestMatch: Optional[Dict[str, Any]] = None
    confidence: float
    interpretation: str
    error: Optional[str] = None


# ============ API Endpoints ============

@router.post("/analyze", response_model=PatternAnalysisResponse)
async def analyze_pattern(request: PatternAnalysisRequest):
    """
    Analyze a pattern/drawing and extract visual features.
    Uses Gemini Vision to understand the pattern and suggest emotions.
    
    Args:
        request: Contains base64 encoded image
        
    Returns:
        Pattern features, suggested emotion, and interpretation
    """
    try:
        chain = get_pattern_chain()
        result = await chain.analyze(request.image)
        
        if not result.get("success", False):
            return PatternAnalysisResponse(
                success=False,
                features=PatternFeatures(
                    shapeType="unknown",
                    colorMood="unknown",
                    lineQuality="unknown",
                    density=0.5,
                    symmetry=0.5
                ),
                suggestedEmotion="neutral",
                suggestedIntensity=0.5,
                interpretation="Unable to analyze pattern",
                suggestedTags=[],
                error=result.get("error", "Analysis failed")
            )
        
        features = result.get("features", {})
        
        return PatternAnalysisResponse(
            success=True,
            features=PatternFeatures(
                shapeType=features.get("shapeType", "organic"),
                colorMood=features.get("colorMood", "muted"),
                lineQuality=features.get("lineQuality", "smooth"),
                density=features.get("density", 0.5),
                symmetry=features.get("symmetry", 0.5),
                dominantColors=features.get("dominantColors", []),
                movement=features.get("movement", "static"),
                complexity=features.get("complexity", "moderate")
            ),
            suggestedEmotion=result.get("suggestedEmotion", "calm"),
            suggestedIntensity=result.get("suggestedIntensity", 0.5),
            interpretation=result.get("interpretation", ""),
            suggestedTags=result.get("suggestedTags", [])
        )
        
    except Exception as e:
        print(f"Pattern analysis endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/interpret", response_model=PatternInterpretResponse)
async def interpret_pattern(request: PatternInterpretRequest):
    """
    Generate a human-readable interpretation of a pattern for the recipient.
    Considers the sender's pattern library and emotional associations.
    
    Args:
        request: Pattern details and context
        
    Returns:
        Empathetic interpretation and suggested responses
    """
    try:
        chain = get_pattern_chain()
        result = await chain.interpret(
            image_base64=request.image,
            sender_name=request.senderName,
            pattern_name=request.patternName,
            emotion=request.emotion,
            intensity=request.intensity,
            tags=request.tags,
            features=request.features,
            library_patterns=request.libraryPatterns
        )
        
        return PatternInterpretResponse(
            success=result.get("success", True),
            interpretation=result.get("interpretation", ""),
            emotionalContext=result.get("emotionalContext", ""),
            suggestedResponses=result.get("suggestedResponses", []),
            patternInfo=result.get("patternInfo"),
            error=result.get("error")
        )
        
    except Exception as e:
        print(f"Pattern interpretation endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/match", response_model=PatternMatchResponse)
async def match_pattern(request: PatternMatchRequest):
    """
    Match a received pattern against the sender's pattern library.
    Finds the most similar patterns and generates an interpretation.
    
    Args:
        request: Image and sender's pattern library
        
    Returns:
        Matched patterns with confidence scores and interpretation
    """
    try:
        chain = get_pattern_chain()
        
        # First analyze the received pattern
        analysis = await chain.analyze(request.image)
        
        if not analysis.get("success", False):
            return PatternMatchResponse(
                success=False,
                matchedPatterns=[],
                confidence=0,
                interpretation="Unable to analyze the received pattern.",
                error=analysis.get("error", "Analysis failed")
            )
        
        received_features = analysis.get("features", {})
        received_emotion = analysis.get("suggestedEmotion", "")
        
        # Simple matching logic based on emotion and color mood
        matched_patterns = []
        for pattern in request.libraryPatterns:
            score = 0.0
            
            # Emotion match (highest weight)
            if pattern.get("emotion", "").lower() == received_emotion.lower():
                score += 0.5
            
            # Feature matching
            pattern_features = pattern.get("features", {})
            if pattern_features.get("colorMood") == received_features.get("colorMood"):
                score += 0.2
            if pattern_features.get("shapeType") == received_features.get("shapeType"):
                score += 0.15
            if pattern_features.get("lineQuality") == received_features.get("lineQuality"):
                score += 0.1
            
            # Intensity similarity
            intensity_diff = abs(pattern.get("intensity", 50) - int(analysis.get("suggestedIntensity", 0.5) * 100))
            if intensity_diff < 20:
                score += 0.05
            
            if score > 0.3:  # Threshold for match
                matched_patterns.append({
                    **pattern,
                    "matchScore": round(score, 2)
                })
        
        # Sort by match score
        matched_patterns.sort(key=lambda x: x.get("matchScore", 0), reverse=True)
        
        best_match = matched_patterns[0] if matched_patterns else None
        confidence = best_match.get("matchScore", 0) if best_match else 0
        
        # Generate interpretation based on matches
        if best_match:
            interpretation = f"This pattern closely matches '{best_match.get('name', 'a saved pattern')}' which is associated with {best_match.get('emotion', 'an emotion')}. "
            interpretation += f"The visual elements suggest {received_features.get('colorMood', 'a')} tones with {received_features.get('lineQuality', '')} strokes."
        else:
            interpretation = f"This appears to be a new expression. The pattern suggests {received_emotion} with {received_features.get('colorMood', 'neutral')} tones."
        
        return PatternMatchResponse(
            success=True,
            matchedPatterns=matched_patterns[:5],  # Top 5 matches
            bestMatch=best_match,
            confidence=confidence,
            interpretation=interpretation
        )
        
    except Exception as e:
        print(f"Pattern matching endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint for pattern service."""
    return {"status": "healthy", "service": "pattern-analysis"}
