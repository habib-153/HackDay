import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TEmotionComposition, TVisualStyle, TMessageType } from './chat.interface';
import { Conversation } from './conversation.model';
import { EmotionMessage } from './emotionMessage.model';
import { User } from '../User/user.model';
import { UserPattern } from '../Pattern/pattern.model';
import { pythonAIService } from '../../services/pythonAI.service';

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
    try {
        const result = await pythonAIService.generateEmotionText(
            emotionComposition,
            userId,
            recipientId,
        );
        return {
            generatedText: result.text,
            alternativeTexts: result.alternatives,
        };
    } catch (error) {
        console.error('AI text generation failed, using fallback:', error);
        // Fallback
        const placeholderTexts = [
            `I'm feeling ${emotionComposition.primary.emotion} right now, and wanted to share that with you.`,
            `There's something ${emotionComposition.primary.emotion} I've been experiencing today.`,
            `Just wanted to let you know I'm in a ${emotionComposition.primary.emotion} mood.`,
        ];
        return {
            generatedText: placeholderTexts[0],
            alternativeTexts: placeholderTexts,
        };
    }
};

const sendEmotionMessage = async (
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

    // Generate text
    const { generatedText, alternativeTexts } = await generateText(
        userId,
        recipientId!,
        payload.emotionComposition,
    );

    const message = await EmotionMessage.create({
        conversationId,
        senderId: userId,
        recipientId,
        type: 'emotion' as TMessageType,
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

const sendPatternMessage = async (
    userId: string,
    conversationId: string,
    payload: {
        patternId: string;
    },
) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.participants.includes(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied!');
    }

    const recipientId = conversation.participants.find((p) => p !== userId);

    // Get the pattern
    const pattern = await UserPattern.findOne({ _id: payload.patternId, userId });
    if (!pattern) {
        throw new AppError(httpStatus.NOT_FOUND, 'Pattern not found!');
    }

    // Get user's name for interpretation
    const sender = await User.findById(userId);
    const senderName = sender?.name || 'Someone';

    // Generate AI interpretation
    let interpretation = `${senderName} is expressing ${pattern.emotion} with this pattern.`;
    try {
        const interpretResult = await pythonAIService.interpretPattern(
            pattern.imageUrl,
            senderName,
            pattern.emotion,
            pattern.emotion,
            Math.round(pattern.intensity * 100),
            pattern.tags,
            pattern.features,
        );
        if (interpretResult.success) {
            interpretation = interpretResult.interpretation;
        }
    } catch (error) {
        console.error('Pattern interpretation failed:', error);
    }

    // Increment pattern usage
    await UserPattern.findByIdAndUpdate(payload.patternId, {
        $inc: { usedCount: 1 },
    });

    const message = await EmotionMessage.create({
        conversationId,
        senderId: userId,
        recipientId,
        type: 'pattern' as TMessageType,
        patternData: {
            patternId: pattern._id?.toString() || payload.patternId,
            imageUrl: pattern.imageUrl,
            emotion: pattern.emotion,
            intensity: pattern.intensity,
            tags: pattern.tags,
            colorPalette: pattern.colorPalette,
        },
        patternInterpretation: interpretation,
        generatedText: interpretation,
        visualStyle: {
            colors: pattern.colorPalette || ['#6B7280'],
            type: 'pattern',
            patternId: payload.patternId,
        },
    });

    // Update conversation's last message
    conversation.lastMessage = `[Pattern: ${pattern.emotion}] ${interpretation.substring(0, 50)}...`;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return message;
};

const sendTextMessage = async (
    userId: string,
    conversationId: string,
    payload: {
        content: string;
    },
) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation || !conversation.participants.includes(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied!');
    }

    const recipientId = conversation.participants.find((p) => p !== userId);

    const message = await EmotionMessage.create({
        conversationId,
        senderId: userId,
        recipientId,
        type: 'text' as TMessageType,
        textContent: payload.content,
        generatedText: payload.content,
    });

    // Update conversation's last message
    conversation.lastMessage = payload.content.substring(0, 100);
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
    sendEmotionMessage,
    sendPatternMessage,
    sendTextMessage,
    reactToMessage,
};
