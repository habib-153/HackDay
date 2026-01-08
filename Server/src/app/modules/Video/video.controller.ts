import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VideoServices } from './video.service';

const createRoom = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await VideoServices.createRoom(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Video room created successfully',
    data: result,
  });
});

const getRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomName } = req.params;
  const result = await VideoServices.getRoom(roomName);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room details retrieved',
    data: result,
  });
});

const generateToken = catchAsync(async (req: Request, res: Response) => {
  const { roomName } = req.params;
  // User might not be authenticated (guest joining)
  const userId = req.user?.userId || null;
  const result = await VideoServices.generateMeetingToken(
    roomName,
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meeting token generated',
    data: result,
  });
});

const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomName } = req.params;
  const userId = req.user.userId;
  await VideoServices.deleteRoom(roomName, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully',
    data: null,
  });
});

const getUserRooms = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await VideoServices.getUserRooms(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User rooms retrieved',
    data: result,
  });
});

export const VideoControllers = {
  createRoom,
  getRoom,
  generateToken,
  deleteRoom,
  getUserRooms,
};
