import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUserPattern, TPatternFeatures } from './pattern.interface';
import { UserPattern } from './pattern.model';
import { uploadToCloudinary } from '../../utils/uploadImage';
import { deleteImageFromCloudinary } from '../../utils/deleteImage';
import { pythonAIService, PatternAnalysisResult, PatternInterpretResult, PatternMatchResult } from '../../services/pythonAI.service';

// ============ Pattern CRUD Operations ============

const createPattern = async (
    userId: string, 
    payload: Partial<TUserPattern> & { imageData: string }
) => {
    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(payload.imageData);

    // Create pattern with initial data
    const pattern = await UserPattern.create({
        ...payload,
        userId,
        imageUrl,
    });

    // Analyze pattern with AI Service (async, don't block)
    try {
        const analysis = await pythonAIService.analyzePattern(payload.imageData);
        
        if (analysis.success && analysis.features) {
            // Update pattern with AI-analyzed features
            const features: TPatternFeatures = {
                shapeType: analysis.features.shapeType as TPatternFeatures['shapeType'],
                colorMood: analysis.features.colorMood as TPatternFeatures['colorMood'],
                lineQuality: analysis.features.lineQuality as TPatternFeatures['lineQuality'],
                density: analysis.features.density,
                symmetry: analysis.features.symmetry,
            };

            await UserPattern.findByIdAndUpdate(pattern._id, {
                features,
                // If user didn't provide emotion, use AI suggestion
                ...((!payload.emotion && analysis.suggestedEmotion) && { 
                    emotion: analysis.suggestedEmotion 
                }),
                // If user didn't provide intensity, use AI suggestion
                ...((!payload.intensity && analysis.suggestedIntensity) && { 
                    intensity: analysis.suggestedIntensity 
                }),
                // Merge AI suggested tags with user tags
                tags: [...new Set([...(payload.tags || []), ...(analysis.suggestedTags || [])])],
            });

            // Return updated pattern
            const updatedPattern = await UserPattern.findById(pattern._id);
            return {
                pattern: updatedPattern,
                aiAnalysis: {
                    features: analysis.features,
                    suggestedEmotion: analysis.suggestedEmotion,
                    suggestedIntensity: analysis.suggestedIntensity,
                    interpretation: analysis.interpretation,
                    suggestedTags: analysis.suggestedTags,
                },
            };
        }
    } catch (error) {
        console.error('AI pattern analysis failed, continuing without features:', error);
    }

    return { pattern, aiAnalysis: null };
};

const analyzePatternOnly = async (imageData: string): Promise<PatternAnalysisResult> => {
    try {
        const analysis = await pythonAIService.analyzePattern(imageData);
        return analysis;
    } catch (error) {
        console.error('Pattern analysis failed:', error);
        return {
            success: false,
            features: {
                shapeType: 'unknown',
                colorMood: 'unknown',
                lineQuality: 'unknown',
                density: 0.5,
                symmetry: 0.5,
            },
            suggestedEmotion: 'neutral',
            suggestedIntensity: 0.5,
            interpretation: 'Unable to analyze pattern',
            suggestedTags: [],
            error: String(error),
        };
    }
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

const updatePattern = async (
    userId: string,
    patternId: string,
    payload: Partial<TUserPattern>
) => {
    const pattern = await UserPattern.findOneAndUpdate(
        { _id: patternId, userId },
        payload,
        { new: true }
    );

    if (!pattern) {
        throw new AppError(httpStatus.NOT_FOUND, 'Pattern not found!');
    }

    return pattern;
};

const deletePattern = async (userId: string, patternId: string) => {
    const pattern = await UserPattern.findOneAndDelete({ _id: patternId, userId });

    if (!pattern) {
        throw new AppError(httpStatus.NOT_FOUND, 'Pattern not found!');
    }

    // Delete image from Cloudinary
    if (pattern.imageUrl) {
        const urlParts = pattern.imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
            const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
            const publicId = publicIdWithExtension.split('.')[0];
            await deleteImageFromCloudinary(publicId);
        }
    }

    return pattern;
};

// ============ Pattern AI Operations ============

const interpretPattern = async (
    senderId: string,
    senderName: string,
    patternId: string,
    imageData?: string,
): Promise<PatternInterpretResult> => {
    // Get the pattern
    const pattern = await UserPattern.findOne({ _id: patternId, userId: senderId });

    if (!pattern) {
        throw new AppError(httpStatus.NOT_FOUND, 'Pattern not found!');
    }

    // Get sender's other patterns for context
    const senderPatterns = await UserPattern.find({ 
        userId: senderId,
        _id: { $ne: patternId }
    }).limit(10);

    const libraryPatterns = senderPatterns.map(p => ({
        name: p.emotion, // Use emotion as name if no name field
        emotion: p.emotion,
        intensity: p.intensity,
        features: p.features,
    }));

    // Use provided image or fetch pattern image
    const image = imageData || pattern.imageUrl;

    // If it's a URL, we need to convert to base64
    let base64Image = image;
    if (image.startsWith('http')) {
        try {
            const response = await fetch(image);
            const buffer = await response.arrayBuffer();
            base64Image = `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
        } catch (error) {
            console.error('Failed to fetch pattern image:', error);
        }
    }

    try {
        const interpretation = await pythonAIService.interpretPattern(
            base64Image,
            senderName,
            pattern.emotion, // Use emotion as pattern name
            pattern.emotion,
            Math.round(pattern.intensity * 100),
            pattern.tags,
            pattern.features,
            libraryPatterns,
        );

        return interpretation;
    } catch (error) {
        console.error('Pattern interpretation failed:', error);
        return {
            success: false,
            interpretation: `${senderName} is expressing ${pattern.emotion} with ${Math.round(pattern.intensity * 100)}% intensity.`,
            emotionalContext: `Feeling ${pattern.emotion}`,
            suggestedResponses: [
                `I understand you're feeling ${pattern.emotion}`,
                'Thank you for sharing this with me',
            ],
            error: String(error),
        };
    }
};

const matchPattern = async (
    imageData: string,
    senderId: string,
    recipientId: string,
): Promise<PatternMatchResult> => {
    // Get sender's pattern library
    const senderPatterns = await UserPattern.find({ userId: senderId });

    const libraryPatterns = senderPatterns.map(p => ({
        id: p._id?.toString(),
        name: p.emotion,
        emotion: p.emotion,
        intensity: p.intensity,
        tags: p.tags,
        features: p.features,
    }));

    try {
        const matchResult = await pythonAIService.matchPattern(
            imageData,
            senderId,
            recipientId,
            libraryPatterns,
        );

        return matchResult;
    } catch (error) {
        console.error('Pattern matching failed:', error);
        return {
            success: false,
            matchedPatterns: [],
            confidence: 0,
            interpretation: 'Unable to match pattern with library.',
            error: String(error),
        };
    }
};

// ============ Pattern Usage Tracking ============

const incrementPatternUsage = async (userId: string, patternId: string) => {
    const pattern = await UserPattern.findOneAndUpdate(
        { _id: patternId, userId },
        { $inc: { usedCount: 1 } },
        { new: true }
    );

    return pattern;
};

export const PatternServices = {
    createPattern,
    analyzePatternOnly,
    getPatterns,
    getPatternById,
    getPatternsByEmotion,
    updatePattern,
    deletePattern,
    interpretPattern,
    matchPattern,
    incrementPatternUsage,
};
