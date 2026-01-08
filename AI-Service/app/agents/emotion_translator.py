"""
Emotion Translator Agent for HeartSpeak.
A LangChain agent that orchestrates the full emotion analysis pipeline.
"""
import cv2
import numpy as np
import base64
import mediapipe as mp
from typing import Optional, Dict, Any, List, Tuple
from app.chains.emotion_chain import get_emotion_chain
from app.chains.text_generation_chain import get_text_generation_chain
from app.memory import get_emotion_memory


class EmotionTranslatorAgent:
    """
    Agent that orchestrates the complete emotion translation pipeline:
    1. MediaPipe preprocessing for face detection
    2. LangChain emotion analysis chain
    3. LangChain text generation chain
    4. Memory management for context
    """
    
    def __init__(self):
        # Initialize MediaPipe
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_face_detection = mp.solutions.face_detection
        
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=1,
            min_detection_confidence=0.5
        )
        
        # Get chains
        self.emotion_chain = get_emotion_chain()
        self.text_chain = get_text_generation_chain()
        
        # Memory
        self.memory = get_emotion_memory()
    
    def decode_image(self, image_base64: str) -> np.ndarray:
        """Decode base64 image to numpy array."""
        # Remove data URI prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_base64)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        return image
    
    def preprocess_frame(self, image: np.ndarray) -> Tuple[bool, Dict[str, Any]]:
        """
        Preprocess frame using MediaPipe for face detection and landmark extraction.
        
        Returns:
            Tuple of (face_detected: bool, face_info: dict)
        """
        # Convert to RGB for MediaPipe
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Run face detection
        detection_results = self.face_detection.process(rgb_image)
        
        if not detection_results.detections:
            return False, {"error": "No face detected"}
        
        # Run face mesh for landmarks
        mesh_results = self.face_mesh.process(rgb_image)
        
        face_info = {
            "detected": True,
            "confidence": detection_results.detections[0].score[0] if detection_results.detections else 0,
        }
        
        if mesh_results.multi_face_landmarks:
            landmarks = mesh_results.multi_face_landmarks[0]
            face_info["metrics"] = self._calculate_face_metrics(landmarks, image.shape)
        
        return True, face_info
    
    def _calculate_face_metrics(self, landmarks, image_shape: tuple) -> Dict[str, float]:
        """Calculate facial metrics that indicate emotions."""
        h, w = image_shape[:2]
        
        # Get key points
        left_eye_top = landmarks.landmark[159]
        left_eye_bottom = landmarks.landmark[145]
        right_eye_top = landmarks.landmark[386]
        right_eye_bottom = landmarks.landmark[374]
        
        mouth_top = landmarks.landmark[13]
        mouth_bottom = landmarks.landmark[14]
        mouth_left = landmarks.landmark[61]
        mouth_right = landmarks.landmark[291]
        
        left_eyebrow = landmarks.landmark[105]
        right_eyebrow = landmarks.landmark[334]
        
        # Calculate metrics
        left_eye_openness = abs(left_eye_top.y - left_eye_bottom.y)
        right_eye_openness = abs(right_eye_top.y - right_eye_bottom.y)
        mouth_openness = abs(mouth_top.y - mouth_bottom.y)
        mouth_width = abs(mouth_left.x - mouth_right.x)
        left_eyebrow_height = abs(left_eyebrow.y - left_eye_top.y)
        right_eyebrow_height = abs(right_eyebrow.y - right_eye_top.y)
        
        return {
            "eyeOpenness": (left_eye_openness + right_eye_openness) / 2,
            "mouthOpenness": mouth_openness,
            "mouthWidth": mouth_width,
            "eyebrowHeight": (left_eyebrow_height + right_eyebrow_height) / 2,
            "mouthAspectRatio": mouth_openness / mouth_width if mouth_width > 0 else 0
        }
    
    async def translate(
        self,
        image_base64: str,
        user_id: str,
        call_id: Optional[str] = None,
        context: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Full emotion translation pipeline.
        
        Args:
            image_base64: Base64 encoded image
            user_id: ID of the user being analyzed
            call_id: Optional call session ID
            context: Optional conversation context
            
        Returns:
            Complete emotion translation with generated text
        """
        try:
            # Step 1: Decode and preprocess image
            image = self.decode_image(image_base64)
            face_detected, face_info = self.preprocess_frame(image)
            
            if not face_detected:
                return {
                    "success": False,
                    "emotions": ["unknown"],
                    "dominantEmotion": "unknown",
                    "confidence": 0,
                    "intensity": 0.5,
                    "generatedText": "Unable to detect face clearly. Please adjust your camera.",
                    "faceDetected": False
                }
            
            # Step 2: Get previous emotions for context
            previous_emotions = None
            if call_id:
                previous_emotions = self.memory.get_recent_emotions(
                    call_id=call_id,
                    user_id=user_id,
                    limit=5
                )
            
            # Step 3: Analyze emotions with LangChain chain
            session_id = f"{call_id}:{user_id}" if call_id else None
            emotion_result = await self.emotion_chain.analyze(
                image_base64=image_base64,
                context=context,
                session_id=session_id,
                previous_emotions=previous_emotions
            )
            
            if not emotion_result.get("success"):
                return {
                    "success": False,
                    "emotions": ["unknown"],
                    "dominantEmotion": "unknown",
                    "confidence": 0,
                    "intensity": 0.5,
                    "generatedText": "Unable to analyze emotions at this moment.",
                    "faceDetected": True,
                    "faceMetrics": face_info.get("metrics", {})
                }
            
            # Step 4: Generate natural language text
            generated_text = await self.text_chain.generate(
                emotion_data=emotion_result,
                context=context,
                previous_emotions=previous_emotions,
                session_id=session_id
            )
            
            # Step 5: Store in memory
            if call_id:
                self.memory.add_emotion(
                    call_id=call_id,
                    user_id=user_id,
                    emotion_data={
                        "emotions": emotion_result["emotions"],
                        "dominant": emotion_result["dominantEmotion"],
                        "confidence": emotion_result["confidence"],
                        "text": generated_text
                    }
                )
            
            return {
                "success": True,
                "emotions": emotion_result["emotions"],
                "dominantEmotion": emotion_result["dominantEmotion"],
                "confidence": emotion_result["confidence"],
                "intensity": emotion_result["intensity"],
                "nuances": emotion_result.get("nuances", {}),
                "generatedText": generated_text,
                "faceDetected": True,
                "faceMetrics": face_info.get("metrics", {})
            }
            
        except Exception as e:
            print(f"Emotion translation error: {e}")
            return {
                "success": False,
                "emotions": ["unknown"],
                "dominantEmotion": "unknown",
                "confidence": 0,
                "intensity": 0.5,
                "generatedText": "Unable to process emotion at this moment.",
                "error": str(e)
            }
    
    def get_emotion_summary(
        self,
        call_id: str,
        user_id: str
    ) -> Optional[str]:
        """Get emotion summary for a call."""
        return self.memory.get_emotion_summary(call_id, user_id)
    
    def get_emotion_transitions(
        self,
        call_id: str,
        user_id: str
    ) -> List[Dict[str, str]]:
        """Get emotional transitions during a call."""
        return self.memory.get_emotional_transitions(call_id, user_id)
    
    def clear_session(self, call_id: str, user_id: str) -> None:
        """Clear all memory for a session."""
        session_id = f"{call_id}:{user_id}"
        self.emotion_chain.clear_session(session_id)
        self.text_chain.clear_session(session_id)
        self.memory.clear_call(call_id)


# Singleton instance
_emotion_translator: Optional[EmotionTranslatorAgent] = None


def get_emotion_translator() -> EmotionTranslatorAgent:
    """Get the singleton emotion translator agent."""
    global _emotion_translator
    if _emotion_translator is None:
        _emotion_translator = EmotionTranslatorAgent()
    return _emotion_translator

