import { Schema, model } from 'mongoose';
import { TUserPattern } from './pattern.interface';

const patternFeaturesSchema = new Schema(
    {
        shapeType: {
            type: String,
            enum: ['spiral', 'angular', 'flowing', 'geometric', 'chaotic', 'organic'],
        },
        colorMood: {
            type: String,
            enum: ['warm', 'cool', 'vibrant', 'muted', 'monochrome'],
        },
        lineQuality: {
            type: String,
            enum: ['smooth', 'jagged', 'continuous', 'broken'],
        },
        density: {
            type: Number,
            min: 0,
            max: 1,
        },
        symmetry: {
            type: Number,
            min: 0,
            max: 1,
        },
    },
    { _id: false },
);

const userPatternSchema = new Schema<TUserPattern>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            ref: 'User',
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
        },
        emotion: {
            type: String,
            required: [true, 'Emotion is required'],
        },
        intensity: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
            default: 0.5,
        },
        tags: {
            type: [String],
            default: [],
        },
        colorPalette: {
            type: [String],
            default: [],
        },
        features: {
            type: patternFeaturesSchema,
        },
        embedding: {
            type: [Number],
            select: false, // Large array, don't include by default
        },
    },
    {
        timestamps: true,
    },
);

// Index for querying user's patterns
userPatternSchema.index({ userId: 1, emotion: 1 });

export const UserPattern = model<TUserPattern>('UserPattern', userPatternSchema);
