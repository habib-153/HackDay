import { Server, Socket } from 'socket.io';

export const chatHandlers = (io: Server, socket: Socket, userId: string) => {
    // Join a conversation room
    socket.on('chat:join', ({ conversationId }: { conversationId: string }) => {
        socket.join(`conversation:${conversationId}`);
    });

    // Leave a conversation room
    socket.on('chat:leave', ({ conversationId }: { conversationId: string }) => {
        socket.leave(`conversation:${conversationId}`);
    });

    // Typing indicator
    socket.on('chat:typing', ({ conversationId }: { conversationId: string }) => {
        socket.to(`conversation:${conversationId}`).emit('chat:typing', {
            conversationId,
            userId,
        });
    });

    // Stop typing indicator
    socket.on('chat:stop-typing', ({ conversationId }: { conversationId: string }) => {
        socket.to(`conversation:${conversationId}`).emit('chat:stop-typing', {
            conversationId,
            userId,
        });
    });

    // Message reaction (for real-time updates)
    socket.on('chat:reaction', ({ messageId, conversationId, reaction }: {
        messageId: string;
        conversationId: string;
        reaction: { resonated: boolean; reactionEmoji?: string }
    }) => {
        socket.to(`conversation:${conversationId}`).emit('chat:reaction', {
            messageId,
            userId,
            reaction,
        });
    });
};

// Helper to emit new message to conversation
export const emitNewMessage = (io: Server, conversationId: string, message: unknown) => {
    io.to(`conversation:${conversationId}`).emit('chat:message', message);
};
