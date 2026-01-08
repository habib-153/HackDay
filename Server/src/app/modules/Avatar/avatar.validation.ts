import { z } from 'zod';

const updateProfileValidationSchema = z.object({
    body: z.object({
        emotionalProfile: z
            .object({
                dominantEmotions: z.array(z.string()).optional(),
                expressionStyle: z.enum(['poetic', 'direct', 'understated', 'elaborate']).optional(),
                intensityPreference: z.number().min(0).max(1).optional(),
                vocabularyLevel: z.enum(['simple', 'intermediate', 'advanced']).optional(),
                culturalContext: z.string().optional(),
            })
            .optional(),
    }),
});

const getSuggestionsValidationSchema = z.object({
    body: z.object({
        context: z.string({
            required_error: 'Context is required',
        }),
        recipientId: z.string({
            required_error: 'Recipient ID is required',
        }),
        recentEmotions: z.array(z.string()).optional(),
    }),
});

const recordInteractionValidationSchema = z.object({
    body: z.object({
        interactionId: z.string({
            required_error: 'Interaction ID is required',
        }),
        userAction: z.enum(['accepted', 'modified', 'rejected', 'ignored']),
        modifiedText: z.string().optional(),
    }),
});

export const AvatarValidation = {
    updateProfileValidationSchema,
    getSuggestionsValidationSchema,
    recordInteractionValidationSchema,
};
