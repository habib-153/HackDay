import config from '../config';

const GEMINI_MODEL = 'models/gemini-3-flash-preview';

interface GeminiResponse {
    text: string;
    candidates?: unknown[];
}

interface GeminiAPIResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{ text?: string }>;
        };
    }>;
}

export class GeminiService {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = config.gemini_api_key || '';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

    async generateContent(prompt: string, systemInstruction?: string): Promise<GeminiResponse> {
        const url = `${this.baseUrl}/${GEMINI_MODEL}:generateContent?key=${this.apiKey}`;

        const body = {
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
            systemInstruction: systemInstruction ? {
                parts: [{ text: systemInstruction }],
            } : undefined,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json() as GeminiAPIResponse;
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return { text, candidates: data.candidates };
    }

    async analyzeImage(imageBase64: string, prompt: string): Promise<GeminiResponse> {
        const url = `${this.baseUrl}/${GEMINI_MODEL}:generateContent?key=${this.apiKey}`;

        const body = {
            contents: [
                {
                    parts: [
                        {
                            inlineData: {
                                mimeType: 'image/jpeg',
                                data: imageBase64,
                            },
                        },
                        { text: prompt },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 512,
            },
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json() as GeminiAPIResponse;
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return { text, candidates: data.candidates };
    }

    async analyzeEmotion(imageBase64: string): Promise<{
        emotions: string[];
        dominantEmotion: string;
        confidence: number;
    }> {
        const prompt = `Analyze the facial expression in this image and identify the emotions being expressed. 
    Return a JSON object with:
    - emotions: array of detected emotions
    - dominantEmotion: the primary emotion
    - confidence: a number between 0 and 1
    
    Only return valid JSON, no markdown.`;

        const result = await this.analyzeImage(imageBase64, prompt);

        try {
            return JSON.parse(result.text);
        } catch {
            return {
                emotions: ['neutral'],
                dominantEmotion: 'neutral',
                confidence: 0.5,
            };
        }
    }
}

export const geminiService = new GeminiService();

