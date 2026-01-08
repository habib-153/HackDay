import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CallServices } from './call.service';

const initiateCall = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { recipientId } = req.body;
    const result = await CallServices.initiateCall(userId, recipientId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Call initiated successfully!',
        data: result,
    });
});

const joinCall = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await CallServices.joinCall(id, userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Joined call successfully!',
        data: result,
    });
});

const endCall = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await CallServices.endCall(id, userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Call ended successfully!',
        data: result,
    });
});

const getCallHistory = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await CallServices.getCallHistory(userId, limit);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Call history retrieved successfully!',
        data: result,
    });
});

const logEmotion = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await CallServices.logEmotion(id, userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Emotion logged successfully!',
        data: result,
    });
});

const getCallEmotions = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await CallServices.getCallEmotions(id, userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Call emotions retrieved successfully!',
        data: result,
    });
});

export const CallControllers = {
    initiateCall,
    joinCall,
    endCall,
    getCallHistory,
    logEmotion,
    getCallEmotions,
};
