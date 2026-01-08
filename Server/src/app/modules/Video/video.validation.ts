import { z } from 'zod';

const createRoomSchema = z.object({
  body: z.object({
    name: z
      .string()
      .max(128)
      .regex(/^[a-zA-Z0-9_-]*$/, 'Room name can only contain letters, numbers, dashes, and underscores')
      .optional(),
    privacy: z.enum(['public', 'private']).optional().default('private'),
    expiresInMinutes: z.number().min(5).max(1440).optional().default(60), // 5 min to 24 hours
    maxParticipants: z.number().min(2).max(50).optional().default(10),
  }),
});

const generateTokenSchema = z.object({
  body: z.object({
    userName: z.string().max(100).optional(),
    isOwner: z.boolean().optional().default(false),
    expiresInSeconds: z.number().min(60).max(86400).optional().default(3600), // 1 min to 24 hours
  }),
});

export const VideoValidation = {
  createRoomSchema,
  generateTokenSchema,
};
