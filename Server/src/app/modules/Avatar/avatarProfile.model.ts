import { Schema, model } from 'mongoose';
import { TAvatarProfile } from './avatar.interface';

const emotionalProfileSchema = new Schema(
    {
        dominantEmotions: { type: [String], default: [] },
        expressionStyle: {
            type: String,
            enum: ['poetic', 'direct', 'understated', 'elaborate'],
            default: 'direct',
        },
        intensityPreference: { type: Number, min: 0, max: 1, default: 0.5 },
        vocabularyLevel: {
            type: String,
            enum: ['simple', 'intermediate', 'advanced'],
            default: 'intermediate',
        },
        culturalContext: { type: String },
    },
    { _id: false },
);

const relationshipAdaptationSchema = new Schema(
    {
        relationshipType: { type: String, required: true },
        style: { type: String, required: true },
        emojiUse: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
        customNotes: { type: String },
    },
    { _id: false },
);

const triggerPatternSchema = new Schema(
    {
        context: { type: String, required: true },
        likelyEmotion: { type: String, required: true },
        confidence: { type: Number, min: 0, max: 1, default: 0.5 },
    },
    { _id: false },
);

const learningDataSchema = new Schema(
    {
        totalInteractions: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now },
        feedbackScore: { type: Number, default: 0 },
    },
    { _id: false },
);

const avatarProfileSchema = new Schema<TAvatarProfile>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
            ref: 'User',
        },
        emotionalProfile: {
            type: emotionalProfileSchema,
            default: () => ({}),
        },
        relationshipAdaptations: {
            type: Map,
            of: relationshipAdaptationSchema,
            default: new Map(),
        },
        triggerPatterns: {
            type: [triggerPatternSchema],
            default: [],
        },
        learningData: {
            type: learningDataSchema,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
    },
);

export const AvatarProfile = model<TAvatarProfile>('AvatarProfile', avatarProfileSchema);
