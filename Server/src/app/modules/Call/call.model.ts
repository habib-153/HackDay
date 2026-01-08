import { Schema, model } from 'mongoose';
import { TCallSession } from './call.interface';

const callSessionSchema = new Schema<TCallSession>(
    {
        participants: {
            type: [String],
            required: [true, 'Participants are required'],
            validate: {
                validator: (v: string[]) => v.length === 2,
                message: 'Call must have exactly 2 participants',
            },
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'ended', 'missed'],
            default: 'pending',
        },
        initiatorId: {
            type: String,
            required: [true, 'Initiator ID is required'],
            ref: 'User',
        },
        startedAt: {
            type: Date,
        },
        endedAt: {
            type: Date,
        },
        duration: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

// Index for querying user's call history
callSessionSchema.index({ participants: 1, createdAt: -1 });

export const CallSession = model<TCallSession>('CallSession', callSessionSchema);
