import { geminiService } from './gemini.service';
import { openaiService } from './openai.service';

type TaskType =
    | 'emotion_analysis'
    | 'pattern_analysis'
    | 'text_generation'
    | 'avatar_suggestion'
    | 'quick_classification';

interface AIRequest {
    task: TaskType;
    payload: unknown;
}

export class AIRouterService {
    /**
     * Routes AI requests to the most appropriate provider based on task type
     */
    async route(request: AIRequest): Promise<unknown> {
        switch (request.task) {
            case 'emotion_analysis':
                // Gemini for image/video analysis
                return this.handleEmotionAnalysis(request.payload as { imageBase64: string });

            case 'pattern_analysis':
                // Gemini for pattern recognition
                return this.handlePatternAnalysis(request.payload as { imageBase64: string });

            case 'text_generation':
                // GPT-4o for nuanced text generation
                return this.handleTextGeneration(request.payload as {
                    emotionComposition: unknown;
                    userProfile: unknown;
                    relationshipContext: string;
                });

            case 'avatar_suggestion':
                // GPT-4o for personality-consistent suggestions
                return this.handleAvatarSuggestion(request.payload as {
                    userProfile: unknown;
                    context: string;
                    recipientName: string;
                    relationshipType: string;
                });

            case 'quick_classification':
                // Gemini Flash for fast, simple tasks
                return this.handleQuickClassification(request.payload as { text: string });

            default:
                throw new Error(`Unknown task type: ${request.task}`);
        }
    }

    private async handleEmotionAnalysis(payload: { imageBase64: string }) {
        return geminiService.analyzeEmotion(payload.imageBase64);
    }

    private async handlePatternAnalysis(payload: { imageBase64: string }) {
        const prompt = `Analyze this pattern/drawing and extract:
    - shapeType: spiral, angular, flowing, geometric, chaotic, or organic
    - colorMood: warm, cool, vibrant, muted, or monochrome
    - lineQuality: smooth, jagged, continuous, or broken
    - density: 0-1 scale
    - symmetry: 0-1 scale
    - emotionalImpression: what emotion this pattern conveys
    
    Return as JSON only.`;

        const result = await geminiService.analyzeImage(payload.imageBase64, prompt);

        try {
            return JSON.parse(result.text);
        } catch {
            return { error: 'Failed to parse pattern analysis' };
        }
    }

    private async handleTextGeneration(payload: {
        emotionComposition: unknown;
        userProfile: unknown;
        relationshipContext: string;
    }) {
        return openaiService.generateEmotionText(
            payload.emotionComposition as Parameters<typeof openaiService.generateEmotionText>[0],
            payload.userProfile as Parameters<typeof openaiService.generateEmotionText>[1],
            payload.relationshipContext,
        );
    }

    private async handleAvatarSuggestion(payload: {
        userProfile: unknown;
        context: string;
        recipientName: string;
        relationshipType: string;
    }) {
        return openaiService.generateAvatarSuggestion(
            payload.userProfile as Parameters<typeof openaiService.generateAvatarSuggestion>[0],
            payload.context,
            payload.recipientName,
            payload.relationshipType,
        );
    }

    private async handleQuickClassification(payload: { text: string }) {
        const result = await geminiService.generateContent(
            `Classify the emotion in this text: "${payload.text}"
      Return JSON: { "emotion": "string", "intensity": 0-1 }`,
        );

        try {
            return JSON.parse(result.text);
        } catch {
            return { emotion: 'neutral', intensity: 0.5 };
        }
    }
}

export const aiRouterService = new AIRouterService();
