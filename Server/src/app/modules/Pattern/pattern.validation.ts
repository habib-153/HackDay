import { z } from 'zod';

const createPatternValidationSchema = z.object({
    body: z.object({
        imageData: z.string({
            required_error: 'Image data is required',
        }),
        emotion: z.string({
            required_error: 'Emotion is required',
        }),
        intensity: z.number().min(0).max(1).optional(),
        tags: z.array(z.string()).optional(),
        colorPalette: z.array(z.string()).optional(),
    }),
});

const interpretPatternValidationSchema = z.object({
    body: z.object({
        imageData: z.string({
            required_error: 'Image data is required',
        }),
        senderId: z.string({
            required_error: 'Sender ID is required',
        }),
    }),
});

export const PatternValidation = {
    createPatternValidationSchema,
    interpretPatternValidationSchema,
};
