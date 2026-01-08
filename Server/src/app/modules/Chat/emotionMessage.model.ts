import { Schema, model } from 'mongoose';
import { TEmotionMessage } from './chat.interface';

const emotionCompositionSchema = new Schema(
    {
        primary: {
            emotion: { type: String, required: true },
            intensity: { type: Number, required: true, min: 0, max: 1 },
        },
        secondary: {
            emotion: { type: String },
            intensity: { type: Number, min: 0, max: 1 },
        },
        bodySensation: { type: String },
        memoryContext: { type: String },
    },
    { _id: false },
);

const visualStyleSchema = new Schema(
    {
        colors: { type: [String], required: true },
        type: { type: String, enum: ['gradient', 'pattern', 'solid'], default: 'gradient' },
        patternId: { type: String },
    },
    { _id: false },
);

const patternDataSchema = new Schema(
    {
        patternId: { type: String, required: true, ref: 'UserPattern' },
        imageUrl: { type: String, required: true },
        emotion: { type: String, required: true },
        intensity: { type: Number, required: true, min: 0, max: 1 },
        tags: { type: [String], default: [] },
        colorPalette: { type: [String], default: [] },
    },
    { _id: false },
);

const recipientReactionSchema = new Schema(
    {
        resonated: { type: Boolean, default: false },
        reactionEmoji: { type: String },
        timestamp: { type: Date },
    },
    { _id: false },
);

const emotionMessageSchema = new Schema<TEmotionMessage>(
    {
        conversationId: {
            type: String,
            required: [true, 'Conversation ID is required'],
            ref: 'Conversation',
        },
        senderId: {
            type: String,
            required: [true, 'Sender ID is required'],
            ref: 'User',
        },
        recipientId: {
            type: String,
            required: [true, 'Recipient ID is required'],
            ref: 'User',
        },
        type: {
            type: String,
            enum: ['emotion', 'pattern', 'text'],
            default: 'emotion',
        },
        // For emotion messages
        emotionComposition: {
            type: emotionCompositionSchema,
        },
        // For pattern messages
        patternData: {
            type: patternDataSchema,
        },
        patternInterpretation: {
            type: String,
        },
        // For text messages
        textContent: {
            type: String,
        },
        // Generated content
        generatedText: {
            type: String,
        },
        alternativeTexts: {
            type: [String],
            default: [],
        },
        selectedTextIndex: {
            type: Number,
            default: 0,
        },
        visualStyle: {
            type: visualStyleSchema,
        },
        recipientReaction: {
            type: recipientReactionSchema,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Index for querying messages in a conversation
emotionMessageSchema.index({ conversationId: 1, createdAt: 1 });

export const EmotionMessage = model<TEmotionMessage>('EmotionMessage', emotionMessageSchema);
