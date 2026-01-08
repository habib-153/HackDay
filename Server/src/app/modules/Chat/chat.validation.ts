import { z } from 'zod';

const emotionCompositionSchema = z.object({
    primary: z.object({
        emotion: z.string(),
        intensity: z.number().min(0).max(1),
    }),
    secondary: z
        .object({
            emotion: z.string(),
            intensity: z.number().min(0).max(1),
        })
        .optional(),
    bodySensation: z.string().optional(),
    memoryContext: z.string().optional(),
});

const visualStyleSchema = z.object({
    colors: z.array(z.string()),
    type: z.enum(['gradient', 'pattern', 'solid']).optional(),
    patternId: z.string().optional(),
});

const createConversationValidationSchema = z.object({
    body: z.object({
        recipientId: z.string({
            required_error: 'Recipient ID is required',
        }),
    }),
});

const sendMessageValidationSchema = z.object({
    body: z.object({
        emotionComposition: emotionCompositionSchema,
        visualStyle: visualStyleSchema,
        selectedTextIndex: z.number().optional(),
    }),
});

const generateTextValidationSchema = z.object({
    body: z.object({
        emotionComposition: emotionCompositionSchema,
        recipientId: z.string({
            required_error: 'Recipient ID is required',
        }),
    }),
});

const reactToMessageValidationSchema = z.object({
    body: z.object({
        resonated: z.boolean(),
        reactionEmoji: z.string().optional(),
    }),
});

export const ChatValidation = {
    createConversationValidationSchema,
    sendMessageValidationSchema,
    generateTextValidationSchema,
    reactToMessageValidationSchema,
};
