import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCreateRoom, TGenerateToken } from './video.interface';
import { VideoRoom } from './video.model';
import crypto from 'crypto';

// Jitsi Meet public server (free, no account required)
const JITSI_DOMAIN = 'meet.jit.si';

// Generate a random room name
const generateRoomName = (): string => {
  const adjectives = ['happy', 'swift', 'bright', 'calm', 'bold'];
  const nouns = ['tiger', 'eagle', 'river', 'mountain', 'star'];
  const randomId = crypto.randomBytes(4).toString('hex');
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}-${noun}-${randomId}`;
};

// Create a new video room using Jitsi Meet
const createRoom = async (userId: string, payload: TCreateRoom) => {
  const roomName = payload.name || generateRoomName();
  const roomUrl = `https://${JITSI_DOMAIN}/${roomName}`;

  // Calculate expiry time
  const expiryTime = payload.expiresInMinutes
    ? new Date(Date.now() + payload.expiresInMinutes * 60 * 1000)
    : new Date(Date.now() + 60 * 60 * 1000); // Default 1 hour

  // Check if room already exists
  const existingRoom = await VideoRoom.findOne({ roomName, isActive: true });
  if (existingRoom) {
    throw new AppError(httpStatus.CONFLICT, 'Room with this name already exists');
  }

  // Save room to database
  const videoRoom = await VideoRoom.create({
    roomId: crypto.randomUUID(),
    roomName,
    roomUrl,
    createdBy: userId,
    expiresAt: expiryTime,
    maxParticipants: payload.maxParticipants || 10,
    isActive: true,
  });

  return {
    roomId: videoRoom.roomId,
    roomName: videoRoom.roomName,
    roomUrl: videoRoom.roomUrl,
    shareLink: videoRoom.roomUrl,
    expiresAt: videoRoom.expiresAt,
    maxParticipants: videoRoom.maxParticipants,
  };
};

// Get room details
const getRoom = async (roomName: string) => {
  const room = await VideoRoom.findOne({ roomName, isActive: true });

  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // Check if room has expired
  if (room.expiresAt && new Date() > room.expiresAt) {
    await VideoRoom.findOneAndUpdate({ roomName }, { isActive: false });
    throw new AppError(httpStatus.GONE, 'Room has expired');
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

// Generate join info for a participant (Jitsi doesn't need tokens for public rooms)
const generateMeetingToken = async (
  roomName: string,
  userId: string | null,
  payload: TGenerateToken,
) => {
  const room = await VideoRoom.findOne({ roomName, isActive: true });

  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // Check if room has expired
  if (room.expiresAt && new Date() > room.expiresAt) {
    await VideoRoom.findOneAndUpdate({ roomName }, { isActive: false });
    throw new AppError(httpStatus.GONE, 'Room has expired');
  }

  const isOwner = userId && room.createdBy === userId;

  // For Jitsi public rooms, we don't need actual tokens
  // Just return the room URL with optional user info as query params
  const userNameParam = payload.userName
    ? `#userInfo.displayName="${encodeURIComponent(payload.userName)}"`
    : '';

  return {
    roomUrl: room.roomUrl + userNameParam,
    roomName: room.roomName,
    userName: payload.userName || 'Guest',
    isOwner,
    // Note: Jitsi public rooms don't require tokens
    // For production with authentication, you'd use Jitsi JWT tokens
  };
};

// Delete a room
const deleteRoom = async (roomName: string, userId: string) => {
  const room = await VideoRoom.findOne({ roomName });

  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }

  if (room.createdBy !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only room owner can delete the room',
    );
  }

  // Mark as inactive in database
  // Note: Jitsi rooms are ephemeral - they exist only when participants are present
  await VideoRoom.findOneAndUpdate({ roomName }, { isActive: false });

  return null;
};

// List user's rooms
const getUserRooms = async (userId: string) => {
  const rooms = await VideoRoom.find({ createdBy: userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('roomId roomName roomUrl expiresAt maxParticipants createdAt');

  return rooms;
};

export const VideoServices = {
  createRoom,
  getRoom,
  generateMeetingToken,
  deleteRoom,
  getUserRooms,
};
