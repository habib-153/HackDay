"""
Emotion Analysis Service for HeartSpeak
Combines MediaPipe preprocessing with Gemini analysis.
"""
import cv2
import numpy as np
import base64
import mediapipe as mp
from typing import Optional, Tuple
from app.services.gemini_service import get_gemini_service


class EmotionService:
    """Service for emotion detection and analysis using MediaPipe + Gemini."""
    
    def __init__(self):
        # Initialize MediaPipe Face Mesh
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_face_detection = mp.solutions.face_detection
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Initialize detectors
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
        
        self.gemini = get_gemini_service()
    
    def decode_image(self, image_base64: str) -> np.ndarray:
        """Decode base64 image to numpy array."""
        # Remove data URI prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_base64)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        
        # Decode image
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        return image
    
    def preprocess_frame(self, image: np.ndarray) -> Tuple[bool, dict]:
        """
        Preprocess frame using MediaPipe to extract face information.
        
        Returns:
            Tuple of (face_detected: bool, face_info: dict)
        """
        # Convert to RGB for MediaPipe
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Run face detection
        detection_results = self.face_detection.process(rgb_image)
        
        if not detection_results.detections:
            return False, {"error": "No face detected"}
        
        # Run face mesh for detailed landmarks
        mesh_results = self.face_mesh.process(rgb_image)
        
        face_info = {
            "detected": True,
            "confidence": detection_results.detections[0].score[0] if detection_results.detections else 0,
        }
        
        if mesh_results.multi_face_landmarks:
            landmarks = mesh_results.multi_face_landmarks[0]
            
            # Extract key landmark positions for emotion inference
            face_info["landmarks"] = {
                "left_eye": self._get_landmark_coords(landmarks, [33, 133, 160, 159, 158, 144, 145, 153]),
                "right_eye": self._get_landmark_coords(landmarks, [362, 263, 387, 386, 385, 373, 374, 380]),
                "mouth": self._get_landmark_coords(landmarks, [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146]),
                "left_eyebrow": self._get_landmark_coords(landmarks, [70, 63, 105, 66, 107]),
                "right_eyebrow": self._get_landmark_coords(landmarks, [336, 296, 334, 293, 300]),
            }
            
            # Calculate some basic metrics
            face_info["metrics"] = self._calculate_face_metrics(landmarks, image.shape)
        
        return True, face_info
    
    def _get_landmark_coords(self, landmarks, indices: list) -> list:
        """Extract coordinates for specific landmark indices."""
        coords = []
        for idx in indices:
            lm = landmarks.landmark[idx]
            coords.append({"x": lm.x, "y": lm.y, "z": lm.z})
        return coords
    
    def _calculate_face_metrics(self, landmarks, image_shape: tuple) -> dict:
        """Calculate facial metrics that may indicate emotions."""
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
        
        # Calculate eye openness
        left_eye_openness = abs(left_eye_top.y - left_eye_bottom.y)
        right_eye_openness = abs(right_eye_top.y - right_eye_bottom.y)
        
        # Calculate mouth openness and width
        mouth_openness = abs(mouth_top.y - mouth_bottom.y)
        mouth_width = abs(mouth_left.x - mouth_right.x)
        
        # Calculate eyebrow height (relative to eyes)
        left_eyebrow_height = abs(left_eyebrow.y - left_eye_top.y)
        right_eyebrow_height = abs(right_eyebrow.y - right_eye_top.y)
        
        return {
            "eyeOpenness": (left_eye_openness + right_eye_openness) / 2,
            "mouthOpenness": mouth_openness,
            "mouthWidth": mouth_width,
            "eyebrowHeight": (left_eyebrow_height + right_eyebrow_height) / 2,
            "mouthAspectRatio": mouth_openness / mouth_width if mouth_width > 0 else 0
        }
    
    async def analyze_frame(
        self,
        image_base64: str,
        user_id: str,
        context: Optional[str] = None,
        previous_emotions: Optional[list] = None
    ) -> dict:
        """
        Full emotion analysis pipeline.
        
        Args:
            image_base64: Base64 encoded image
            user_id: ID of the user being analyzed
            context: Optional context for analysis
            previous_emotions: Previously detected emotions for continuity
            
        Returns:
            Complete emotion analysis with generated text
        """
        try:
            # Decode image
            image = self.decode_image(image_base64)
            
            # Preprocess with MediaPipe
            face_detected, face_info = self.preprocess_frame(image)
            
            if not face_detected:
                return {
                    "success": False,
                    "emotions": ["unknown"],
                    "dominantEmotion": "unknown",
                    "confidence": 0,
                    "generatedText": "Unable to detect face clearly. Please adjust your camera.",
                    "faceDetected": False
                }
            
            # Analyze with Gemini
            emotion_data = await self.gemini.analyze_facial_expression(
                image_base64,
                context
            )
            
            # Generate natural language text
            generated_text = await self.gemini.generate_emotion_text(
                emotion_data,
                context,
                previous_emotions
            )
            
            return {
                "success": True,
                "emotions": emotion_data.get("emotions", ["neutral"]),
                "dominantEmotion": emotion_data.get("dominantEmotion", "neutral"),
                "confidence": emotion_data.get("confidence", 0.5),
                "intensity": emotion_data.get("intensity", 0.5),
                "nuances": emotion_data.get("nuances", {}),
                "generatedText": generated_text,
                "faceDetected": True,
                "faceMetrics": face_info.get("metrics", {})
            }
            
        except Exception as e:
            print(f"Emotion analysis error: {e}")
            return {
                "success": False,
                "emotions": ["unknown"],
                "dominantEmotion": "unknown", 
                "confidence": 0,
                "generatedText": "Unable to analyze emotions at this moment.",
                "error": str(e)
            }


# Singleton instance
_emotion_service: Optional[EmotionService] = None

def get_emotion_service() -> EmotionService:
    global _emotion_service
    if _emotion_service is None:
        _emotion_service = EmotionService()
    return _emotion_service
