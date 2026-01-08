"""
Pattern service for managing pattern library and matching.
"""
from typing import List, Dict, Optional
import httpx
from app.config import settings


class PatternService:
    def __init__(self):
        self.node_server_url = settings.node_server_url
    
    async def get_user_patterns(
        self,
        user_id: str,
        limit: int = 20
    ) -> List[Dict]:
        """
        Fetch user's pattern library from Node.js backend.
        
        Args:
            user_id: User ID
            limit: Maximum number of patterns to fetch
            
        Returns:
            List of user's patterns
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.node_server_url}/api/v1/patterns",
                    params={"userId": user_id, "limit": limit},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get('data', [])
                else:
                    print(f"Error fetching patterns: {response.status_code}")
                    return []
                    
        except Exception as e:
            print(f"Error fetching user patterns: {str(e)}")
            return []
    
    async def find_similar_patterns(
        self,
        features: Dict,
        user_patterns: List[Dict],
        threshold: float = 0.5
    ) -> List[Dict]:
        """
        Find similar patterns based on visual features.
        
        Args:
            features: Pattern features to match
            user_patterns: User's pattern library
            threshold: Similarity threshold (0-1)
            
        Returns:
            List of similar patterns
        """
        similar = []
        
        for pattern in user_patterns:
            pattern_features = pattern.get('features', {})
            similarity = self._calculate_similarity(features, pattern_features)
            
            if similarity >= threshold:
                similar.append({
                    **pattern,
                    'similarity': similarity
                })
        
        # Sort by similarity
        similar.sort(key=lambda x: x['similarity'], reverse=True)
        
        return similar[:5]  # Return top 5
    
    def _calculate_similarity(
        self,
        features1: Dict,
        features2: Dict
    ) -> float:
        """
        Calculate similarity score between two patterns.
        
        Uses weighted feature comparison.
        """
        if not features1 or not features2:
            return 0.0
        
        score = 0.0
        weights = {
            'shapeType': 0.3,
            'colorMood': 0.25,
            'lineQuality': 0.2,
            'density': 0.125,
            'symmetry': 0.125
        }
        
        # Categorical features
        for feature in ['shapeType', 'colorMood', 'lineQuality']:
            if features1.get(feature) == features2.get(feature):
                score += weights[feature]
        
        # Numerical features
        for feature in ['density', 'symmetry']:
            val1 = features1.get(feature, 0.5)
            val2 = features2.get(feature, 0.5)
            diff = abs(val1 - val2)
            # Convert difference to similarity (closer = higher score)
            similarity = 1.0 - diff
            score += weights[feature] * similarity
        
        return min(score, 1.0)
    
    async def get_pattern_by_emotion(
        self,
        user_id: str,
        emotion: str
    ) -> List[Dict]:
        """
        Get patterns associated with a specific emotion.
        
        Args:
            user_id: User ID
            emotion: Emotion to filter by
            
        Returns:
            List of patterns with that emotion
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.node_server_url}/api/v1/patterns/emotion/{emotion}",
                    params={"userId": user_id},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get('data', [])
                else:
                    return []
                    
        except Exception as e:
            print(f"Error fetching patterns by emotion: {str(e)}")
            return []


# Singleton instance
pattern_service = PatternService()
