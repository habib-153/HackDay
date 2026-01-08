"""
LangChain Emotion Analysis Chain for HeartSpeak.
Analyzes facial expressions from images using Gemini Vision.
"""
import json
from typing import Optional, Dict, Any, List
from collections import deque
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.messages import HumanMessage
from pydantic import BaseModel, Field
from app.config import settings


class EmotionAnalysisOutput(BaseModel):
    """Schema for emotion analysis output."""
    emotions: List[str] = Field(description="List of detected emotions")
    dominantEmotion: str = Field(description="The primary/dominant emotion detected")
    confidence: float = Field(description="Confidence score between 0 and 1")
    intensity: float = Field(description="Intensity of the emotion between 0 and 1")
    nuances: Dict[str, str] = Field(description="Detailed nuances like eye contact, mouth expression, etc.")


EMOTION_ANALYSIS_PROMPT = """You are an expert emotion analyst for HeartSpeak, an AI-powered communication platform helping speech-impaired individuals express their feelings.

Analyze the facial expression in the provided image with extreme care and empathy. Focus on:

1. **Primary Emotions**: Identify all visible emotions from this list:
   - happy, sad, angry, fearful, surprised, disgusted, contempt
   - neutral, thoughtful, excited, confused, hopeful, loving
   - peaceful, anxious, frustrated, curious, grateful, concerned

2. **Micro-expressions**: Look for subtle cues that indicate underlying emotions

3. **Non-verbal Cues**: 
   - Eye contact (direct, averted, looking away)
   - Mouth expression (smiling, frowning, neutral, tense)
   - Eyebrow position (raised, neutral, furrowed)
   - Overall facial tension (relaxed, moderate, tense)

4. **Context Awareness**: Consider the provided context if any

{context}

IMPORTANT GUIDELINES:
- Be accurate but compassionate in your analysis
- If the face is partially visible or image quality is low, reduce confidence
- Consider cultural differences in emotional expression
- Always prioritize the person's dignity in your analysis

Respond with ONLY a valid JSON object matching this exact schema:
{{
    "emotions": ["emotion1", "emotion2"],
    "dominantEmotion": "primary_emotion",
    "confidence": 0.85,
    "intensity": 0.7,
    "nuances": {{
        "eyeContact": "direct/averted/looking_away",
        "mouthExpression": "description",
        "eyebrowPosition": "raised/neutral/furrowed",
        "overallTension": "relaxed/moderate/tense"
    }}
}}"""


class SimpleSessionMemory:
    """Simple in-memory session storage for emotion context."""
    
    def __init__(self, max_entries: int = 10):
        self.max_entries = max_entries
        self.history: deque = deque(maxlen=max_entries)
    
    def add(self, emotion: str, confidence: float, intensity: float):
        """Add an emotion entry to history."""
        self.history.append({
            "emotion": emotion,
            "confidence": confidence,
            "intensity": intensity
        })
    
    def get_recent_emotions(self) -> List[str]:
        """Get list of recent emotions."""
        return [entry["emotion"] for entry in self.history]
    
    def clear(self):
        """Clear the history."""
        self.history.clear()


class EmotionAnalysisChain:
    """
    LangChain-based emotion analysis chain using Gemini Vision.
    """
    
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="models/gemini-3-flash-preview",
            google_api_key=settings.gemini_api_key,
            temperature=0.3,
            convert_system_message_to_human=True
        )
        self.output_parser = JsonOutputParser(pydantic_object=EmotionAnalysisOutput)
        
        # Session memories for call context
        self._session_memories: Dict[str, SimpleSessionMemory] = {}
    
    def _get_session_memory(self, session_id: str) -> SimpleSessionMemory:
        """Get or create session memory."""
        if session_id not in self._session_memories:
            self._session_memories[session_id] = SimpleSessionMemory(max_entries=10)
        return self._session_memories[session_id]
    
    def _prepare_image_content(self, image_base64: str) -> Dict[str, Any]:
        """Prepare image for Gemini Vision."""
        # Remove data URI prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        return {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_base64}"
            }
        }
    
    async def analyze(
        self,
        image_base64: str,
        context: Optional[str] = None,
        session_id: Optional[str] = None,
        previous_emotions: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Analyze facial expression from an image.
        
        Args:
            image_base64: Base64 encoded image
            context: Optional conversation context
            session_id: Optional session ID for memory
            previous_emotions: List of previously detected emotions
            
        Returns:
            Dictionary with emotion analysis results
        """
        try:
            # Build context string
            context_parts = []
            
            if context:
                context_parts.append(f"Conversation context: {context}")
            
            if previous_emotions:
                context_parts.append(f"Previous emotions detected in this call: {', '.join(previous_emotions[-5:])}")
                context_parts.append("Note any emotional transitions or shifts from previous states.")
            
            if session_id:
                memory = self._get_session_memory(session_id)
                recent = memory.get_recent_emotions()
                if recent:
                    context_parts.append(f"Recent emotion history: {', '.join(recent[-5:])}")
                    context_parts.append("This is an ongoing call. Consider emotional continuity.")
            
            context_str = "\n".join(context_parts) if context_parts else "No additional context provided."
            
            # Format the prompt
            prompt = EMOTION_ANALYSIS_PROMPT.format(context=context_str)
            
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
            
            # Validate and normalize
            result = self._validate_result(result)
            
            # Update session memory if provided
            if session_id:
                memory = self._get_session_memory(session_id)
                memory.add(
                    result['dominantEmotion'],
                    result['confidence'],
                    result['intensity']
                )
            
            return {
                "success": True,
                **result
            }
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            return self._default_response("Failed to parse emotion analysis")
        except Exception as e:
            print(f"Emotion analysis error: {e}")
            return self._default_response(str(e))
    
    def _validate_result(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and normalize analysis result."""
        # Ensure all required fields exist
        valid_result = {
            "emotions": result.get("emotions", ["neutral"]),
            "dominantEmotion": result.get("dominantEmotion", "neutral"),
            "confidence": min(max(result.get("confidence", 0.5), 0), 1),
            "intensity": min(max(result.get("intensity", 0.5), 0), 1),
            "nuances": result.get("nuances", {
                "eyeContact": "unknown",
                "mouthExpression": "unknown",
                "eyebrowPosition": "neutral",
                "overallTension": "unknown"
            })
        }
        
        # Ensure emotions is a list
        if not isinstance(valid_result["emotions"], list):
            valid_result["emotions"] = [valid_result["emotions"]]
        
        return valid_result
    
    def _default_response(self, error: str = "") -> Dict[str, Any]:
        """Return a default response on error."""
        return {
            "success": False,
            "emotions": ["unknown"],
            "dominantEmotion": "unknown",
            "confidence": 0,
            "intensity": 0.5,
            "nuances": {
                "eyeContact": "unknown",
                "mouthExpression": "unknown",
                "eyebrowPosition": "neutral",
                "overallTension": "unknown"
            },
            "error": error
        }
    
    def clear_session(self, session_id: str) -> None:
        """Clear session memory."""
        if session_id in self._session_memories:
            del self._session_memories[session_id]


# Singleton instance
_emotion_chain: Optional[EmotionAnalysisChain] = None


def get_emotion_chain() -> EmotionAnalysisChain:
    """Get the singleton emotion analysis chain."""
    global _emotion_chain
    if _emotion_chain is None:
        _emotion_chain = EmotionAnalysisChain()
    return _emotion_chain
