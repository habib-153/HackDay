"""
Emotion Memory Service for HeartSpeak
Manages session-based emotion context.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from collections import defaultdict


class EmotionMemory:
    """
    Memory system for tracking emotions during calls.
    Uses session-based in-memory storage.
    """
    
    def __init__(self, window_size: int = 10):
        self.window_size = window_size
        # In-memory storage: {call_id: {user_id: [emotion_data]}}
        self._call_emotions: Dict[str, Dict[str, List[Dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))
        # Simple context storage per call
        self._call_context: Dict[str, List[Dict[str, str]]] = defaultdict(list)
    
    def add_emotion(
        self,
        call_id: str,
        user_id: str,
        emotion_data: Dict[str, Any]
    ) -> None:
        """
        Add an emotion detection to the memory.
        
        Args:
            call_id: The active call session ID
            user_id: The user whose emotion was detected
            emotion_data: Dictionary containing emotion detection results
        """
        # Add timestamp
        entry = {
            **emotion_data,
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id
        }
        
        # Store in session
        self._call_emotions[call_id][user_id].append(entry)
        
        # Keep only last N entries per user
        if len(self._call_emotions[call_id][user_id]) > self.window_size * 2:
            self._call_emotions[call_id][user_id] = self._call_emotions[call_id][user_id][-self.window_size * 2:]
        
        # Store context
        self._call_context[call_id].append({
            "user_id": user_id,
            "emotion": emotion_data.get("dominant", "unknown"),
            "text": emotion_data.get("text", "")
        })
        # Keep context windowed
        if len(self._call_context[call_id]) > self.window_size:
            self._call_context[call_id] = self._call_context[call_id][-self.window_size:]
    
    def get_recent_emotions(
        self,
        call_id: str,
        user_id: str,
        limit: int = 5
    ) -> List[str]:
        """
        Get recent dominant emotions for a user in a call.
        
        Returns:
            List of recent dominant emotions
        """
        emotions = self._call_emotions.get(call_id, {}).get(user_id, [])
        return [e.get("dominant", "neutral") for e in emotions[-limit:]]
    
    def get_call_emotions(
        self,
        call_id: str,
        user_id: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get emotion history for a call.
        
        Args:
            call_id: The call session ID
            user_id: Optional filter by user
            limit: Maximum number of entries to return
            
        Returns:
            List of emotion entries
        """
        if user_id:
            emotions = self._call_emotions.get(call_id, {}).get(user_id, [])
        else:
            # Get all emotions for the call
            emotions = []
            for uid, user_emotions in self._call_emotions.get(call_id, {}).items():
                emotions.extend(user_emotions)
            # Sort by timestamp
            emotions.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        return emotions[-limit:]
    
    def get_emotion_summary(
        self,
        call_id: str,
        user_id: str
    ) -> Optional[str]:
        """
        Generate a summary of emotions detected during the call.
        
        Returns:
            Summary string or None if not enough data
        """
        emotions = self.get_call_emotions(call_id, user_id, limit=20)
        
        if len(emotions) < 3:
            return None
        
        # Count dominant emotions
        emotion_counts: Dict[str, int] = defaultdict(int)
        for e in emotions:
            emotion_counts[e.get("dominant", "unknown")] += 1
        
        # Find top emotions
        sorted_emotions = sorted(emotion_counts.items(), key=lambda x: x[1], reverse=True)
        top_emotions = sorted_emotions[:3]
        
        # Generate summary
        total = sum(emotion_counts.values())
        summary_parts = [
            f"{emotion} ({count/total*100:.0f}%)"
            for emotion, count in top_emotions
        ]
        
        return f"Main emotions: {', '.join(summary_parts)}"
    
    def get_context_for_generation(
        self,
        call_id: str,
        user_id: str
    ) -> str:
        """
        Get context string for text generation.
        
        Returns:
            Context string with recent emotion history
        """
        emotions = self.get_recent_emotions(call_id, user_id, limit=5)
        
        if not emotions:
            return "No previous emotions detected in this call."
        
        return f"Recent emotions in this call: {', '.join(emotions)}"
    
    def clear_call(self, call_id: str) -> None:
        """Clear all memory for a call session."""
        if call_id in self._call_emotions:
            del self._call_emotions[call_id]
        if call_id in self._call_context:
            del self._call_context[call_id]
    
    def get_emotional_transitions(
        self,
        call_id: str,
        user_id: str
    ) -> List[Dict[str, str]]:
        """
        Identify emotional transitions during the call.
        
        Returns:
            List of transition records
        """
        emotions = self.get_call_emotions(call_id, user_id, limit=20)
        
        transitions = []
        for i in range(1, len(emotions)):
            prev_emotion = emotions[i-1].get("dominant")
            curr_emotion = emotions[i].get("dominant")
            
            if prev_emotion != curr_emotion:
                transitions.append({
                    "from": prev_emotion,
                    "to": curr_emotion,
                    "timestamp": emotions[i].get("timestamp")
                })
        
        return transitions


# Singleton instance
_emotion_memory: Optional[EmotionMemory] = None

def get_emotion_memory() -> EmotionMemory:
    global _emotion_memory
    if _emotion_memory is None:
        _emotion_memory = EmotionMemory()
    return _emotion_memory
