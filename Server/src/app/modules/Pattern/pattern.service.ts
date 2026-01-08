/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUserPattern } from './pattern.interface';
import { UserPattern } from './pattern.model';
import { uploadToCloudinary } from '../../utils/uploadImage';
import { deleteImageFromCloudinary } from '../../utils/deleteImage';

const createPattern = async (userId: string, payload: Partial<TUserPattern> & { imageData: string }) => {
    const imageUrl = await uploadToCloudinary(payload.imageData);

    const pattern = await UserPattern.create({
        ...payload,
        userId,
        imageUrl,
    });

    // TODO: Call Python AI service to analyze pattern and generate features/embedding

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
    // TODO: Get sender's pattern library for context when AI service is integrated
    // const senderPatterns = await UserPattern.find({ userId: senderId });

    // TODO: Call Python AI service to:
    // 1. Extract features from received pattern
    // 2. Match with sender's pattern library
    // 3. Generate interpretation text

    // Placeholder response
    return {
        interpretation: 'This pattern appears to express a complex emotion. Analysis pending AI integration.',
        matchedPatterns: [],
        confidence: 0,
    };
};

export const PatternServices = {
    createPattern,
    getPatterns,
    getPatternById,
    getPatternsByEmotion,
    deletePattern,
    interpretPattern,
};
