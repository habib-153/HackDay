export interface TConversation {
    participants: [string, string];
    lastMessage?: string;
    lastMessageAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TEmotionComposition {
    primary: {
        emotion: string;
        intensity: number;
    };
    secondary?: {
        emotion: string;
        intensity: number;
    };
    bodySensation?: string;
    memoryContext?: string;
}

export interface TVisualStyle {
    colors: string[];
    type: 'gradient' | 'pattern' | 'solid';
    patternId?: string;
}

export interface TPatternData {
    patternId: string;
    imageUrl: string;
    emotion: string;
    intensity: number;
    tags?: string[];
    colorPalette?: string[];
}

export type TMessageType = 'emotion' | 'pattern' | 'text';

export interface TEmotionMessage {
    conversationId: string;
    senderId: string;
    recipientId: string;
    type: TMessageType;
    // For emotion messages
    emotionComposition?: TEmotionComposition;
    // For pattern messages
    patternData?: TPatternData;
    patternInterpretation?: string;
    // For text messages
    textContent?: string;
    // Generated content
    generatedText?: string;
    alternativeTexts?: string[];
    selectedTextIndex?: number;
    visualStyle?: TVisualStyle;
    recipientReaction?: {
        resonated: boolean;
        reactionEmoji?: string;
        timestamp: Date;
    };
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
