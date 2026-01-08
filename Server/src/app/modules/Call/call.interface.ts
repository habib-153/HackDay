export interface TCallSession {
    participants: [string, string]; // User IDs
    status: 'pending' | 'active' | 'ended' | 'missed';
    initiatorId: string;
    startedAt?: Date;
    endedAt?: Date;
    duration?: number; // in seconds
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TEmotionLog {
    callId: string;
    userId: string;
    timestamp: Date;
    detectedEmotions: string[];
    dominantEmotion: string;
    confidence: number;
    generatedText: string;
    frameData?: string; // Base64 image (optional storage)
}
