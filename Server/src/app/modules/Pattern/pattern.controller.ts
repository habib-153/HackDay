import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PatternServices } from './pattern.service';

// Create a new pattern with AI analysis
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

// Analyze pattern image without saving (for preview)
const analyzePattern = catchAsync(async (req, res) => {
    const { imageData } = req.body;
    
    if (!imageData) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'Image data is required!',
            data: null,
        });
    }

    const result = await PatternServices.analyzePatternOnly(imageData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: result.success,
        message: result.success ? 'Pattern analyzed successfully!' : 'Pattern analysis failed',
        data: result,
    });
});

// Get all patterns for current user
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

// Get single pattern by ID
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

// Get patterns filtered by emotion
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

// Update a pattern
const updatePattern = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await PatternServices.updatePattern(userId, id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Pattern updated successfully!',
        data: result,
    });
});

// Delete a pattern
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

// Interpret a pattern (generate meaning for recipient)
const interpretPattern = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { patternId, senderName, imageData } = req.body;
    
    if (!patternId) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'Pattern ID is required!',
            data: null,
        });
    }

    const result = await PatternServices.interpretPattern(
        userId,
        senderName || 'Someone',
        patternId,
        imageData,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: result.success,
        message: result.success ? 'Pattern interpreted successfully!' : 'Interpretation failed',
        data: result,
    });
});

// Match a pattern against sender's library
const matchPattern = catchAsync(async (req, res) => {
    const recipientId = req.user.userId;
    const { imageData, senderId } = req.body;
    
    if (!imageData || !senderId) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: 'Image data and sender ID are required!',
            data: null,
        });
    }

    const result = await PatternServices.matchPattern(imageData, senderId, recipientId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: result.success,
        message: result.success ? 'Pattern matched successfully!' : 'Pattern matching failed',
        data: result,
    });
});

// Increment pattern usage count
const usePattern = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const result = await PatternServices.incrementPatternUsage(userId, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Pattern usage recorded!',
        data: result,
    });
});

export const PatternControllers = {
    createPattern,
    analyzePattern,
    getPatterns,
    getPatternById,
    getPatternsByEmotion,
    updatePattern,
    deletePattern,
    interpretPattern,
    matchPattern,
    usePattern,
};
