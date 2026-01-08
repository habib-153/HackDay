import { Server, Socket } from 'socket.io';
import { CallServices } from '../modules/Call/call.service';

export const callHandlers = (io: Server, socket: Socket, userId: string) => {
    // Initiate a call
    socket.on('call:initiate', async ({ recipientId }: { recipientId: string }) => {
        try {
            const call = await CallServices.initiateCall(userId, recipientId);

            // Notify recipient
            io.to(`user:${recipientId}`).emit('call:incoming', {
                callId: call._id,
                callerId: userId,
            });

            // Confirm to caller
            socket.emit('call:initiated', { callId: call._id });
        } catch (error) {
            socket.emit('call:error', { message: 'Failed to initiate call' });
        }
    });

    // Accept a call
    socket.on('call:accept', async ({ callId }: { callId: string }) => {
        try {
            const call = await CallServices.joinCall(callId, userId);
            const otherUserId = call.participants.find((p) => p !== userId);

            // Notify both parties
            io.to(`user:${otherUserId}`).emit('call:accepted', { callId });
            socket.emit('call:started', { callId });
        } catch (error) {
            socket.emit('call:error', { message: 'Failed to accept call' });
        }
    });

    // Reject a call
    socket.on('call:reject', async ({ callId }: { callId: string }) => {
        try {
            const call = await CallServices.endCall(callId, userId);
            const otherUserId = call.participants.find((p) => p !== userId);

            io.to(`user:${otherUserId}`).emit('call:rejected', { callId });
        } catch (error) {
            socket.emit('call:error', { message: 'Failed to reject call' });
        }
    });

    // WebRTC signaling
    socket.on('call:signal', ({ callId, signal, targetUserId }: { callId: string; signal: unknown; targetUserId: string }) => {
        io.to(`user:${targetUserId}`).emit('call:signal', {
            callId,
            signal,
            fromUserId: userId,
        });
    });

    // End a call
    socket.on('call:end', async ({ callId }: { callId: string }) => {
        try {
            const call = await CallServices.endCall(callId, userId);
            const otherUserId = call.participants.find((p) => p !== userId);

            io.to(`user:${otherUserId}`).emit('call:ended', { callId });
            socket.emit('call:ended', { callId });
        } catch (error) {
            socket.emit('call:error', { message: 'Failed to end call' });
        }
    });
};
