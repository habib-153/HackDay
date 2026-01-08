import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';
import { callHandlers } from './callHandlers';
import { chatHandlers } from './chatHandlers';
import { emotionHandlers } from './emotionHandlers';

interface AuthenticatedSocket extends Socket {
    userId?: string;
}

let io: Server;

export const initializeSocket = (server: HTTPServer) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            credentials: true,
        },
    });

    // Authentication middleware
    io.use((socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication required'));
        }

        try {
            const decoded = jwt.verify(token, config.jwt_access_secret as string) as { userId: string };
            socket.userId = decoded.userId;
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
        const userId = socket.userId!;

        // Join user's personal room
        socket.join(`user:${userId}`);

        console.log(`User ${userId} connected`);

        // Register handlers
        callHandlers(io, socket, userId);
        chatHandlers(io, socket, userId);
        emotionHandlers(io, socket, userId);

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

export const emitToUser = (userId: string, event: string, data: unknown) => {
    io.to(`user:${userId}`).emit(event, data);
};
