import { Server, Socket } from 'socket.io';
import { PythonAIService } from '../services/pythonAI.service';
import { CallServices } from '../modules/Call/call.service';

const pythonAI = new PythonAIService();

interface EmotionFramePayload {
    callId: string;
    frameData: string;
    targetUserId: string;
}

interface EmotionBroadcastPayload {
    callId: string;
    userId: string;
    emotion: {
        dominantEmotion: string;
        emotions: string[];
        confidence: number;
        intensity: number;
        generatedText?: string;
        timestamp: number;
    };
}

interface EmotionHistoryPayload {
    callId: string;
}

interface AvatarSuggestionPayload {
    context: string;
    recipientId: string;
}

export const emotionHandlers = (io: Server, socket: Socket, userId: string) => {
    // Simple emotion broadcast (for test page - client does AI analysis directly)
    socket.on('emotion:frame', async (payload: EmotionFramePayload | EmotionBroadcastPayload) => {
        // Check if this is a simple broadcast (has emotion object) vs frame analysis (has frameData)
        if ('emotion' in payload && payload.emotion) {
            const { callId, emotion } = payload as EmotionBroadcastPayload;
            console.log(`[Emotion] Broadcasting ${emotion.dominantEmotion} from ${userId} to call ${callId}`);
            
            // Broadcast to the call room (excluding sender)
            socket.to(`call:${callId}`).emit('emotion:result', {
                userId,
                emotion,
            });
            return;
        }

        // Original frame analysis logic
        const { callId, frameData, targetUserId } = payload as EmotionFramePayload;
        if (!frameData || !targetUserId) {
            console.log('[Emotion] Invalid payload, skipping');
            return;
        }
        try {
            console.log(`[Emotion] Analyzing frame from ${userId} for call ${callId}`);

            // Call Python AI service for emotion analysis
            const result = await pythonAI.analyzeEmotion(frameData, userId, callId);

            // Log emotion to database if confidence is above threshold
            if (result.confidence > 0.3) {
                try {
                    await CallServices.logEmotion(callId, userId, {
                        detectedEmotions: result.emotions,
                        dominantEmotion: result.dominantEmotion,
                        confidence: result.confidence,
                        generatedText: result.generatedText,
                    });
                } catch (logError) {
                    console.error('[Emotion] Failed to log emotion:', logError);
                }
            }

            // Send emotion analysis to the other participant
            io.to(`user:${targetUserId}`).emit('call:emotion', {
                callId,
                fromUserId: userId,
                emotions: result.emotions,
                dominantEmotion: result.dominantEmotion,
                text: result.generatedText,
                confidence: result.confidence,
                intensity: result.intensity || 0.5,
                nuances: result.nuances || null,
                timestamp: new Date().toISOString(),
            });

            console.log(`[Emotion] Sent ${result.dominantEmotion} (${Math.round(result.confidence * 100)}%) to ${targetUserId}`);
        } catch (error) {
            console.error('[Emotion] Analysis error:', error);

            // Send fallback response on error
            io.to(`user:${targetUserId}`).emit('call:emotion', {
                callId,
                fromUserId: userId,
                emotions: ['processing'],
                dominantEmotion: 'processing',
                text: 'Analyzing emotions...',
                confidence: 0,
                intensity: 0.5,
                nuances: null,
                timestamp: new Date().toISOString(),
            });
        }
    });

    // Get emotion history for a call
    socket.on('emotion:history', async ({ callId }: EmotionHistoryPayload) => {
        try {
            console.log(`[Emotion] Fetching history for call ${callId}`);

            const emotions = await CallServices.getCallEmotions(callId, userId);

            socket.emit('emotion:history', {
                callId,
                emotions: emotions.map((e) => ({
                    userId: e.userId,
                    dominantEmotion: e.dominantEmotion,
                    emotions: e.detectedEmotions,
                    confidence: e.confidence,
                    text: e.generatedText,
                    timestamp: e.timestamp,
                })),
            });
        } catch (error) {
            console.error('[Emotion] History error:', error);
            socket.emit('emotion:history', {
                callId,
                emotions: [],
                error: 'Failed to fetch emotion history',
            });
        }
    });

    // Request emotion summary for a call
    socket.on('emotion:summary', async ({ callId }: EmotionHistoryPayload) => {
        try {
            console.log(`[Emotion] Generating summary for call ${callId}`);

            const emotions = await CallServices.getCallEmotions(callId, userId);

            if (emotions.length === 0) {
                socket.emit('emotion:summary', {
                    callId,
                    summary: 'No emotions detected during this call.',
                    topEmotions: [],
                });
                return;
            }

            // Calculate emotion statistics
            const emotionCounts: Record<string, number> = {};
            for (const e of emotions) {
                const emotion = e.dominantEmotion;
                emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
            }

            // Sort by frequency
            const topEmotions = Object.entries(emotionCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([emotion, count]) => ({
                    emotion,
                    count,
                    percentage: Math.round((count / emotions.length) * 100),
                }));

            socket.emit('emotion:summary', {
                callId,
                totalAnalyzed: emotions.length,
                topEmotions,
                summary: `Most detected emotions: ${topEmotions.map((e) => e.emotion).join(', ')}`,
            });
        } catch (error) {
            console.error('[Emotion] Summary error:', error);
            socket.emit('emotion:summary', {
                callId,
                summary: 'Unable to generate summary.',
                topEmotions: [],
                error: 'Failed to generate emotion summary',
            });
        }
    });

    // Avatar suggestion event
    socket.on('avatar:request-suggestion', async ({ context, recipientId }: AvatarSuggestionPayload) => {
        try {
            console.log(`[Avatar] Requesting suggestion for ${userId}`);

            // Call Python AI service for avatar suggestion
            const result = await pythonAI.getAvatarSuggestion(userId, context, recipientId);

            const suggestion = result.suggestions?.[0] || {
                text: 'Based on your recent emotions, you might want to reach out...',
                emotion: 'caring',
                confidence: 0.75,
            };

            socket.emit('avatar:suggestion', {
                suggestions: result.suggestions || [suggestion],
                context,
            });
        } catch (error) {
            console.error('[Avatar] Suggestion error:', error);
            socket.emit('avatar:suggestion', {
                suggestions: [
                    {
                        text: "I'm here to help you communicate your feelings.",
                        emotion: 'supportive',
                        confidence: 0.5,
                    },
                ],
                context,
                error: 'Failed to generate suggestion',
            });
        }
    });
};
