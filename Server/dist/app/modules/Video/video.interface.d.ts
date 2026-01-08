export interface TCreateRoom {
    name?: string;
    privacy?: 'public' | 'private';
    expiresInMinutes?: number;
    maxParticipants?: number;
}
export interface TVideoRoom {
    roomId: string;
    roomName: string;
    roomUrl: string;
    createdBy: string;
    expiresAt?: Date;
    maxParticipants: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface TDailyRoomResponse {
    id: string;
    name: string;
    url: string;
    created_at: string;
    config: {
        exp?: number;
        max_participants?: number;
    };
}
export interface TDailyTokenResponse {
    token: string;
}
export interface TGenerateToken {
    userName?: string;
    isOwner?: boolean;
    expiresInSeconds?: number;
}
//# sourceMappingURL=video.interface.d.ts.map