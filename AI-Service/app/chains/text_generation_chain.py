"""
LangChain Text Generation Chain for HeartSpeak.
Generates empathetic, natural language descriptions of emotions.
"""
from typing import Optional, Dict, Any, List
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.config import settings


EMOTION_TEXT_SYSTEM_PROMPT = """You are an empathetic emotion translator for HeartSpeak, helping speech-impaired individuals communicate their feelings to loved ones.

Your role is to translate detected facial emotions into warm, natural language that helps the other person understand how their communication partner is feeling.

VOICE GUIDELINES:
- Be warm, supportive, and never clinical
- Use phrases like "They seem to be...", "Your friend appears...", "They're showing signs of..."
- Keep responses to 1-2 concise sentences
- Match the intensity - subtle emotions get gentle language, strong emotions get more emphatic language
- If confidence is low (<0.5), use tentative language like "might be", "seems like", "could be"
- Note emotional transitions if the person's mood has shifted

EMOTIONAL NUANCE:
- Consider the nuances provided (eye contact, tension, etc.)
- Blend multiple emotions naturally when present
- Honor cultural sensitivity in expression
- Focus on helping the receiver understand, not judge"""


EMOTION_TEXT_TEMPLATE = """Based on the emotion analysis, create a brief, empathetic message for the communication partner.

DETECTED EMOTIONS: {emotions}
DOMINANT EMOTION: {dominant_emotion}
CONFIDENCE: {confidence}
INTENSITY: {intensity}

NUANCES:
- Eye Contact: {eye_contact}
- Mouth Expression: {mouth_expression}
- Eyebrow Position: {eyebrow_position}
- Overall Tension: {overall_tension}

{context_info}

Generate ONLY the message text, no quotes or formatting. Make it feel human and caring."""


class EmotionTextGenerationChain:
    """
    LangChain-based text generation for emotion descriptions.
    """
    
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="models/gemini-3-flash-preview",
            google_api_key=settings.gemini_api_key,
            temperature=0.7,  # Higher for more natural variation
            convert_system_message_to_human=True
        )
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", EMOTION_TEXT_SYSTEM_PROMPT),
            ("human", EMOTION_TEXT_TEMPLATE)
        ])
        
        self.chain = self.prompt | self.llm | StrOutputParser()
        
        # Track recent generations per session
        self._recent_texts: Dict[str, List[str]] = {}
    
    async def generate(
        self,
        emotion_data: Dict[str, Any],
        context: Optional[str] = None,
        previous_emotions: Optional[List[str]] = None,
        session_id: Optional[str] = None
    ) -> str:
        """
        Generate natural language description of emotions.
        
        Args:
            emotion_data: Dictionary with emotion analysis results
            context: Optional conversation context
            previous_emotions: List of previously detected emotions
            session_id: Optional session ID for tracking
            
        Returns:
            Natural language string describing the emotional state
        """
        try:
            # Extract data with defaults
            emotions = emotion_data.get("emotions", ["neutral"])
            dominant = emotion_data.get("dominantEmotion", "neutral")
            confidence = emotion_data.get("confidence", 0.5)
            intensity = emotion_data.get("intensity", 0.5)
            nuances = emotion_data.get("nuances", {})
            
            # Build context info
            context_parts = []
            
            if context:
                context_parts.append(f"Conversation context: {context}")
            
            if previous_emotions and len(previous_emotions) > 0:
                context_parts.append(f"Previous emotions: {', '.join(previous_emotions[-3:])}")
                
                # Note transitions
                if previous_emotions[-1] != dominant:
                    context_parts.append(f"Note: Emotional shift from {previous_emotions[-1]} to {dominant}")
            
            # Avoid repetition
            if session_id and session_id in self._recent_texts:
                recent = self._recent_texts[session_id]
                if recent:
                    context_parts.append(f"Avoid phrases similar to recent messages. Vary your language.")
            
            context_info = "\n".join(context_parts) if context_parts else "No additional context."
            
            # Prepare input
            input_data = {
                "emotions": ", ".join(emotions),
                "dominant_emotion": dominant,
                "confidence": f"{confidence:.0%}",
                "intensity": self._intensity_label(intensity),
                "eye_contact": nuances.get("eyeContact", "unknown"),
                "mouth_expression": nuances.get("mouthExpression", "unknown"),
                "eyebrow_position": nuances.get("eyebrowPosition", "neutral"),
                "overall_tension": nuances.get("overallTension", "unknown"),
                "context_info": context_info
            }
            
            # Generate text
            result = await self.chain.ainvoke(input_data)
            
            # Clean up
            result = result.strip().strip('"').strip("'")
            
            # Track recent generations
            if session_id:
                if session_id not in self._recent_texts:
                    self._recent_texts[session_id] = []
                self._recent_texts[session_id].append(result)
                # Keep only last 5
                self._recent_texts[session_id] = self._recent_texts[session_id][-5:]
            
            return result
            
        except Exception as e:
            print(f"Text generation error: {e}")
            return self._fallback_text(emotion_data)
    
    def _intensity_label(self, intensity: float) -> str:
        """Convert intensity float to descriptive label."""
        if intensity < 0.3:
            return "subtle/mild"
        elif intensity < 0.6:
            return "moderate"
        elif intensity < 0.8:
            return "strong"
        else:
            return "very intense"
    
    def _fallback_text(self, emotion_data: Dict[str, Any]) -> str:
        """Generate a simple fallback text."""
        dominant = emotion_data.get("dominantEmotion", "neutral")
        
        fallback_templates = {
            "happy": "They seem to be feeling happy and positive right now.",
            "sad": "They appear to be feeling a bit down at the moment.",
            "angry": "They seem to be experiencing some frustration.",
            "fearful": "They appear to be feeling a bit anxious or worried.",
            "surprised": "They look surprised by something.",
            "neutral": "They appear calm and at ease.",
            "thoughtful": "They seem deep in thought.",
            "excited": "They're showing signs of excitement.",
            "confused": "They seem a bit puzzled or uncertain.",
            "hopeful": "They appear hopeful and optimistic.",
            "loving": "They're showing warmth and affection.",
            "peaceful": "They seem peaceful and content.",
            "anxious": "They appear somewhat anxious.",
            "frustrated": "They seem to be feeling frustrated.",
            "curious": "They look curious and engaged.",
            "grateful": "They appear grateful and appreciative.",
            "concerned": "They seem concerned about something."
        }
        
        return fallback_templates.get(dominant, f"Your friend appears {dominant} at the moment.")
    
    def clear_session(self, session_id: str) -> None:
        """Clear session tracking."""
        if session_id in self._recent_texts:
            del self._recent_texts[session_id]


# Singleton instance
_text_chain: Optional[EmotionTextGenerationChain] = None


def get_text_generation_chain() -> EmotionTextGenerationChain:
    """Get the singleton text generation chain."""
    global _text_chain
    if _text_chain is None:
        _text_chain = EmotionTextGenerationChain()
    return _text_chain

