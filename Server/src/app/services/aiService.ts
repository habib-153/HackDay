/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios';
import config from '../config';

interface PatternFeatures {
    shapeType: 'spiral' | 'angular' | 'flowing' | 'geometric' | 'chaotic' | 'organic';
    colorMood: 'warm' | 'cool' | 'vibrant' | 'muted' | 'monochrome';
    lineQuality: 'smooth' | 'jagged' | 'continuous' | 'broken';
    density: number;
    symmetry: number;
    description?: string;
}

interface PatternAnalysisResponse {
    features: PatternFeatures;
    embedding?: number[];
}

interface PatternInterpretResponse {
    interpretation: string;
    matchedPatterns: string[];
    confidence: number;
}

class AIService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.ai_service_url || 'http://localhost:8000/api/v1',
            timeout: 30000, // 30 seconds for AI processing
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Analyze a pattern image and extract visual features
     */
    async analyzePattern(imageData: string, userId: string): Promise<PatternAnalysisResponse> {
        try {
            const response = await this.client.post('/pattern/analyze', {
                image: imageData,
                userId,
            });

            return response.data;
        } catch (error) {
            console.error('Error analyzing pattern:', error);
            throw new Error('Failed to analyze pattern with AI service');
        }
    }

    /**
     * Interpret a pattern based on sender's pattern library
     */
    async interpretPattern(
        imageData: string,
        senderId: string,
        recipientId: string,
    ): Promise<PatternInterpretResponse> {
        try {
            const response = await this.client.post('/pattern/interpret', {
                image: imageData,
                senderId,
                recipientId,
            });

            return response.data;
        } catch (error) {
            console.error('Error interpreting pattern:', error);
            throw new Error('Failed to interpret pattern with AI service');
        }
    }

    /**
     * Generate text suggestions based on emotion
     */
    async generateEmotionText(
        emotion: string,
        intensity: number,
        context?: string,
    ): Promise<string[]> {
        try {
            const response = await this.client.post('/pattern/generate-text', null, {
                params: {
                    emotion,
                    intensity,
                    context,
                },
            });

            return response.data.suggestions || [];
        } catch (error) {
            console.error('Error generating emotion text:', error);
            throw new Error('Failed to generate emotion text');
        }
    }

    /**
     * Analyze emotion from video frame
     */
    async analyzeEmotion(frameData: string, userId: string): Promise<any> {
        try {
            const response = await this.client.post('/emotion/analyze', {
                frame: frameData,
                userId,
            });

            return response.data;
        } catch (error) {
            console.error('Error analyzing emotion:', error);
            throw new Error('Failed to analyze emotion');
        }
    }

    /**
     * Get avatar suggestions
     */
    async getAvatarSuggestions(
        userId: string,
        context: string,
        recipientId: string,
        recentEmotions?: string[],
    ): Promise<any> {
        try {
            const response = await this.client.post('/avatar/suggestions', {
                userId,
                context,
                recipientId,
                recentEmotions,
            });

            return response.data;
        } catch (error) {
            console.error('Error getting avatar suggestions:', error);
            throw new Error('Failed to get avatar suggestions');
        }
    }
}

export const aiService = new AIService();
export type { PatternFeatures, PatternAnalysisResponse, PatternInterpretResponse };
