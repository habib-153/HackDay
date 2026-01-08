"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const video_model_1 = require("./video.model");
const DAILY_API_URL = 'https://api.daily.co/v1';
// Helper function for Daily.co API calls
const dailyFetch = async (endpoint, options = {}) => {
    const response = await fetch(`${DAILY_API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config_1.default.daily_api_key}`,
            ...options.headers,
        },
    });
    if (!response.ok) {
        const errorData = (await response.json());
        throw new AppError_1.default(response.status, errorData.error || errorData.info || 'Daily.co API error');
    }
    // Handle 204 No Content (for DELETE operations)
    if (response.status === 204) {
        return {};
    }
    return (await response.json());
};
// Create a new video room
const createRoom = async (userId, payload) => {
    const expiryTime = payload.expiresInMinutes
        ? Math.floor(Date.now() / 1000) + payload.expiresInMinutes * 60
        : Math.floor(Date.now() / 1000) + 3600; // Default 1 hour
    const dailyPayload = {
        name: payload.name, // Daily will generate random name if not provided
        privacy: payload.privacy || 'private',
        properties: {
            exp: expiryTime,
            max_participants: payload.maxParticipants || 10,
            enable_chat: true,
            enable_screenshare: true,
            enable_knocking: payload.privacy === 'private',
            start_video_off: false,
            start_audio_off: false,
        },
    };
    const dailyRoom = await dailyFetch('/rooms', {
        method: 'POST',
        body: JSON.stringify(dailyPayload),
    });
    // Save room to database
    const videoRoom = await video_model_1.VideoRoom.create({
        roomId: dailyRoom.id,
        roomName: dailyRoom.name,
        roomUrl: dailyRoom.url,
        createdBy: userId,
        expiresAt: new Date(expiryTime * 1000),
        maxParticipants: payload.maxParticipants || 10,
        isActive: true,
    });
    return {
        roomId: videoRoom.roomId,
        roomName: videoRoom.roomName,
        roomUrl: videoRoom.roomUrl,
        shareLink: videoRoom.roomUrl, // Can customize this to your domain later
        expiresAt: videoRoom.expiresAt,
        maxParticipants: videoRoom.maxParticipants,
    };
};
// Get room details
const getRoom = async (roomName) => {
    const room = await video_model_1.VideoRoom.findOne({ roomName, isActive: true });
    if (!room) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
    }
    // Check if room has expired
    if (room.expiresAt && new Date() > room.expiresAt) {
        // Mark as inactive
        await video_model_1.VideoRoom.findOneAndUpdate({ roomName }, { isActive: false });
        throw new AppError_1.default(http_status_1.default.GONE, 'Room has expired');
    }
    return {
        roomId: room.roomId,
        roomName: room.roomName,
        roomUrl: room.roomUrl,
        expiresAt: room.expiresAt,
        maxParticipants: room.maxParticipants,
        isActive: room.isActive,
    };
};
// Generate meeting token for a participant
const generateMeetingToken = async (roomName, userId, payload) => {
    const room = await video_model_1.VideoRoom.findOne({ roomName, isActive: true });
    if (!room) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
    }
    // Check if room has expired
    if (room.expiresAt && new Date() > room.expiresAt) {
        await video_model_1.VideoRoom.findOneAndUpdate({ roomName }, { isActive: false });
        throw new AppError_1.default(http_status_1.default.GONE, 'Room has expired');
    }
    const isOwner = (userId && room.createdBy === userId) || payload.isOwner;
    const expiryTime = Math.floor(Date.now() / 1000) + (payload.expiresInSeconds || 3600);
    const tokenPayload = {
        properties: {
            room_name: roomName,
            user_name: payload.userName || 'Guest',
            exp: expiryTime,
            is_owner: isOwner,
            enable_screenshare: true,
            start_video_off: false,
            start_audio_off: false,
        },
    };
    const tokenResponse = await dailyFetch('/meeting-tokens', {
        method: 'POST',
        body: JSON.stringify(tokenPayload),
    });
    return {
        token: tokenResponse.token,
        roomUrl: room.roomUrl,
        roomName: room.roomName,
        expiresAt: new Date(expiryTime * 1000),
        isOwner,
    };
};
// Delete a room
const deleteRoom = async (roomName, userId) => {
    const room = await video_model_1.VideoRoom.findOne({ roomName });
    if (!room) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
    }
    if (room.createdBy !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Only room owner can delete the room');
    }
    // Delete from Daily.co
    try {
        await dailyFetch(`/rooms/${roomName}`, { method: 'DELETE' });
    }
    catch (error) {
        // If room doesn't exist on Daily.co, just continue with local deletion
        if (error instanceof AppError_1.default && error.statusCode !== 404) {
            throw error;
        }
    }
    // Mark as inactive in database
    await video_model_1.VideoRoom.findOneAndUpdate({ roomName }, { isActive: false });
    return null;
};
// List user's rooms
const getUserRooms = async (userId) => {
    const rooms = await video_model_1.VideoRoom.find({ createdBy: userId, isActive: true })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('roomId roomName roomUrl expiresAt maxParticipants createdAt');
    return rooms;
};
exports.VideoServices = {
    createRoom,
    getRoom,
    generateMeetingToken,
    deleteRoom,
    getUserRooms,
};
//# sourceMappingURL=video.service.js.map