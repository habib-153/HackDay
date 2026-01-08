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

// Send message - handles different message types
const sendMessage = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { conversationId } = req.params;
    const { type, emotionComposition, visualStyle, selectedTextIndex, patternId, content } = req.body;

    let result;

    switch (type) {
        case 'pattern':
            if (!patternId) {
                return sendResponse(res, {
                    statusCode: httpStatus.BAD_REQUEST,
                    success: false,
                    message: 'Pattern ID is required for pattern messages!',
                    data: null,
                });
            }
            result = await ChatServices.sendPatternMessage(userId, conversationId, { patternId });
            break;
            
        case 'text':
            if (!content) {
                return sendResponse(res, {
                    statusCode: httpStatus.BAD_REQUEST,
                    success: false,
                    message: 'Content is required for text messages!',
                    data: null,
                });
            }
            result = await ChatServices.sendTextMessage(userId, conversationId, { content });
            break;
            
        case 'emotion':
        default:
            if (!emotionComposition || !visualStyle) {
                return sendResponse(res, {
                    statusCode: httpStatus.BAD_REQUEST,
                    success: false,
                    message: 'Emotion composition and visual style are required!',
                    data: null,
                });
            }
            result = await ChatServices.sendEmotionMessage(userId, conversationId, {
                emotionComposition,
                visualStyle,
                selectedTextIndex,
            });
            break;
    }

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
