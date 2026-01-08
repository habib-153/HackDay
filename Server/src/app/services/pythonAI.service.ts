import config from '../config';

const PYTHON_AI_SERVICE_URL = config.python_ai_service_url || 'http://localhost:8000';

interface EmotionAnalysisResult {
    emotions: string[];
    dominantEmotion: string;
    confidence: number;
    generatedText: string;
}

interface PatternAnalysisResult {
    features: {
        shapeType: string;
        colorMood: string;
        lineQuality: string;
        density: number;
        symmetry: number;
    };
    embedding?: number[];
}

export class PythonAIService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = PYTHON_AI_SERVICE_URL;
    }

    private async request<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Python AI Service error: ${response.statusText}`);
        }

        return response.json() as Promise<T>;
    }

    async analyzeEmotion(
        imageBase64: string,
        userId: string,
        context?: string,
    ): Promise<EmotionAnalysisResult> {
        return this.request('/api/v1/emotion/analyze', {
            image: imageBase64,
            userId,
            context,
        });
    }

    async analyzePattern(
        imageBase64: string,
        userId: string,
    ): Promise<PatternAnalysisResult> {
        return this.request('/api/v1/pattern/analyze', {
            image: imageBase64,
            userId,
        });
    }

    async interpretPattern(
        imageBase64: string,
        senderId: string,
        recipientId: string,
    ): Promise<{ interpretation: string; matchedPatterns: string[]; confidence: number }> {
        return this.request('/api/v1/pattern/interpret', {
            image: imageBase64,
            senderId,
            recipientId,
        });
    }

    async generateEmotionText(
        emotionComposition: unknown,
        userId: string,
        recipientId: string,
    ): Promise<{ text: string; alternatives: string[] }> {
        return this.request('/api/v1/chat/generate', {
            emotionComposition,
            userId,
            recipientId,
        });
    }

    async getAvatarSuggestion(
        userId: string,
        context: string,
        recipientId: string,
    ): Promise<{ suggestions: { text: string; emotion: string; confidence: number }[] }> {
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

    // Health check
    async healthCheck(): Promise<{ status: string }> {
        const response = await fetch(`${this.baseUrl}/health`);
        return response.json() as Promise<{ status: string }>;
    }
}

export const pythonAIService = new PythonAIService();
