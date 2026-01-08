"""
OpenAI GPT-4o Service for pattern interpretation and text generation.
"""
from openai import AsyncOpenAI
from app.config import settings
from typing import Dict, List, Optional

# Initialize OpenAI client
client = AsyncOpenAI(api_key=settings.openai_api_key)


class OpenAIService:
    def __init__(self):
        self.model = "gpt-4o"
    
    async def interpret_pattern(
        self,
        pattern_features: Dict,
        sender_patterns: List[Dict],
        sender_name: str = "Your friend"
    ) -> Dict:
        """
        Generate rich interpretation of a pattern based on sender's pattern library.
        
        Args:
            pattern_features: Visual features of the received pattern
            sender_patterns: List of sender's saved patterns with emotions
            sender_name: Name of the sender
            
        Returns:
            Dictionary with interpretation, matched patterns, and confidence
        """
        try:
            # Build context from sender's pattern library
            library_context = self._build_library_context(sender_patterns)
            
            # Create interpretation prompt
            prompt = f"""
            You are an empathetic AI assistant helping interpret visual emotional patterns.
            
            {sender_name} has sent you a visual pattern with these characteristics:
            - Shape: {pattern_features.get('shapeType', 'unknown')}
            - Color mood: {pattern_features.get('colorMood', 'unknown')}
            - Line quality: {pattern_features.get('lineQuality', 'unknown')}
            - Density: {pattern_features.get('density', 0.5)}
            - Symmetry: {pattern_features.get('symmetry', 0.5)}
            
            Based on {sender_name}'s personal pattern language library:
            {library_context}
            
            Generate a warm, empathetic interpretation that:
            1. Describes what the pattern might express emotionally
            2. References similar patterns from their library if applicable
            3. Suggests what they might be feeling or wanting to communicate
            4. Uses gentle, understanding language
            
            Keep it conversational and supportive (2-3 sentences).
            """
            
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an empathetic AI that helps people understand emotional patterns and non-verbal communication."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            interpretation = response.choices[0].message.content
            
            # Find matched patterns
            matched = self._find_matched_patterns(pattern_features, sender_patterns)
            
            # Calculate confidence based on library size and matches
            confidence = self._calculate_confidence(sender_patterns, matched)
            
            return {
                "interpretation": interpretation,
                "matchedPatterns": [p['id'] for p in matched],
                "confidence": confidence
            }
            
        except Exception as e:
            print(f"Error interpreting pattern: {str(e)}")
            return {
                "interpretation": f"{sender_name} sent you a visual pattern expressing their emotions. The specific meaning is being processed.",
                "matchedPatterns": [],
                "confidence": 0.5
            }
    
    async def generate_emotion_text(
        self,
        emotion: str,
        intensity: float,
        context: Optional[str] = None
    ) -> List[str]:
        """
        Generate text suggestions based on emotion composition.
        
        Args:
            emotion: Primary emotion
            intensity: Emotion intensity (0-1)
            context: Optional context for generation
            
        Returns:
            List of generated text suggestions
        """
        try:
            intensity_word = "subtle" if intensity < 0.3 else "moderate" if intensity < 0.7 else "intense"
            
            prompt = f"""
            Generate 3 short, authentic message suggestions expressing {intensity_word} {emotion}.
            {f'Context: {context}' if context else ''}
            
            Make them:
            - Natural and conversational
            - Emotionally authentic
            - Varied in tone
            - 1-2 sentences each
            
            Return only the messages, one per line.
            """
            
            response = await client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You generate authentic, emotionally resonant messages."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.8,
                max_tokens=150
            )
            
            # Split response into individual suggestions
            suggestions = [
                line.strip().lstrip('123456789.-) ')
                for line in response.choices[0].message.content.split('\n')
                if line.strip()
            ]
            
            return suggestions[:3]
            
        except Exception as e:
            print(f"Error generating emotion text: {str(e)}")
            return [
                f"I'm feeling {emotion} right now.",
                f"There's a sense of {emotion} I wanted to share.",
                f"Just wanted you to know I'm experiencing {emotion}."
            ]
    
    def _build_library_context(self, patterns: List[Dict]) -> str:
        """Build context string from pattern library."""
        if not patterns:
            return "No previous patterns available."
        
        context_parts = []
        for pattern in patterns[:5]:  # Limit to 5 most relevant
            emotion = pattern.get('emotion', 'unknown')
            shape = pattern.get('features', {}).get('shapeType', 'unknown')
            context_parts.append(f"- {emotion}: {shape} patterns")
        
        return "\n".join(context_parts)
    
    def _find_matched_patterns(
        self,
        features: Dict,
        library: List[Dict]
    ) -> List[Dict]:
        """Find similar patterns from library."""
        matched = []
        
        for pattern in library:
            pattern_features = pattern.get('features', {})
            
            # Simple similarity check
            similarity_score = 0
            if pattern_features.get('shapeType') == features.get('shapeType'):
                similarity_score += 0.4
            if pattern_features.get('colorMood') == features.get('colorMood'):
                similarity_score += 0.3
            if pattern_features.get('lineQuality') == features.get('lineQuality'):
                similarity_score += 0.3
            
            if similarity_score >= 0.5:
                matched.append(pattern)
        
        return matched[:3]  # Return top 3 matches
    
    def _calculate_confidence(
        self,
        library: List[Dict],
        matched: List[Dict]
    ) -> float:
        """Calculate interpretation confidence."""
        if not library:
            return 0.3
        
        # Base confidence on library size and matches
        library_factor = min(len(library) / 10, 1.0) * 0.5
        match_factor = (len(matched) / max(len(library), 1)) * 0.5
        
        return min(library_factor + match_factor + 0.2, 0.95)


# Singleton instance
openai_service = OpenAIService()
