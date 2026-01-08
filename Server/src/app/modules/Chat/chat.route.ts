import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ChatValidation } from './chat.validation';
import { ChatControllers } from './chat.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Conversations
router.post(
    '/conversations',
    auth('user', 'admin'),
    validateRequest(ChatValidation.createConversationValidationSchema),
    ChatControllers.createConversation,
);

router.get('/conversations', auth('user', 'admin'), ChatControllers.getConversations);

// Messages
router.get('/:conversationId/messages', auth('user', 'admin'), ChatControllers.getMessages);

router.post(
    '/:conversationId/messages',
    auth('user', 'admin'),
    validateRequest(ChatValidation.sendMessageValidationSchema),
    ChatControllers.sendMessage,
);

// Text Generation
router.post(
    '/generate-text',
    auth('user', 'admin'),
    validateRequest(ChatValidation.generateTextValidationSchema),
    ChatControllers.generateText,
);

// Reactions
router.post(
    '/messages/:messageId/react',
    auth('user', 'admin'),
    validateRequest(ChatValidation.reactToMessageValidationSchema),
    ChatControllers.reactToMessage,
);

export const ChatRoutes = router;
