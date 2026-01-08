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
            // Allow localhost and any local network IP
            origin: (origin, callback) => {
                // Allow requests with no origin (mobile apps, curl, etc)
                if (!origin) return callback(null, true);
                
                // Allow localhost and local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
                const allowedPatterns = [
                    /^http:\/\/localhost(:\d+)?$/,
                    /^http:\/\/127\.0\.0\.1(:\d+)?$/,
                    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
                    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
                    /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/,
                ];
                
                if (allowedPatterns.some(pattern => pattern.test(origin))) {
                    return callback(null, true);
                }
                
                callback(new Error('Not allowed by CORS'));
            },
            credentials: true,
        },
    });

    // Authentication middleware
    io.use((socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication required'));
        }

        // For testing: if token is not a JWT, use it directly as userId
        // In production, always verify JWT tokens
        if (process.env.NODE_ENV === 'development' || !token.includes('.')) {
            // Simple token (for testing) - use token as userId
            socket.userId = token;
            return next();
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
