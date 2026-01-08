import { Schema, model } from 'mongoose';
import { TEmotionLog } from './call.interface';

const emotionLogSchema = new Schema<TEmotionLog>(
    {
        callId: {
            type: String,
            required: [true, 'Call ID is required'],
            ref: 'CallSession',
        },
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            ref: 'User',
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now,
        },
        detectedEmotions: {
            type: [String],
            required: true,
        },
        dominantEmotion: {
            type: String,
            required: true,
        },
        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
        },
        generatedText: {
            type: String,
            required: true,
        },
        frameData: {
            type: String,
            select: false, // Don't include by default (large data)
        },
    },
    {
        timestamps: true,
    },
);

// Index for querying emotions in a call
emotionLogSchema.index({ callId: 1, timestamp: 1 });

export const EmotionLog = model<TEmotionLog>('EmotionLog', emotionLogSchema);
