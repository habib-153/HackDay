import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { VideoValidation } from './video.validation';
import { VideoControllers } from './video.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Create a new video room (requires auth)
router.post(
  '/rooms',
  auth('user', 'admin'),
  validateRequest(VideoValidation.createRoomSchema),
  VideoControllers.createRoom,
);

// Get room details (public - for joining)
router.get('/rooms/:roomName', VideoControllers.getRoom);

// Generate meeting token (optional auth for guest support)
router.post(
  '/rooms/:roomName/token',
  validateRequest(VideoValidation.generateTokenSchema),
  VideoControllers.generateToken,
);

// Delete a room (requires auth, only owner)
router.delete(
  '/rooms/:roomName',
  auth('user', 'admin'),
  VideoControllers.deleteRoom,
);

// List user's rooms (requires auth)
router.get('/my-rooms', auth('user', 'admin'), VideoControllers.getUserRooms);

export const VideoRoutes = router;
