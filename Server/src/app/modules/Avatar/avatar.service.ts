import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TEmotionalProfile } from './avatar.interface';
import { AvatarProfile } from './avatarProfile.model';
import { AvatarInteraction } from './avatarInteraction.model';
import { Contact } from '../Contact/contact.model';

const getOrCreateProfile = async (userId: string) => {
    let profile = await AvatarProfile.findOne({ userId });

    if (!profile) {
        profile = await AvatarProfile.create({ userId });
    }

    return profile;
};

const getProfile = async (userId: string) => {
    return await getOrCreateProfile(userId);
};

const updateProfile = async (userId: string, updates: { emotionalProfile?: Partial<TEmotionalProfile> }) => {
    const profile = await getOrCreateProfile(userId);

    if (updates.emotionalProfile) {
        Object.assign(profile.emotionalProfile, updates.emotionalProfile);
    }

    profile.learningData.lastUpdated = new Date();
    await profile.save();

    return profile;
};

const getSuggestions = async (
    userId: string,
    context: string,
    recipientId: string,
    recentEmotions?: string[],
) => {
    const profile = await getOrCreateProfile(userId);

    // Get relationship context
    const contact = await Contact.findOne({ userId, contactUserId: recipientId });
    const relationshipType = contact?.relationshipType || 'friend';

    // TODO: Call Python AI service for personalized suggestions
    // For now, return placeholder suggestions
    const suggestions = [
        {
            id: `suggestion_${Date.now()}_1`,
            text: `I've been thinking about you. How are you doing?`,
            emotion: recentEmotions?.[0] || 'thoughtful',
            confidence: 0.8,
        },
        {
            id: `suggestion_${Date.now()}_2`,
            text: `Something reminded me of our conversations. Wanted to reach out.`,
            emotion: 'nostalgic',
            confidence: 0.7,
        },
        {
            id: `suggestion_${Date.now()}_3`,
            text: `Just wanted to send some positive vibes your way!`,
            emotion: 'joyful',
            confidence: 0.6,
        },
    ];

    // Log interactions for learning
    for (const suggestion of suggestions) {
        await AvatarInteraction.create({
            userId,
            type: 'suggestion',
            context,
            suggestion: suggestion.text,
        });
    }

    return {
        suggestions,
        relationshipContext: relationshipType,
        profile: {
            expressionStyle: profile.emotionalProfile.expressionStyle,
            intensityPreference: profile.emotionalProfile.intensityPreference,
        },
    };
};

const getEmotionAssist = async (userId: string, currentSelections: string[]) => {
    // TODO: Call Python AI service for emotion classification help
    const suggestions = [
        { emotion: 'cautious optimism', description: 'Hopeful but measured' },
        { emotion: 'gentle concern', description: 'Caring with warmth' },
        { emotion: 'reflective', description: 'Thoughtful and contemplative' },
    ];

    return suggestions;
};

const getRelationshipInsights = async (userId: string) => {
    const contacts = await Contact.find({ userId, isBlocked: false });

    // TODO: Analyze interaction patterns with Python AI service
    const insights = contacts.slice(0, 3).map((contact) => ({
        contactId: contact.contactUserId,
        insight: `You haven't connected recently. Based on your patterns, reaching out often helps.`,
        suggestedAction: 'send_message',
        confidence: 0.7,
    }));

    return insights;
};

const recordInteraction = async (
    userId: string,
    interactionId: string,
    userAction: 'accepted' | 'modified' | 'rejected' | 'ignored',
    modifiedText?: string,
) => {
    const interaction = await AvatarInteraction.findByIdAndUpdate(
        interactionId,
        { userAction, modifiedText },
        { new: true },
    );

    if (!interaction || interaction.userId !== userId) {
        throw new AppError(httpStatus.NOT_FOUND, 'Interaction not found!');
    }

    // Update profile feedback score
    const profile = await getOrCreateProfile(userId);
    profile.learningData.totalInteractions += 1;

    if (userAction === 'accepted') {
        profile.learningData.feedbackScore += 1;
    } else if (userAction === 'rejected') {
        profile.learningData.feedbackScore -= 0.5;
    }

    await profile.save();

    return interaction;
};

export const AvatarServices = {
    getProfile,
    updateProfile,
    getSuggestions,
    getEmotionAssist,
    getRelationshipInsights,
    recordInteraction,
};
