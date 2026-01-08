import { TCreateRoom, TGenerateToken } from './video.interface';
export declare const VideoServices: {
    createRoom: (userId: string, payload: TCreateRoom) => Promise<{
        roomId: string;
        roomName: string;
        roomUrl: string;
        shareLink: string;
        expiresAt: Date | undefined;
        maxParticipants: number;
    }>;
    getRoom: (roomName: string) => Promise<{
        roomId: string;
        roomName: string;
        roomUrl: string;
        expiresAt: Date | undefined;
        maxParticipants: number;
        isActive: boolean;
    }>;
    generateMeetingToken: (roomName: string, userId: string | null, payload: TGenerateToken) => Promise<{
        token: string;
        roomUrl: string;
        roomName: string;
        expiresAt: Date;
        isOwner: boolean | undefined;
    }>;
    deleteRoom: (roomName: string, userId: string) => Promise<null>;
    getUserRooms: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./video.interface").TVideoRoom, {}, {}> & import("./video.interface").TVideoRoom & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
};
//# sourceMappingURL=video.service.d.ts.map