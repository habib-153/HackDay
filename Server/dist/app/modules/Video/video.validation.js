"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoValidation = void 0;
const zod_1 = require("zod");
const createRoomSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .max(128)
            .regex(/^[a-zA-Z0-9_-]*$/, 'Room name can only contain letters, numbers, dashes, and underscores')
            .optional(),
        privacy: zod_1.z.enum(['public', 'private']).optional().default('private'),
        expiresInMinutes: zod_1.z.number().min(5).max(1440).optional().default(60), // 5 min to 24 hours
        maxParticipants: zod_1.z.number().min(2).max(50).optional().default(10),
    }),
});
const generateTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        userName: zod_1.z.string().max(100).optional(),
        isOwner: zod_1.z.boolean().optional().default(false),
        expiresInSeconds: zod_1.z.number().min(60).max(86400).optional().default(3600), // 1 min to 24 hours
    }),
});
exports.VideoValidation = {
    createRoomSchema,
    generateTokenSchema,
};
//# sourceMappingURL=video.validation.js.map