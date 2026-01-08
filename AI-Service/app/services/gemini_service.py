"""
Gemini AI Service for HeartSpeak
Handles all Gemini API interactions for emotion analysis and text generation.
"""
import base64
from typing import Optional
import google.generativeai as genai
from app.config import settings


class GeminiService:
    """Service for interacting with Google's Gemini API."""
    
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.vision_model = genai.GenerativeModel("models/gemini-3-flash-preview")
        self.text_model = genai.GenerativeModel("models/gemini-3-flash-preview")
    
    async def analyze_facial_expression(
        self,
        image_base64: str,
        context: Optional[str] = None
    ) -> dict:
        """
        Analyze facial expressions from a base64 encoded image.
        
        Args:
            image_base64: Base64 encoded image string (may include data URI prefix)
            context: Optional conversation context for better analysis
            
        Returns:
            Dictionary containing detected emotions, dominant emotion, and confidence
        """
        # Remove data URI prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_base64)
        
        # Create image part for Gemini
        image_part = {
            "mime_type": "image/jpeg",
            "data": image_bytes
        }
        
        # Craft the prompt for emotion analysis
        prompt = """Analyze the facial expression in this image. Focus on:
1. Primary emotions visible (choose from: happy, sad, angry, fearful, surprised, disgusted, contempt, neutral, thoughtful, excited, confused, hopeful, loving, peaceful, anxious, frustrated)
2. Micro-expressions and subtle cues
3. Body language indicators if visible
4. Overall emotional state

Respond in this exact JSON format (no markdown, just raw JSON):
{
    "emotions": ["emotion1", "emotion2", "emotion3"],
    "dominantEmotion": "primary_emotion",
    "confidence": 0.85,
    "nuances": {
        "eyeContact": "direct/averted/looking_away",
        "mouthExpression": "description",
        "eyebrowPosition": "raised/neutral/furrowed",
        "overallTension": "relaxed/moderate/tense"
    },
    "intensity": 0.7
}

Be accurate and specific. If no face is clearly visible, set confidence below 0.3."""

        if context:
            prompt += f"\n\nConversation context: {context}"
        
        try:
            response = await self.vision_model.generate_content_async([prompt, image_part])
            result_text = response.text.strip()
            
            # Clean up response (remove markdown if present)
            if result_text.startswith("```"):
                result_text = result_text.split("```")[1]
                if result_text.startswith("json"):
                    result_text = result_text[4:]
                result_text = result_text.strip()
            
            import json
            return json.loads(result_text)
            
        except Exception as e:
            print(f"Gemini analysis error: {e}")
            # Return default response on error
            return {
                "emotions": ["neutral"],
                "dominantEmotion": "neutral",
                "confidence": 0.3,
                "nuances": {
                    "eyeContact": "unknown",
                    "mouthExpression": "unknown",
                    "eyebrowPosition": "neutral",
                    "overallTension": "unknown"
                },
                "intensity": 0.5
            }
    
    async def generate_emotion_text(
        self,
        emotion_data: dict,
        context: Optional[str] = None,
        previous_emotions: Optional[list] = None
    ) -> str:
        """
        Generate natural language description of detected emotions.
        
        Args:
            emotion_data: Dictionary containing emotion analysis results
            context: Optional context about the relationship/conversation
            previous_emotions: List of previously detected emotions for continuity
            
        Returns:
            Natural language string describing the emotional state
        """
        emotions = emotion_data.get("emotions", ["neutral"])
        dominant = emotion_data.get("dominantEmotion", "neutral")
        confidence = emotion_data.get("confidence", 0.5)
        nuances = emotion_data.get("nuances", {})
        intensity = emotion_data.get("intensity", 0.5)
        
        prompt = f"""Generate a brief, empathetic message describing someone's emotional state for their communication partner.

Detected emotions: {emotions}
Dominant emotion: {dominant}
Confidence: {confidence}
Intensity: {intensity}
Nuances: {nuances}

Guidelines:
- Be warm and supportive in tone
- Keep it to 1-2 sentences
- Focus on helping the receiver understand the sender's emotional state
- Use phrases like "They seem to be...", "Your friend appears...", "They're showing signs of..."
- If confidence is low (< 0.5), be more tentative in wording
- Consider emotional transitions if previous emotions are provided"""

        if context:
            prompt += f"\nContext: {context}"
        
        if previous_emotions:
            prompt += f"\nPrevious emotions detected: {previous_emotions[-3:]}"
            prompt += "\nNote any emotional shifts in your description."
        
        prompt += "\n\nRespond with ONLY the description text, no quotes or extra formatting."
        
        try:
            response = await self.text_model.generate_content_async(prompt)
            return response.text.strip().strip('"')
        except Exception as e:
            print(f"Text generation error: {e}")
            return f"Your friend seems {dominant} at the moment."


# Singleton instance
_gemini_service: Optional[GeminiService] = None

def get_gemini_service() -> GeminiService:
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service
