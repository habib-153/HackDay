import { z } from 'zod';

const createContactValidationSchema = z.object({
    body: z.object({
        contactUserId: z.string({
            required_error: 'Contact user ID is required',
        }),
        nickname: z.string().min(1).max(50).optional(),
        relationshipType: z
            .enum(['friend', 'family', 'partner', 'colleague', 'other'])
            .optional(),
        notes: z.string().max(500).optional(),
    }),
});

const updateContactValidationSchema = z.object({
    body: z.object({
        nickname: z.string().min(1).max(50).optional(),
        relationshipType: z
            .enum(['friend', 'family', 'partner', 'colleague', 'other'])
            .optional(),
        notes: z.string().max(500).optional(),
        isBlocked: z.boolean().optional(),
    }),
});

export const ContactValidation = {
    createContactValidationSchema,
    updateContactValidationSchema,
};
