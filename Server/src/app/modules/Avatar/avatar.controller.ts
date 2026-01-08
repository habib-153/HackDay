import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AvatarServices } from './avatar.service';

const getProfile = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await AvatarServices.getProfile(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Avatar profile retrieved successfully!',
        data: result,
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await AvatarServices.updateProfile(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Avatar profile updated successfully!',
        data: result,
    });
});

const getSuggestions = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { context, recipientId, recentEmotions } = req.body;
    const result = await AvatarServices.getSuggestions(userId, context, recipientId, recentEmotions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Suggestions retrieved successfully!',
        data: result,
    });
});

const getEmotionAssist = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const currentSelections = (req.query.emotions as string)?.split(',') || [];
    const result = await AvatarServices.getEmotionAssist(userId, currentSelections);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Emotion assist retrieved successfully!',
        data: result,
    });
});

const getRelationshipInsights = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await AvatarServices.getRelationshipInsights(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Relationship insights retrieved successfully!',
        data: result,
    });
});

const recordInteraction = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { interactionId, userAction, modifiedText } = req.body;
    const result = await AvatarServices.recordInteraction(userId, interactionId, userAction, modifiedText);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Interaction recorded successfully!',
        data: result,
    });
});

export const AvatarControllers = {
    getProfile,
    updateProfile,
    getSuggestions,
    getEmotionAssist,
    getRelationshipInsights,
    recordInteraction,
};
