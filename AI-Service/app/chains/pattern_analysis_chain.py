"""
LangChain Pattern Analysis Chain for HeartSpeak.
Analyzes visual patterns/drawings using Gemini Vision to extract features and suggest emotions.
"""
import json
import base64
from typing import Optional, Dict, Any, List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from pydantic import BaseModel, Field
from app.config import settings


class PatternFeatures(BaseModel):
    """Schema for extracted pattern features."""
    shapeType: str = Field(description="Type of shapes: spiral, angular, flowing, geometric, chaotic, organic")
    colorMood: str = Field(description="Overall color mood: warm, cool, vibrant, muted, monochrome")
    lineQuality: str = Field(description="Quality of lines: smooth, jagged, continuous, broken")
    density: float = Field(description="How dense/filled the pattern is (0-1)")
    symmetry: float = Field(description="Degree of symmetry (0-1)")
    dominantColors: List[str] = Field(description="List of dominant hex colors detected")
    movement: str = Field(description="Perceived movement: static, flowing, dynamic, chaotic")
    complexity: str = Field(description="Visual complexity: simple, moderate, complex")


class PatternAnalysisOutput(BaseModel):
    """Schema for pattern analysis output."""
    features: PatternFeatures = Field(description="Extracted visual features")
    suggestedEmotion: str = Field(description="AI-suggested emotion that matches this pattern")
    suggestedIntensity: float = Field(description="Suggested emotional intensity (0-1)")
    interpretation: str = Field(description="Brief interpretation of what this pattern might express")
    suggestedTags: List[str] = Field(description="Suggested tags for this pattern")


PATTERN_ANALYSIS_PROMPT = """You are an expert visual pattern analyst for HeartSpeak, an AI-powered communication platform helping speech-impaired individuals express their feelings through visual patterns.

Analyze the provided pattern/drawing image and extract meaningful emotional features. This pattern will be used as a personal "emotional signature" - a visual way for the user to express a specific feeling.

## Analysis Guidelines:

### 1. Shape Analysis
Identify the predominant shape types:
- **spiral**: Circular, winding patterns (often: confusion, contemplation, cycles)
- **angular**: Sharp edges, triangles, zigzags (often: frustration, energy, alertness)
- **flowing**: Smooth curves, waves (often: calm, peace, gentleness)
- **geometric**: Regular shapes, patterns (often: order, stability, logic)
- **chaotic**: Random, unstructured (often: anxiety, overwhelm, creativity)
- **organic**: Natural, irregular curves (often: growth, life, comfort)

### 2. Color Psychology
Analyze the color palette:
- **warm** (reds, oranges, yellows): energy, passion, warmth, excitement
- **cool** (blues, greens, purples): calm, sadness, tranquility, reflection
- **vibrant**: High saturation = intense emotions
- **muted**: Low saturation = subtle, gentle feelings
- **monochrome**: Single color family = focused, contemplative

### 3. Line Quality
- **smooth**: Relaxed, peaceful state
- **jagged**: Tension, agitation, energy
- **continuous**: Flow, connection, persistence
- **broken**: Uncertainty, fragmentation, hesitation

### 4. Suggested Emotions (choose most appropriate):
joy, calm, love, sadness, anxiety, excitement, confusion, gratitude, 
hope, loneliness, frustration, peace, curiosity, fear, contentment

### 5. Suggested Tags
Provide 3-5 descriptive tags that capture the essence of this pattern.

Respond with ONLY a valid JSON object matching this exact schema:
{{
    "features": {{
        "shapeType": "flowing",
        "colorMood": "warm",
        "lineQuality": "smooth",
        "density": 0.6,
        "symmetry": 0.3,
        "dominantColors": ["#FF6B6B", "#4ECDC4"],
        "movement": "flowing",
        "complexity": "moderate"
    }},
    "suggestedEmotion": "calm",
    "suggestedIntensity": 0.65,
    "interpretation": "A gentle, flowing pattern with warm undertones suggesting a peaceful yet engaged emotional state.",
    "suggestedTags": ["peaceful", "gentle", "warm"]
}}"""


PATTERN_INTERPRETATION_PROMPT = """You are an empathetic emotion interpreter for HeartSpeak. A user has sent a visual pattern to express their feelings to someone.

## Context:
- Sender: {sender_name}
- Pattern Name: {pattern_name}
- Associated Emotion: {emotion}
- Intensity: {intensity}%
- Tags: {tags}
- Pattern Features: {features}

## Pattern Library Context (sender's other patterns for this emotion):
{library_context}

## Your Task:
Generate a warm, empathetic interpretation of what the sender is trying to express. The interpretation should:
1. Be written in second person ("They are feeling...")
2. Reference the specific visual elements and what they represent for this person
3. Be sensitive and supportive in tone
4. Be 2-3 sentences long
5. Help the recipient understand the emotional message

Respond with ONLY a JSON object:
{{
    "interpretation": "Your empathetic interpretation here",
    "emotionalContext": "Brief context about the emotional state",
    "suggestedResponses": ["Possible response 1", "Possible response 2"]
}}"""


class PatternAnalysisChain:
    """
    LangChain-based pattern analysis chain using Gemini Vision.
    Analyzes drawn patterns to extract visual features and suggest emotions.
    """
    
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="models/gemini-3-flash-preview",
            google_api_key=settings.gemini_api_key,
            temperature=0.4,
            convert_system_message_to_human=True
        )
    
    def _prepare_image_content(self, image_base64: str) -> Dict[str, Any]:
        """Prepare image for Gemini Vision."""
        # Remove data URI prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        return {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/png;base64,{image_base64}"
            }
        }
    
    async def analyze(self, image_base64: str) -> Dict[str, Any]:
        """
        Analyze a pattern image and extract features.
        
        Args:
            image_base64: Base64 encoded image of the pattern
            
        Returns:
            Dictionary with pattern analysis results
        """
        try:
            # Prepare the image
            image_content = self._prepare_image_content(image_base64)
            
            # Create the message with image
            message = HumanMessage(
                content=[
                    {"type": "text", "text": PATTERN_ANALYSIS_PROMPT},
                    image_content
                ]
            )
            
            # Invoke the LLM
            response = await self.llm.ainvoke([message])
            
            # Parse the response - handle both string and list content
            result_text = response.content
            if isinstance(result_text, list):
                result_text = result_text[0] if result_text else ""
                if hasattr(result_text, 'text'):
                    result_text = result_text.text
                elif isinstance(result_text, dict):
                    result_text = result_text.get('text', str(result_text))
            
            result_text = str(result_text)
            
            # Clean up response if wrapped in markdown
            if "```" in result_text:
                result_text = result_text.split("```")[1]
                if result_text.startswith("json"):
                    result_text = result_text[4:]
                result_text = result_text.strip()
            
            result = json.loads(result_text)
            
            # Validate and normalize
            result = self._validate_result(result)
            
            return {
                "success": True,
                **result
            }
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            return self._default_response(f"Failed to parse analysis: {e}")
        except Exception as e:
            print(f"Pattern analysis error: {e}")
            return self._default_response(str(e))
    
    async def interpret(
        self,
        image_base64: str,
        sender_name: str,
        pattern_name: str,
        emotion: str,
        intensity: int,
        tags: List[str],
        features: Optional[Dict[str, Any]] = None,
        library_patterns: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Generate an interpretation of a pattern for the recipient.
        
        Args:
            image_base64: Base64 encoded image
            sender_name: Name of the person who sent the pattern
            pattern_name: Name of the pattern
            emotion: Associated emotion
            intensity: Emotional intensity (0-100)
            tags: Pattern tags
            features: Pre-extracted features (optional)
            library_patterns: Other patterns from sender for context (optional)
            
        Returns:
            Dictionary with interpretation
        """
        try:
            # If features not provided, analyze the pattern first
            if not features:
                analysis = await self.analyze(image_base64)
                if analysis.get("success"):
                    features = analysis.get("features", {})
                else:
                    features = {}
            
            # Build library context
            library_context = "No other patterns available for comparison."
            if library_patterns:
                similar = [p for p in library_patterns if p.get("emotion") == emotion]
                if similar:
                    library_context = f"The sender has {len(similar)} other patterns associated with '{emotion}'. "
                    library_context += f"This suggests a personal vocabulary for expressing this emotion."
            
            # Format the prompt
            prompt = PATTERN_INTERPRETATION_PROMPT.format(
                sender_name=sender_name,
                pattern_name=pattern_name,
                emotion=emotion,
                intensity=intensity,
                tags=", ".join(tags) if tags else "none",
                features=json.dumps(features, indent=2),
                library_context=library_context
            )
            
            # Prepare the image
            image_content = self._prepare_image_content(image_base64)
            
            # Create the message with image
            message = HumanMessage(
                content=[
                    {"type": "text", "text": prompt},
                    image_content
                ]
            )
            
            # Invoke the LLM
            response = await self.llm.ainvoke([message])
            
            # Parse the response - handle both string and list content
            result_text = response.content
            if isinstance(result_text, list):
                result_text = result_text[0] if result_text else ""
                if hasattr(result_text, 'text'):
                    result_text = result_text.text
                elif isinstance(result_text, dict):
                    result_text = result_text.get('text', str(result_text))
            
            result_text = str(result_text)
            
            # Clean up response if wrapped in markdown
            if "```" in result_text:
                result_text = result_text.split("```")[1]
                if result_text.startswith("json"):
                    result_text = result_text[4:]
                result_text = result_text.strip()
            
            result = json.loads(result_text)
            
            return {
                "success": True,
                "interpretation": result.get("interpretation", ""),
                "emotionalContext": result.get("emotionalContext", ""),
                "suggestedResponses": result.get("suggestedResponses", []),
                "patternInfo": {
                    "name": pattern_name,
                    "emotion": emotion,
                    "intensity": intensity,
                    "tags": tags
                }
            }
            
        except Exception as e:
            print(f"Pattern interpretation error: {e}")
            return {
                "success": False,
                "interpretation": f"{sender_name} sent you a pattern expressing {emotion}. The visual elements suggest a {intensity}% intensity.",
                "emotionalContext": f"Expressing {emotion}",
                "suggestedResponses": [
                    f"I understand you're feeling {emotion}",
                    "Thank you for sharing this with me"
                ],
                "error": str(e)
            }
    
    def _validate_result(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and normalize analysis result."""
        features = result.get("features", {})
        
        valid_features = {
            "shapeType": features.get("shapeType", "organic"),
            "colorMood": features.get("colorMood", "muted"),
            "lineQuality": features.get("lineQuality", "smooth"),
            "density": min(max(features.get("density", 0.5), 0), 1),
            "symmetry": min(max(features.get("symmetry", 0.5), 0), 1),
            "dominantColors": features.get("dominantColors", ["#6B7280"]),
            "movement": features.get("movement", "static"),
            "complexity": features.get("complexity", "moderate")
        }
        
        return {
            "features": valid_features,
            "suggestedEmotion": result.get("suggestedEmotion", "calm"),
            "suggestedIntensity": min(max(result.get("suggestedIntensity", 0.5), 0), 1),
            "interpretation": result.get("interpretation", "A unique visual expression."),
            "suggestedTags": result.get("suggestedTags", [])
        }
    
    def _default_response(self, error: str = "") -> Dict[str, Any]:
        """Return a default response on error."""
        return {
            "success": False,
            "features": {
                "shapeType": "unknown",
                "colorMood": "unknown",
                "lineQuality": "unknown",
                "density": 0.5,
                "symmetry": 0.5,
                "dominantColors": [],
                "movement": "unknown",
                "complexity": "unknown"
            },
            "suggestedEmotion": "neutral",
            "suggestedIntensity": 0.5,
            "interpretation": "Unable to analyze pattern.",
            "suggestedTags": [],
            "error": error
        }


# Singleton instance
_pattern_chain: Optional[PatternAnalysisChain] = None


def get_pattern_chain() -> PatternAnalysisChain:
    """Get the singleton pattern analysis chain."""
    global _pattern_chain
    if _pattern_chain is None:
        _pattern_chain = PatternAnalysisChain()
    return _pattern_chain

