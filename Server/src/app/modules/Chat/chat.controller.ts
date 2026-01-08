import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatServices } from './chat.service';

const createConversation = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { recipientId } = req.body;
    const result = await ChatServices.createConversation(userId, recipientId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Conversation created successfully!',
        data: result,
    });
});

const getConversations = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await ChatServices.getConversations(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Conversations retrieved successfully!',
        data: result,
    });
});

const getMessages = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { conversationId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;
    const result = await ChatServices.getMessages(userId, conversationId, limit, skip);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages retrieved successfully!',
        data: result,
    });
});

const generateText = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { emotionComposition, recipientId } = req.body;
    const result = await ChatServices.generateText(userId, recipientId, emotionComposition);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Text generated successfully!',
        data: result,
    });
});

const sendMessage = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { conversationId } = req.params;
    const result = await ChatServices.sendMessage(userId, conversationId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Message sent successfully!',
        data: result,
    });
});

const reactToMessage = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { messageId } = req.params;
    const result = await ChatServices.reactToMessage(userId, messageId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reaction added successfully!',
        data: result,
    });
});

export const ChatControllers = {
    createConversation,
    getConversations,
    getMessages,
    generateText,
    sendMessage,
    reactToMessage,
};
