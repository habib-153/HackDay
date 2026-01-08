import { z } from 'zod';

const initiateCallValidationSchema = z.object({
    body: z.object({
        recipientId: z.string({
            required_error: 'Recipient ID is required',
        }),
    }),
});

const logEmotionValidationSchema = z.object({
    body: z.object({
        detectedEmotions: z.array(z.string()).min(1),
        dominantEmotion: z.string(),
        confidence: z.number().min(0).max(1),
        generatedText: z.string(),
        frameData: z.string().optional(),
    }),
});

export const CallValidation = {
    initiateCallValidationSchema,
    logEmotionValidationSchema,
};
