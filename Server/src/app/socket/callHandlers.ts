import { Server, Socket } from 'socket.io';
import { CallServices } from '../modules/Call/call.service';

interface CallInitiatePayload {
    recipientId: string;
}

interface CallPayload {
    callId: string;
}

interface CallSignalPayload {
    callId: string;
    signal: unknown;
    targetUserId: string;
}

export const callHandlers = (io: Server, socket: Socket, userId: string) => {
    // Join user's personal room for targeted messages
    socket.join(`user:${userId}`);

    // Initiate a call
    socket.on('call:initiate', async ({ recipientId }: CallInitiatePayload) => {
        try {
            console.log(`[Call] User ${userId} initiating call to ${recipientId}`);

            // Create call session
            const call = await CallServices.initiateCall(userId, recipientId);

            // Join call room
            socket.join(`call:${call._id}`);

            // Notify recipient of incoming call
            io.to(`user:${recipientId}`).emit('call:incoming', {
                callId: call._id.toString(),
                callerId: userId,
            });

            // Confirm to caller
            socket.emit('call:initiated', {
                callId: call._id.toString(),
            });

            console.log(`[Call] Call ${call._id} initiated by ${userId}`);
        } catch (error) {
            console.error('[Call] Failed to initiate call:', error);
            socket.emit('call:error', {
                message: 'Failed to initiate call',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // Accept a call
    socket.on('call:accept', async ({ callId }: CallPayload) => {
        try {
            console.log(`[Call] User ${userId} accepting call ${callId}`);

            const call = await CallServices.joinCall(callId, userId);
            const otherUserId = call.participants.find((p) => p !== userId);

            // Join call room
            socket.join(`call:${callId}`);

            // Notify caller that call was accepted
            io.to(`user:${otherUserId}`).emit('call:accepted', {
                callId,
                acceptedBy: userId,
            });

            // Notify acceptor that call started
            socket.emit('call:started', {
                callId,
                participants: call.participants,
            });

            console.log(`[Call] Call ${callId} accepted, both parties notified`);
        } catch (error) {
            console.error('[Call] Failed to accept call:', error);
            socket.emit('call:error', {
                message: 'Failed to accept call',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // Reject a call
    socket.on('call:reject', async ({ callId }: CallPayload) => {
        try {
            console.log(`[Call] User ${userId} rejecting call ${callId}`);

            const call = await CallServices.endCall(callId, userId);
            const otherUserId = call.participants.find((p) => p !== userId);

            // Notify caller that call was rejected
            io.to(`user:${otherUserId}`).emit('call:rejected', {
                callId,
                rejectedBy: userId,
            });

            // Leave call room
            socket.leave(`call:${callId}`);

            console.log(`[Call] Call ${callId} rejected by ${userId}`);
        } catch (error) {
            console.error('[Call] Failed to reject call:', error);
            socket.emit('call:error', {
                message: 'Failed to reject call',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // WebRTC signaling - forward signal to target user
    socket.on('call:signal', ({ callId, signal, targetUserId }: CallSignalPayload) => {
        console.log(`[Call] Signal from ${userId} to ${targetUserId} for call ${callId}`);

        io.to(`user:${targetUserId}`).emit('call:signal', {
            callId,
            signal,
            fromUserId: userId,
        });
    });

    // WebRTC signaling (simple-peer format) - forward signal to target user
    socket.on('webrtc:signal', ({ signal, to, callId }: { signal: unknown; to: string; callId: string }) => {
        console.log(`[WebRTC] Signal from ${userId} to ${to} for call ${callId}`);

        io.to(`user:${to}`).emit('webrtc:signal', {
            signal,
            from: userId,
            callId,
        });
    });

    // End a call
    socket.on('call:end', async ({ callId }: CallPayload) => {
        try {
            console.log(`[Call] User ${userId} ending call ${callId}`);

            const call = await CallServices.endCall(callId, userId);
            const otherUserId = call.participants.find((p) => p !== userId);

            // Notify both parties
            io.to(`user:${otherUserId}`).emit('call:ended', {
                callId,
                endedBy: userId,
                duration: call.duration,
            });
            socket.emit('call:ended', {
                callId,
                endedBy: userId,
                duration: call.duration,
            });

            // Leave call room
            socket.leave(`call:${callId}`);

            console.log(`[Call] Call ${callId} ended, duration: ${call.duration}s`);
        } catch (error) {
            console.error('[Call] Failed to end call:', error);
            socket.emit('call:error', {
                message: 'Failed to end call',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });

    // Handle ICE candidate (for progressive WebRTC connection)
    socket.on(
        'call:ice-candidate',
        ({ callId, candidate, targetUserId }: { callId: string; candidate: unknown; targetUserId: string }) => {
            io.to(`user:${targetUserId}`).emit('call:ice-candidate', {
                callId,
                candidate,
                fromUserId: userId,
            });
        },
    );

    // Handle disconnect - cleanup active calls
    socket.on('disconnect', async () => {
        console.log(`[Call] User ${userId} disconnected`);
        // Note: Call cleanup could be handled here if needed
        // For now, the other participant will detect the disconnect via WebRTC
    });
};
