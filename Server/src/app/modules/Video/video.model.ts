import { Schema, model } from 'mongoose';
import { TVideoRoom } from './video.interface';

const videoRoomSchema = new Schema<TVideoRoom>(
  {
    roomId: { type: String, required: true, unique: true },
    roomName: { type: String, required: true, unique: true },
    roomUrl: { type: String, required: true },
    createdBy: { type: String, required: true, ref: 'User' },
    expiresAt: { type: Date },
    maxParticipants: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Index for faster queries (roomName and roomId already indexed via unique: true)
videoRoomSchema.index({ createdBy: 1, isActive: 1 });

export const VideoRoom = model<TVideoRoom>('VideoRoom', videoRoomSchema);
