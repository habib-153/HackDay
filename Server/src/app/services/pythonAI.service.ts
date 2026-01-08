import config from '../config';

const PYTHON_AI_SERVICE_URL = config.python_ai_service_url || 'http://localhost:8000';

// ============ Emotion Analysis Types ============
interface EmotionAnalysisResult {
    success: boolean;
    emotions: string[];
    dominantEmotion: string;
    confidence: number;
    intensity: number;
    nuances?: {
        eyeContact?: string;
        mouthExpression?: string;
        eyebrowPosition?: string;
        overallTension?: string;
    };
    generatedText?: string;
    error?: string;
}

// ============ Pattern Analysis Types ============
interface PatternFeatures {
    shapeType: string;
    colorMood: string;
    lineQuality: string;
    density: number;
    symmetry: number;
    dominantColors?: string[];
    movement?: string;
    complexity?: string;
}

interface PatternAnalysisResult {
    success: boolean;
    features: PatternFeatures;
    suggestedEmotion: string;
    suggestedIntensity: number;
    interpretation: string;
    suggestedTags: string[];
    error?: string;
}

interface PatternInterpretResult {
    success: boolean;
    interpretation: string;
    emotionalContext: string;
    suggestedResponses: string[];
    patternInfo?: {
        name: string;
        emotion: string;
        intensity: number;
        tags: string[];
    };
    error?: string;
}

interface PatternMatchResult {
    success: boolean;
    matchedPatterns: Array<{
        id?: string;
        name: string;
        emotion: string;
        matchScore: number;
    }>;
    bestMatch?: {
        id?: string;
        name: string;
        emotion: string;
        matchScore: number;
    };
    confidence: number;
    interpretation: string;
    error?: string;
}

// ============ Chat Types ============
interface EmotionTextResult {
    text: string;
    alternatives: string[];
}

// ============ Avatar Types ============
interface AvatarSuggestion {
    text: string;
    emotion: string;
    confidence: number;
}

export class PythonAIService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = PYTHON_AI_SERVICE_URL;
    }

    private async request<T>(endpoint: string, body: unknown): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Python AI Service error: ${response.status} - ${errorText}`);
            }

            return response.json() as Promise<T>;
        } catch (error) {
            console.error(`Python AI Service request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // ============ Emotion Analysis ============
    async analyzeEmotion(
        imageBase64: string,
        userId: string,
        callId?: string,
        context?: string,
    ): Promise<EmotionAnalysisResult> {
        return this.request('/api/v1/emotion/analyze', {
            image: imageBase64,
            userId,
            callId,
            context,
        });
    }

    // ============ Pattern Analysis ============
    async analyzePattern(imageBase64: string): Promise<PatternAnalysisResult> {
        return this.request('/api/v1/pattern/analyze', {
            image: imageBase64,
        });
    }

    async interpretPattern(
        imageBase64: string,
        senderName: string,
        patternName: string,
        emotion: string,
        intensity: number,
        tags: string[],
        features?: PatternFeatures,
        libraryPatterns?: Array<{
            name: string;
            emotion: string;
            intensity: number;
            features?: PatternFeatures;
        }>,
    ): Promise<PatternInterpretResult> {
        return this.request('/api/v1/pattern/interpret', {
            image: imageBase64,
            senderName,
            patternName,
            emotion,
            intensity,
            tags,
            features,
            libraryPatterns,
        });
    }

    async matchPattern(
        imageBase64: string,
        senderId: string,
        recipientId: string,
        libraryPatterns: Array<{
            id?: string;
            name: string;
            emotion: string;
            intensity: number;
            tags: string[];
            features?: PatternFeatures;
        }>,
    ): Promise<PatternMatchResult> {
        return this.request('/api/v1/pattern/match', {
            image: imageBase64,
            senderId,
            recipientId,
            libraryPatterns,
        });
    }

    // ============ Chat / Text Generation ============
    async generateEmotionText(
        emotionComposition: {
            primary: { emotion: string; intensity: number };
            secondary?: { emotion: string; intensity: number };
            bodySensation?: string;
            memoryContext?: string;
        },
        userId: string,
        recipientId: string,
    ): Promise<EmotionTextResult> {
        return this.request('/api/v1/chat/generate', {
            emotionComposition,
            userId,
            recipientId,
        });
    }

    // ============ Avatar ============
    async getAvatarSuggestion(
        userId: string,
        context: string,
        recipientId: string,
    ): Promise<{ suggestions: AvatarSuggestion[] }> {
        return this.request('/api/v1/avatar/suggest', {
            userId,
            context,
            recipientId,
        });
    }

    async buildAvatarProfile(userId: string): Promise<unknown> {
        return this.request('/api/v1/avatar/build-profile', {
            userId,
        });
    }

    // ============ Health Check ============
    async healthCheck(): Promise<{ status: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            return response.json() as Promise<{ status: string }>;
        } catch (error) {
            return { status: 'unhealthy' };
        }
    }
}

export const pythonAIService = new PythonAIService();

// Export types for use in other modules
export type {
    EmotionAnalysisResult,
    PatternFeatures,
    PatternAnalysisResult,
    PatternInterpretResult,
    PatternMatchResult,
    EmotionTextResult,
    AvatarSuggestion,
};
