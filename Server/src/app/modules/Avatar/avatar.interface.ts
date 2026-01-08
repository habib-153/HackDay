export interface TEmotionalProfile {
    dominantEmotions: string[];
    expressionStyle: 'poetic' | 'direct' | 'understated' | 'elaborate';
    intensityPreference: number; // 0-1
    vocabularyLevel: 'simple' | 'intermediate' | 'advanced';
    culturalContext?: string;
}

export interface TRelationshipAdaptation {
    relationshipType: string;
    style: string;
    emojiUse: 'high' | 'medium' | 'low';
    customNotes?: string;
}

export interface TTriggerPattern {
    context: string;
    likelyEmotion: string;
    confidence: number;
}

export interface TAvatarProfile {
    userId: string;
    emotionalProfile: TEmotionalProfile;
    relationshipAdaptations: Map<string, TRelationshipAdaptation>;
    triggerPatterns: TTriggerPattern[];
    learningData: {
        totalInteractions: number;
        lastUpdated: Date;
        feedbackScore: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TAvatarInteraction {
    userId: string;
    type: 'suggestion' | 'assist' | 'check_in' | 'insight';
    context: string;
    suggestion: string;
    userAction: 'accepted' | 'modified' | 'rejected' | 'ignored';
    modifiedText?: string;
    timestamp: Date;
}
