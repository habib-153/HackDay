import { z } from 'zod';
export declare const VideoValidation: {
    createRoomSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            privacy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["public", "private"]>>>;
            expiresInMinutes: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            maxParticipants: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            privacy: "public" | "private";
            expiresInMinutes: number;
            maxParticipants: number;
            name?: string | undefined;
        }, {
            name?: string | undefined;
            privacy?: "public" | "private" | undefined;
            expiresInMinutes?: number | undefined;
            maxParticipants?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            privacy: "public" | "private";
            expiresInMinutes: number;
            maxParticipants: number;
            name?: string | undefined;
        };
    }, {
        body: {
            name?: string | undefined;
            privacy?: "public" | "private" | undefined;
            expiresInMinutes?: number | undefined;
            maxParticipants?: number | undefined;
        };
    }>;
    generateTokenSchema: z.ZodObject<{
        body: z.ZodObject<{
            userName: z.ZodOptional<z.ZodString>;
            isOwner: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            expiresInSeconds: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            isOwner: boolean;
            expiresInSeconds: number;
            userName?: string | undefined;
        }, {
            userName?: string | undefined;
            isOwner?: boolean | undefined;
            expiresInSeconds?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isOwner: boolean;
            expiresInSeconds: number;
            userName?: string | undefined;
        };
    }, {
        body: {
            userName?: string | undefined;
            isOwner?: boolean | undefined;
            expiresInSeconds?: number | undefined;
        };
    }>;
};
//# sourceMappingURL=video.validation.d.ts.map