"""
Gemini AI Service for pattern analysis and feature extraction.
"""
import google.generativeai as genai
from app.config import settings
from typing import Dict, List, Optional
import base64
import io
from PIL import Image

# Configure Gemini
genai.configure(api_key=settings.gemini_api_key)


class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    async def analyze_pattern(self, image_base64: str) -> Dict:
        """
        Analyze a pattern image and extract visual features.
        
        Args:
            image_base64: Base64 encoded image string
            
        Returns:
            Dictionary containing pattern features
        """
        try:
            # Decode base64 image
            image_data = self._decode_base64_image(image_base64)
            
            # Create prompt for pattern analysis
            prompt = """
            Analyze this visual pattern/drawing and extract the following features:
            
            1. **Shape Type**: Classify the dominant shape as one of:
               - spiral (circular, swirling patterns)
               - angular (sharp edges, geometric shapes)
               - flowing (smooth, wave-like curves)
               - geometric (structured shapes like squares, triangles)
               - chaotic (random, scattered elements)
               - organic (natural, irregular forms)
            
            2. **Color Mood**: Classify the overall color palette as:
               - warm (reds, oranges, yellows)
               - cool (blues, greens, purples)
               - vibrant (bright, saturated colors)
               - muted (soft, desaturated colors)
               - monochrome (single color or grayscale)
            
            3. **Line Quality**: Describe the line characteristics as:
               - smooth (continuous, flowing lines)
               - jagged (rough, irregular edges)
               - continuous (unbroken lines)
               - broken (dashed or interrupted lines)
            
            4. **Density**: Rate the visual density from 0.0 to 1.0
               - 0.0 = very sparse, lots of empty space
               - 1.0 = very dense, filled completely
            
            5. **Symmetry**: Rate the symmetry from 0.0 to 1.0
               - 0.0 = completely asymmetric
               - 1.0 = perfectly symmetric
            
            Respond in JSON format:
            {
                "shapeType": "one of the options above",
                "colorMood": "one of the options above",
                "lineQuality": "one of the options above",
                "density": 0.0-1.0,
                "symmetry": 0.0-1.0,
                "description": "brief description of the pattern"
            }
            """
            
            # Generate content with image
            response = self.model.generate_content([prompt, image_data])
            
            # Parse response
            result = self._parse_analysis_response(response.text)
            
            return result
            
        except Exception as e:
            print(f"Error analyzing pattern: {str(e)}")
            # Return default values on error
            return {
                "shapeType": "organic",
                "colorMood": "warm",
                "lineQuality": "smooth",
                "density": 0.5,
                "symmetry": 0.5,
                "description": "Pattern analysis unavailable"
            }
    
    async def generate_embedding(self, image_base64: str, features: Dict) -> List[float]:
        """
        Generate embedding vector for pattern similarity search.
        
        Args:
            image_base64: Base64 encoded image
            features: Extracted pattern features
            
        Returns:
            List of floats representing the embedding
        """
        try:
            # Create a text representation of the pattern
            pattern_description = f"""
            Pattern with {features['shapeType']} shapes, {features['colorMood']} colors,
            {features['lineQuality']} lines, density {features['density']}, 
            symmetry {features['symmetry']}. {features.get('description', '')}
            """
            
            # Use Gemini's embedding model
            embedding_model = "models/embedding-001"
            result = genai.embed_content(
                model=embedding_model,
                content=pattern_description,
                task_type="retrieval_document"
            )
            
            return result['embedding']
            
        except Exception as e:
            print(f"Error generating embedding: {str(e)}")
            # Return zero vector on error
            return [0.0] * 768
    
    def _decode_base64_image(self, image_base64: str) -> Image.Image:
        """Decode base64 string to PIL Image."""
        # Remove data URL prefix if present
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_bytes))
        
        return image
    
    def _parse_analysis_response(self, response_text: str) -> Dict:
        """Parse Gemini response to extract features."""
        import json
        import re
        
        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                return result
            else:
                # Fallback parsing
                return self._fallback_parse(response_text)
        except Exception as e:
            print(f"Error parsing response: {str(e)}")
            return {
                "shapeType": "organic",
                "colorMood": "warm",
                "lineQuality": "smooth",
                "density": 0.5,
                "symmetry": 0.5,
                "description": response_text[:200]
            }
    
    def _fallback_parse(self, text: str) -> Dict:
        """Fallback parsing if JSON extraction fails."""
        # Simple keyword-based extraction
        shape_types = ["spiral", "angular", "flowing", "geometric", "chaotic", "organic"]
        color_moods = ["warm", "cool", "vibrant", "muted", "monochrome"]
        line_qualities = ["smooth", "jagged", "continuous", "broken"]
        
        result = {
            "shapeType": "organic",
            "colorMood": "warm",
            "lineQuality": "smooth",
            "density": 0.5,
            "symmetry": 0.5,
            "description": text[:200]
        }
        
        text_lower = text.lower()
        
        for shape in shape_types:
            if shape in text_lower:
                result["shapeType"] = shape
                break
        
        for mood in color_moods:
            if mood in text_lower:
                result["colorMood"] = mood
                break
        
        for quality in line_qualities:
            if quality in text_lower:
                result["lineQuality"] = quality
                break
        
        return result


# Singleton instance
gemini_service = GeminiService()
