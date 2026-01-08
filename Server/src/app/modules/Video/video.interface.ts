export interface TCreateRoom {
  name?: string; // Optional custom room name
  privacy?: 'public' | 'private';
  expiresInMinutes?: number; // Room auto-expires after X minutes
  maxParticipants?: number;
}

export interface TVideoRoom {
  roomId: string; // Daily.co room ID
  roomName: string; // Room name (used in URL)
  roomUrl: string; // Full Daily.co room URL
  createdBy: string; // User ID who created the room
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
