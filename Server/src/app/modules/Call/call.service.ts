import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TEmotionLog } from './call.interface';
import { CallSession } from './call.model';
import { EmotionLog } from './emotionLog.model';

const initiateCall = async (initiatorId: string, recipientId: string) => {
    const callSession = await CallSession.create({
        participants: [initiatorId, recipientId],
        initiatorId,
        status: 'pending',
    });

    return callSession;
};

const joinCall = async (callId: string, userId: string) => {
    const call = await CallSession.findById(callId);

    if (!call) {
        throw new AppError(httpStatus.NOT_FOUND, 'Call not found!');
    }

    if (!call.participants.includes(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not a participant of this call!');
    }

    if (call.status !== 'pending') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Call is not in pending state!');
    }

    call.status = 'active';
    call.startedAt = new Date();
    await call.save();

    return call;
};

const endCall = async (callId: string, userId: string) => {
    const call = await CallSession.findById(callId);

    if (!call) {
        throw new AppError(httpStatus.NOT_FOUND, 'Call not found!');
    }

    if (!call.participants.includes(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not a participant of this call!');
    }

    call.status = 'ended';
    call.endedAt = new Date();

    if (call.startedAt) {
        call.duration = Math.floor((call.endedAt.getTime() - call.startedAt.getTime()) / 1000);
    }

    await call.save();

    return call;
};

const getCallHistory = async (userId: string, limit = 20) => {
    const calls = await CallSession.find({
        participants: userId,
        status: { $in: ['ended', 'missed'] },
    })
        .sort({ createdAt: -1 })
        .limit(limit);

    return calls;
};

const logEmotion = async (callId: string, userId: string, emotionData: Partial<TEmotionLog>) => {
    const call = await CallSession.findById(callId);

    if (!call || call.status !== 'active') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Call is not active!');
    }

    const emotionLog = await EmotionLog.create({
        ...emotionData,
        callId,
        userId,
        timestamp: new Date(),
    });

    return emotionLog;
};

const getCallEmotions = async (callId: string, userId: string) => {
    const call = await CallSession.findById(callId);

    if (!call || !call.participants.includes(userId)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied!');
    }

    const emotions = await EmotionLog.find({ callId }).sort({ timestamp: 1 });

    return emotions;
};

export const CallServices = {
    initiateCall,
    joinCall,
    endCall,
    getCallHistory,
    logEmotion,
    getCallEmotions,
};
