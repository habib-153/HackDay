import config from '../config';

// Default ICE servers configuration for WebRTC
export const iceServersConfig = {
    // Use these free STUN servers for NAT traversal
    iceServers: [
        // Google's free STUN servers
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        
        // OpenRelay TURN servers (free tier)
        // For production, you should use your own TURN server or a paid service
        // like Twilio, Xirsys, or Daily.co
    ],
    iceCandidatePoolSize: 10,
};

// If TURN credentials are provided in environment, add TURN server
if (process.env.TURN_SERVER_URL && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    iceServersConfig.iceServers.push({
        urls: process.env.TURN_SERVER_URL,
        username: process.env.TURN_USERNAME,
        credential: process.env.TURN_CREDENTIAL,
    } as RTCIceServer);
}

// Get ICE servers configuration
export const getIceServers = () => {
    return iceServersConfig;
};

// Daily.co integration for production-ready video calls
export const getDailyConfig = () => {
    if (!config.daily_api_key) {
        return null;
    }
    
    return {
        apiKey: config.daily_api_key,
        // Daily.co provides built-in TURN servers and handles all WebRTC complexity
    };
};
