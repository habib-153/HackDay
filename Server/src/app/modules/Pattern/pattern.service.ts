import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUserPattern } from './pattern.interface';
import { UserPattern } from './pattern.model';
import { uploadToCloudinary } from '../../utils/uploadImage';
import { deleteImageFromCloudinary } from '../../utils/deleteImage';
import { aiService } from '../../services/aiService';

const createPattern = async (userId: string, payload: Partial<TUserPattern> & { imageData: string }) => {
    const imageUrl = await uploadToCloudinary(payload.imageData);

    // Analyze pattern with AI service
    let features, embedding;
    try {
        const analysis = await aiService.analyzePattern(payload.imageData, userId);
        features = analysis.features;
        embedding = analysis.embedding;
    } catch (error) {
        console.error('AI analysis failed, saving pattern without features:', error);
        // Continue without AI features if service fails
    }

    const pattern = await UserPattern.create({
        ...payload,
        userId,
        imageUrl,
        features,
        embedding,
    });

    return pattern;
};

const getPatterns = async (userId: string) => {
    const patterns = await UserPattern.find({ userId }).sort({ createdAt: -1 });
    return patterns;
};

const getPatternById = async (userId: string, patternId: string) => {
    const pattern = await UserPattern.findOne({ _id: patternId, userId });

    if (!pattern) {
        throw new AppError(httpStatus.NOT_FOUND, 'Pattern not found!');
    }

    return pattern;
};

const getPatternsByEmotion = async (userId: string, emotion: string) => {
    const patterns = await UserPattern.find({ userId, emotion }).sort({ createdAt: -1 });
    return patterns;
};

const deletePattern = async (userId: string, patternId: string) => {
    const pattern = await UserPattern.findOneAndDelete({ _id: patternId, userId });

    if (!pattern) {
        throw new AppError(httpStatus.NOT_FOUND, 'Pattern not found!');
    }

    // Delete image from Cloudinary
    if (pattern.imageUrl) {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
        const urlParts = pattern.imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
            const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
            const publicId = publicIdWithExtension.split('.')[0]; // Remove file extension
            await deleteImageFromCloudinary(publicId);
        }
    }

    return pattern;
};

const interpretPattern = async (
    recipientId: string,
    senderId: string,
    imageData: string,
) => {
    try {
        // Call AI service to interpret pattern
        const interpretation = await aiService.interpretPattern(
            imageData,
            senderId,
            recipientId,
        );

        return interpretation;
    } catch (error) {
        console.error('Pattern interpretation failed:', error);
        // Return fallback response
        return {
            interpretation: 'This pattern appears to express a complex emotion. The AI service is currently unavailable for detailed interpretation.',
            matchedPatterns: [],
            confidence: 0.3,
        };
    }
};

export const PatternServices = {
    createPattern,
    getPatterns,
    getPatternById,
    getPatternsByEmotion,
    deletePattern,
    interpretPattern,
};
