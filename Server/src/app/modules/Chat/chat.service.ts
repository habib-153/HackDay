import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TEmotionComposition, TVisualStyle } from './chat.interface';
import { Conversation } from './conversation.model';
import { EmotionMessage } from './emotionMessage.model';
import { User } from '../User/user.model';

const createConversation = async (userId: string, recipientId: string) => {
    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
        throw new AppError(httpStatus.NOT_FOUND, 'Recipient not found!');
    }

    // Check if conversation already exists (in either order)
    const existingConversation = await Conversation.findOne({
        participants: { $all: [userId, recipientId] },
    });

    if (existingConversation) {
        return existingConversation;
    }

    // Create sorted participants array for consistent ordering
    const participants = [userId, recipientId].sort() as [string, string];

    const conversation = await Conversation.create({ participants });
    return conversation;
};

const getConversations = async (userId: string) => {
    const conversations = await Conversation.find({
        participants: userId,
    }).sort({ lastMessageAt: -1 });

    return conversations;
};

const getMessages = async (userId: string, conversationId: string, limit = 50, skip = 0) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.participants.includes(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied!');
    }

    const messages = await EmotionMessage.find({ conversationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Mark messages as read
    await EmotionMessage.updateMany(
        { conversationId, recipientId: userId, isRead: false },
        { isRead: true },
    );

    return messages.reverse();
};

const generateText = async (
    userId: string,
    recipientId: string,
    emotionComposition: TEmotionComposition,
) => {
    // TODO: Call Python AI service to generate text based on emotion composition
    // For now, return placeholder
    const placeholderTexts = [
        `I'm feeling ${emotionComposition.primary.emotion} right now, and wanted to share that with you.`,
        `There's something ${emotionComposition.primary.emotion} I've been experiencing today.`,
        `Just wanted to let you know I'm in a ${emotionComposition.primary.emotion} mood.`,
    ];

    return {
        generatedText: placeholderTexts[0],
        alternativeTexts: placeholderTexts,
    };
};

const sendMessage = async (
    userId: string,
    conversationId: string,
    payload: {
        emotionComposition: TEmotionComposition;
        visualStyle: TVisualStyle;
        selectedTextIndex?: number;
    },
) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.participants.includes(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied!');
    }

    const recipientId = conversation.participants.find((p) => p !== userId);

    // Generate text if not provided
    const { generatedText, alternativeTexts } = await generateText(
        userId,
        recipientId!,
        payload.emotionComposition,
    );

    const message = await EmotionMessage.create({
        conversationId,
        senderId: userId,
        recipientId,
        emotionComposition: payload.emotionComposition,
        generatedText,
        alternativeTexts,
        selectedTextIndex: payload.selectedTextIndex || 0,
        visualStyle: payload.visualStyle,
    });

    // Update conversation's last message
    conversation.lastMessage = generatedText.substring(0, 100);
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return message;
};

const reactToMessage = async (
    userId: string,
    messageId: string,
    reaction: { resonated: boolean; reactionEmoji?: string },
) => {
    const message = await EmotionMessage.findById(messageId);

    if (!message || message.recipientId !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied!');
    }

    message.recipientReaction = {
        ...reaction,
        timestamp: new Date(),
    };

    await message.save();
    return message;
};

export const ChatServices = {
    createConversation,
    getConversations,
    getMessages,
    generateText,
    sendMessage,
    reactToMessage,
};
