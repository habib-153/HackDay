// Socket.io event types for HeartSpeak AI

// Call Events
export interface CallInitiatePayload {
    recipientId: string;
}

export interface CallIncomingPayload {
    callId: string;
    callerId: string;
}

export interface CallSignalPayload {
    callId: string;
    signal: RTCSessionDescriptionInit | RTCIceCandidateInit;
    fromUserId?: string;
    targetUserId?: string;
}

export interface CallEmotionPayload {
    callId: string;
    fromUserId: string;
    emotions: string[];
    dominantEmotion: string;
    text: string;
    confidence: number;
}

// Chat Events
export interface ChatMessagePayload {
    conversationId: string;
    message: {
        id: string;
        senderId: string;
        emotionComposition: {
            primary: { emotion: string; intensity: number };
            secondary?: { emotion: string; intensity: number };
        };
        generatedText: string;
        visualStyle: {
            colors: string[];
            type: 'gradient' | 'pattern' | 'solid';
        };
        createdAt: string;
    };
}

export interface ChatTypingPayload {
    conversationId: string;
    userId: string;
}

export interface ChatReactionPayload {
    messageId: string;
    userId: string;
    reaction: {
        resonated: boolean;
        reactionEmoji?: string;
    };
}

// Avatar Events
export interface AvatarSuggestionPayload {
    text: string;
    emotion: string;
    confidence: number;
}

export interface AvatarInsightPayload {
    contactId: string;
    insight: string;
    suggestedAction: string;
}

// Event Maps
export interface ServerToClientEvents {
    // Call
    'call:incoming': (payload: CallIncomingPayload) => void;
    'call:accepted': (payload: { callId: string }) => void;
    'call:rejected': (payload: { callId: string }) => void;
    'call:signal': (payload: CallSignalPayload) => void;
    'call:emotion': (payload: CallEmotionPayload) => void;
    'call:ended': (payload: { callId: string }) => void;
    'call:error': (payload: { message: string }) => void;

    // Chat
    'chat:message': (payload: ChatMessagePayload) => void;
    'chat:typing': (payload: ChatTypingPayload) => void;
    'chat:stop-typing': (payload: ChatTypingPayload) => void;
    'chat:reaction': (payload: ChatReactionPayload) => void;

    // Avatar
    'avatar:suggestion': (payload: AvatarSuggestionPayload) => void;
    'avatar:insight': (payload: AvatarInsightPayload) => void;
}

export interface ClientToServerEvents {
    // Call
    'call:initiate': (payload: CallInitiatePayload) => void;
    'call:accept': (payload: { callId: string }) => void;
    'call:reject': (payload: { callId: string }) => void;
    'call:signal': (payload: CallSignalPayload) => void;
    'call:end': (payload: { callId: string }) => void;

    // Chat
    'chat:join': (payload: { conversationId: string }) => void;
    'chat:leave': (payload: { conversationId: string }) => void;
    'chat:typing': (payload: { conversationId: string }) => void;
    'chat:stop-typing': (payload: { conversationId: string }) => void;
    'chat:reaction': (payload: { messageId: string; conversationId: string; reaction: { resonated: boolean; reactionEmoji?: string } }) => void;

    // Emotion
    'emotion:frame': (payload: { callId: string; frameData: string; targetUserId: string }) => void;

    // Avatar
    'avatar:request-suggestion': (payload: { context: string; recipientId: string }) => void;
}
