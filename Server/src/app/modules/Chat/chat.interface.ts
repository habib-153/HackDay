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

export interface TEmotionMessage {
    conversationId: string;
    senderId: string;
    recipientId: string;
    emotionComposition: TEmotionComposition;
    generatedText: string;
    alternativeTexts?: string[];
    selectedTextIndex: number;
    visualStyle: TVisualStyle;
    recipientReaction?: {
        resonated: boolean;
        reactionEmoji?: string;
        timestamp: Date;
    };
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
