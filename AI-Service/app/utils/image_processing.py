"""
Image processing utilities for pattern analysis.
"""
import base64
import io
from PIL import Image
from typing import Tuple, Optional


def decode_base64_image(image_base64: str) -> Image.Image:
    """
    Decode base64 string to PIL Image.
    
    Args:
        image_base64: Base64 encoded image string (with or without data URL prefix)
        
    Returns:
        PIL Image object
    """
    # Remove data URL prefix if present
    if ',' in image_base64:
        image_base64 = image_base64.split(',')[1]
    
    # Decode base64
    image_bytes = base64.b64decode(image_base64)
    image = Image.open(io.BytesIO(image_bytes))
    
    return image


def validate_image(image_base64: str) -> Tuple[bool, Optional[str]]:
    """
    Validate base64 image.
    
    Args:
        image_base64: Base64 encoded image string
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        image = decode_base64_image(image_base64)
        
        # Check image size
        width, height = image.size
        if width < 50 or height < 50:
            return False, "Image too small (minimum 50x50 pixels)"
        
        if width > 4096 or height > 4096:
            return False, "Image too large (maximum 4096x4096 pixels)"
        
        # Check file size (approximate)
        if len(image_base64) > 10 * 1024 * 1024:  # 10MB
            return False, "Image file size too large (maximum 10MB)"
        
        return True, None
        
    except Exception as e:
        return False, f"Invalid image format: {str(e)}"


def resize_image(image: Image.Image, max_size: int = 1024) -> Image.Image:
    """
    Resize image while maintaining aspect ratio.
    
    Args:
        image: PIL Image object
        max_size: Maximum dimension size
        
    Returns:
        Resized PIL Image
    """
    width, height = image.size
    
    if width <= max_size and height <= max_size:
        return image
    
    # Calculate new dimensions
    if width > height:
        new_width = max_size
        new_height = int(height * (max_size / width))
    else:
        new_height = max_size
        new_width = int(width * (max_size / height))
    
    return image.resize((new_width, new_height), Image.Resampling.LANCZOS)


def image_to_base64(image: Image.Image, format: str = 'PNG') -> str:
    """
    Convert PIL Image to base64 string.
    
    Args:
        image: PIL Image object
        format: Image format (PNG, JPEG, etc.)
        
    Returns:
        Base64 encoded string
    """
    buffer = io.BytesIO()
    image.save(buffer, format=format)
    buffer.seek(0)
    
    image_bytes = buffer.read()
    base64_string = base64.b64encode(image_bytes).decode('utf-8')
    
    return f"data:image/{format.lower()};base64,{base64_string}"
