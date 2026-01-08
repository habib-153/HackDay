import config from '../config';

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenAIResponse {
    text: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

interface OpenAIAPIResponse {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export class OpenAIService {
    private apiKey: string;
    private baseUrl: string;
    private model: string;

    constructor() {
        this.apiKey = config.openai_api_key || '';
        this.baseUrl = 'https://api.openai.com/v1';
        this.model = 'gpt-4o';
    }

    async generateChat(messages: OpenAIMessage[], temperature = 0.7): Promise<OpenAIResponse> {
        const url = `${this.baseUrl}/chat/completions`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: this.model,
                messages,
                temperature,
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json() as OpenAIAPIResponse;
        const text = data.choices?.[0]?.message?.content || '';

        return { text, usage: data.usage };
    }

    async generateEmotionText(
        emotionComposition: {
            primary: { emotion: string; intensity: number };
            secondary?: { emotion: string; intensity: number };
            bodySensation?: string;
            memoryContext?: string;
        },
        userProfile: {
            expressionStyle: string;
            intensityPreference: number;
        },
        relationshipContext: string,
    ): Promise<{ text: string; alternatives: string[] }> {
        const systemPrompt = `You are an empathetic emotion translator for HeartSpeak AI. 
    Convert emotion selections into natural, heartfelt messages.
    Maintain the user's authentic voice while enriching their emotional expression.
    
    User's expression style: ${userProfile.expressionStyle}
    Intensity preference: ${userProfile.intensityPreference * 100}%
    Relationship: ${relationshipContext}`;

        const userPrompt = `Generate a heartfelt message based on these emotions:
    Primary: ${emotionComposition.primary.emotion} (intensity: ${emotionComposition.primary.intensity * 100}%)
    ${emotionComposition.secondary ? `Secondary: ${emotionComposition.secondary.emotion} (intensity: ${emotionComposition.secondary.intensity * 100}%)` : ''}
    ${emotionComposition.bodySensation ? `Body sensation: ${emotionComposition.bodySensation}` : ''}
    ${emotionComposition.memoryContext ? `Memory context: ${emotionComposition.memoryContext}` : ''}
    
    Provide 3 variations:
    1. A longer, more elaborate version
    2. A medium-length version
    3. A shorter, concise version
    
    Return as JSON: { "texts": ["version1", "version2", "version3"] }`;

        const result = await this.generateChat([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ]);

        try {
            const parsed = JSON.parse(result.text);
            return {
                text: parsed.texts[0],
                alternatives: parsed.texts,
            };
        } catch {
            return {
                text: result.text,
                alternatives: [result.text],
            };
        }
    }

    async generateAvatarSuggestion(
        userProfile: {
            dominantEmotions: string[];
            expressionStyle: string;
        },
        context: string,
        recipientName: string,
        relationshipType: string,
    ): Promise<string> {
        const systemPrompt = `You are a personal emotion avatar for a user of HeartSpeak AI.
    You understand their unique way of expressing feelings.
    Their dominant emotions: ${userProfile.dominantEmotions.join(', ')}
    Their expression style: ${userProfile.expressionStyle}
    
    Suggest expressions that sound authentically like them.`;

        const userPrompt = `Context: ${context}
    Recipient: ${recipientName} (${relationshipType})
    
    Suggest a short, natural message the user might want to send.`;

        const result = await this.generateChat([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ], 0.8);

        return result.text;
    }
}

export const openaiService = new OpenAIService();
