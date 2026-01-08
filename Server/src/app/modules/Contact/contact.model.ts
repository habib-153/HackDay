import { Schema, model } from 'mongoose';
import { TContact } from './contact.interface';

const contactSchema = new Schema<TContact>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            ref: 'User',
        },
        contactUserId: {
            type: String,
            required: [true, 'Contact User ID is required'],
            ref: 'User',
        },
        nickname: {
            type: String,
            trim: true,
        },
        relationshipType: {
            type: String,
            enum: ['friend', 'family', 'partner', 'colleague', 'other'],
            default: 'friend',
        },
        notes: {
            type: String,
            trim: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Compound index to prevent duplicate contacts
contactSchema.index({ userId: 1, contactUserId: 1 }, { unique: true });

export const Contact = model<TContact>('Contact', contactSchema);
