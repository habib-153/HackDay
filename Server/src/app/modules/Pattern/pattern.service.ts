import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUserPattern } from './pattern.interface';
import { UserPattern } from './pattern.model';
// import { uploadToCloudinary } from '../../utils/cloudinary'; // TODO: Implement

const createPattern = async (userId: string, payload: Partial<TUserPattern> & { imageData: string }) => {
    // TODO: Upload imageData to Cloudinary and get URL
    // const imageUrl = await uploadToCloudinary(payload.imageData);
    const imageUrl = payload.imageData; // Temporary: store base64 directly

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

    // TODO: Delete image from Cloudinary

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
