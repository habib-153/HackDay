import { Schema, model } from 'mongoose';
import { TAvatarInteraction } from './avatar.interface';

const avatarInteractionSchema = new Schema<TAvatarInteraction>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            ref: 'User',
        },
        type: {
            type: String,
            enum: ['suggestion', 'assist', 'check_in', 'insight'],
            required: true,
        },
        context: {
            type: String,
            required: true,
        },
        suggestion: {
            type: String,
            required: true,
        },
        userAction: {
            type: String,
            enum: ['accepted', 'modified', 'rejected', 'ignored'],
            default: 'ignored',
        },
        modifiedText: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

// Index for querying user's interactions
avatarInteractionSchema.index({ userId: 1, timestamp: -1 });

export const AvatarInteraction = model<TAvatarInteraction>('AvatarInteraction', avatarInteractionSchema);
