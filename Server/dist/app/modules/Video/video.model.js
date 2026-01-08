"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRoom = void 0;
const mongoose_1 = require("mongoose");
const videoRoomSchema = new mongoose_1.Schema({
    roomId: { type: String, required: true, unique: true },
    roomName: { type: String, required: true, unique: true },
    roomUrl: { type: String, required: true },
    createdBy: { type: String, required: true, ref: 'User' },
    expiresAt: { type: Date },
    maxParticipants: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
// Index for faster queries
videoRoomSchema.index({ createdBy: 1, isActive: 1 });
videoRoomSchema.index({ roomName: 1 });
exports.VideoRoom = (0, mongoose_1.model)('VideoRoom', videoRoomSchema);
//# sourceMappingURL=video.model.js.map