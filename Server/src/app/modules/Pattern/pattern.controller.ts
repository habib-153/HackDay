import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PatternServices } from './pattern.service';

const createPattern = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await PatternServices.createPattern(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Pattern created successfully!',
        data: result,
    });
});

const getPatterns = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await PatternServices.getPatterns(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patterns retrieved successfully!',
        data: result,
    });
});

const getPatternById = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await PatternServices.getPatternById(userId, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Pattern retrieved successfully!',
        data: result,
    });
});

const getPatternsByEmotion = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { emotion } = req.params;
    const result = await PatternServices.getPatternsByEmotion(userId, emotion);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patterns retrieved successfully!',
        data: result,
    });
});

const deletePattern = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    await PatternServices.deletePattern(userId, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Pattern deleted successfully!',
        data: null,
    });
});

const interpretPattern = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { imageData, senderId } = req.body;
    const result = await PatternServices.interpretPattern(userId, senderId, imageData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Pattern interpreted successfully!',
        data: result,
    });
});

export const PatternControllers = {
    createPattern,
    getPatterns,
    getPatternById,
    getPatternsByEmotion,
    deletePattern,
    interpretPattern,
};
