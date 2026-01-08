import { Schema, model } from 'mongoose';
import { TConversation } from './chat.interface';

const conversationSchema = new Schema<TConversation>(
    {
        participants: {
            type: [String],
            required: [true, 'Participants are required'],
            validate: {
                validator: (v: string[]) => v.length === 2,
                message: 'Conversation must have exactly 2 participants',
            },
        },
        lastMessage: {
            type: String,
        },
        lastMessageAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

// Compound index to prevent duplicate conversations
conversationSchema.index({ participants: 1 }, { unique: true });

// Index for querying user's conversations
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

export const Conversation = model<TConversation>('Conversation', conversationSchema);
