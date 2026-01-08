"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Copy, Check, Wifi, Mic, MicOff, VideoOff, Phone, PhoneOff, Brain } from "lucide-react";
import { io, Socket } from "socket.io-client";
import SimplePeer, { Instance as PeerInstance, SignalData } from "simple-peer";

/**
 * COMPLETE VIDEO CALL TEST WITH:
 * - WebRTC peer-to-peer video streaming
 * - AI emotion recognition
 * - Bidirectional communication
 */

// ICE servers for WebRTC (STUN for NAT traversal)
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

interface EmotionData {
  dominantEmotion: string;
  emotions: string[];
  confidence: number;
  intensity: number;
  generatedText?: string;
  timestamp: number;
}

interface VideoCallInlineProps {
  userId: string;
  socketUrl: string;
  aiServiceUrl: string;
  contactId: string;
  contactName: string;
  onCallEnd: () => void;
}

function VideoCallInline({ userId, socketUrl, aiServiceUrl, contactId, contactName, onCallEnd }: VideoCallInlineProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<"idle" | "calling" | "incoming" | "connecting" | "active">("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCallFrom, setIncomingCallFrom] = useState<string | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [myEmotion, setMyEmotion] = useState<EmotionData | null>(null);
  const [peerEmotion, setPeerEmotion] = useState<EmotionData | null>(null);
  const [emotionEnabled, setEmotionEnabled] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const peerRef = useRef<PeerInstance | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const emotionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs to avoid stale closures in socket handlers
  const localStreamRef = useRef<MediaStream | null>(null);
  const callIdRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Keep refs in sync with state
  useEffect(() => { localStreamRef.current = localStream; }, [localStream]);
  useEffect(() => { callIdRef.current = callId; }, [callId]);
  useEffect(() => { socketRef.current = socket; }, [socket]);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-19), `[${time}] ${msg}`]);
    console.log(`[VideoCall] ${msg}`);
  }, []);

  // Socket connection with reconnection
  useEffect(() => {
    addLog(`Connecting to ${socketUrl}...`);
    
    const newSocket = io(socketUrl, {
      auth: { token: userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      addLog(`Connected as ${userId}`);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      addLog(`Disconnected: ${reason}`);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      addLog(`Connection error: ${err.message}`);
    });

    // Call signaling events
    newSocket.on("call:initiated", (data: { callId: string }) => {
      addLog(`Call initiated: ${data.callId}`);
      setCallId(data.callId);
      setStatus("calling");
    });

    newSocket.on("call:incoming", (data: { callId: string; callerId: string }) => {
      addLog(`Incoming call from: ${data.callerId}`);
      setCallId(data.callId);
      setIncomingCallFrom(data.callerId);
      setStatus("incoming");
    });

    newSocket.on("call:accepted", (data: { callId: string }) => {
      addLog(`Call accepted by peer, callId: ${data.callId}`);
      setCallId(data.callId);
      setStatus("connecting");
      
      // Caller initiates WebRTC immediately
      const stream = localStreamRef.current;
      addLog(`Stream check: ${stream ? 'available' : 'null'}, peer: ${peerRef.current ? 'exists' : 'null'}`);
      
      if (stream && !peerRef.current) {
        addLog(`Creating INITIATOR peer...`);
        createPeerConnection(true, newSocket, stream, data.callId);
      } else if (!stream) {
        addLog(`ERROR: No local stream available for WebRTC`);
      }
    });

    newSocket.on("call:started", (data: { callId: string }) => {
      addLog(`Call started, waiting for WebRTC signal...`);
      setStatus("connecting");
    });

    newSocket.on("call:rejected", () => {
      addLog(`Call rejected`);
      cleanupCall();
    });

    newSocket.on("call:ended", () => {
      addLog(`Call ended by peer`);
      cleanupCall();
    });

    // WebRTC signaling
    newSocket.on("webrtc:signal", (data: { signal: SignalData; from: string; callId?: string }) => {
      addLog(`Received signal from ${data.from}, type: ${data.signal?.type || 'candidate'}`);
      
      if (peerRef.current) {
        // Existing peer - just signal it
        addLog(`Forwarding signal to existing peer`);
        peerRef.current.signal(data.signal);
      } else {
        // No peer yet - create as receiver
        const stream = localStreamRef.current;
        const cid = data.callId || callIdRef.current;
        addLog(`Creating RECEIVER peer? stream=${!!stream}, callId=${cid}`);
        
        if (stream && cid) {
          createPeerConnection(false, newSocket, stream, cid, data.signal);
        } else {
          addLog(`ERROR: Cannot create peer - missing stream or callId`);
        }
      }
    });

    // Emotion events from peer
    newSocket.on("emotion:result", (data: { userId: string; emotion: EmotionData }) => {
      if (data.userId !== userId) {
        setPeerEmotion(data.emotion);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      cleanupCall();
    };
  }, [socketUrl, userId, addLog]);

  // Create WebRTC peer connection
  const createPeerConnection = useCallback((initiator: boolean, sock: Socket, stream: MediaStream, currentCallId: string, incomingSignal?: SignalData) => {
    if (peerRef.current) {
      addLog(`Peer already exists, destroying old one...`);
      peerRef.current.destroy();
    }

    addLog(`Creating ${initiator ? 'initiator' : 'receiver'} peer for call ${currentCallId}...`);

    const peer = new SimplePeer({
      initiator,
      trickle: true,
      stream,
      config: ICE_SERVERS,
    });

    peer.on("signal", (signal) => {
      addLog(`Sending signal (${signal.type || 'candidate'}) to ${contactId}`);
      sock.emit("webrtc:signal", { signal, to: contactId, callId: currentCallId });
    });

    peer.on("connect", () => {
      addLog(`WebRTC connected!`);
      setStatus("active");
      // Emotion analysis will be started by effect when status becomes "active"
    });

    peer.on("stream", (remoteStr) => {
      addLog(`Received remote stream`);
      setRemoteStream(remoteStr);
    });

    peer.on("error", (err) => {
      addLog(`Peer error: ${err.message}`);
    });

    peer.on("close", () => {
      addLog(`Peer connection closed`);
    });

    if (incomingSignal) {
      peer.signal(incomingSignal);
    }

    peerRef.current = peer;
  }, [contactId, addLog]);

  // Get camera access
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const isSecure = window.location.protocol === 'https:' || 
                       ['localhost', '127.0.0.1'].includes(window.location.hostname);
      
      setMediaError(isSecure 
        ? "Browser doesn't support camera access." 
        : "Camera requires HTTPS. Add this site to chrome://flags/#unsafely-treat-insecure-origin-as-secure"
      );
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        setMediaError(null);
        addLog("Camera access granted");
      })
      .catch(err => {
        setMediaError(`Camera error: ${err.message}`);
        addLog(`Camera error: ${err.message}`);
      });

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, [addLog]);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Emotion analysis
  const captureFrame = useCallback((): string | null => {
    const video = localVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = 320;
    canvas.height = 240;
    ctx.drawImage(video, 0, 0, 320, 240);
    return canvas.toDataURL("image/jpeg", 0.7);
  }, []);

  const analyzeEmotion = useCallback(async () => {
    const frame = captureFrame();
    const currentSocket = socketRef.current;
    const currentCallId = callIdRef.current;
    
    if (!frame || !currentSocket || !currentCallId) return;

    try {
      const response = await fetch(`${aiServiceUrl}/api/v1/emotion/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: frame,
          userId,
          callId: currentCallId,
          context: `Video call with ${contactName}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const emotionData: EmotionData = {
          dominantEmotion: data.dominantEmotion || "neutral",
          emotions: data.emotions || [],
          confidence: data.confidence || 0,
          intensity: data.intensity || 0.5,
          generatedText: data.generatedText,
          timestamp: Date.now(),
        };
        
        setMyEmotion(emotionData);
        
        // Broadcast to peer via call room
        currentSocket.emit("emotion:frame", {
          callId: currentCallId,
          userId,
          emotion: emotionData,
        });
      }
    } catch (err) {
      // Silent fail for emotion analysis
    }
  }, [captureFrame, aiServiceUrl, userId, contactName]);

  const startEmotionAnalysis = useCallback(() => {
    if (emotionIntervalRef.current) return;
    
    addLog("Starting emotion analysis...");
    emotionIntervalRef.current = setInterval(analyzeEmotion, 3000); // Every 3 seconds
  }, [analyzeEmotion, addLog]);

  const stopEmotionAnalysis = useCallback(() => {
    if (emotionIntervalRef.current) {
      clearInterval(emotionIntervalRef.current);
      emotionIntervalRef.current = null;
    }
  }, []);

  const cleanupCall = useCallback(() => {
    stopEmotionAnalysis();
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setRemoteStream(null);
    setStatus("idle");
    setCallId(null);
    setIncomingCallFrom(null);
    setMyEmotion(null);
    setPeerEmotion(null);
  }, [stopEmotionAnalysis]);

  // Start emotion analysis when call becomes active
  useEffect(() => {
    if (status === "active" && emotionEnabled) {
      startEmotionAnalysis();
    }
    return () => {
      if (status !== "active") {
        stopEmotionAnalysis();
      }
    };
  }, [status, emotionEnabled, startEmotionAnalysis, stopEmotionAnalysis]);

  // Call actions
  const startCall = () => {
    if (socket && isConnected) {
      addLog(`Calling ${contactId}...`);
      socket.emit("call:initiate", { recipientId: contactId });
    }
  };

  const acceptCall = () => {
    if (socket && callId && localStream) {
      addLog(`Accepting call...`);
      socket.emit("call:accept", { callId });
      setStatus("connecting");
      // Receiver waits for signal from caller
    }
  };

  const rejectCall = () => {
    if (socket && callId) {
      socket.emit("call:reject", { callId });
      cleanupCall();
    }
  };

  const endCall = () => {
    if (socket && callId) {
      socket.emit("call:end", { callId });
    }
    localStream?.getTracks().forEach(track => track.stop());
    cleanupCall();
    onCallEnd();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Status Bar */}
      <div className="bg-slate-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-white text-sm">
            {isConnected ? `Connected as ${userId}` : "Reconnecting..."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${
            status === "active" ? "bg-green-600 text-white" :
            status === "connecting" ? "bg-yellow-600 text-white" :
            "bg-slate-600 text-slate-300"
          }`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Media Error */}
      {mediaError && (
        <div className="bg-red-900/80 p-3 text-center">
          <p className="text-red-200 text-sm">{mediaError}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Remote Video (full screen) */}
        {status === "active" && remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Placeholder when no remote video */}
        {status === "active" && !remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl text-white">{contactName[0]?.toUpperCase()}</span>
              </div>
              <p className="text-white text-xl">{contactName}</p>
              <p className="text-slate-400 text-sm">Waiting for video...</p>
            </div>
          </div>
        )}

        {/* Idle/Calling/Incoming states */}
        {status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="text-white text-xl mb-2">Ready to Call</h2>
              <p className="text-slate-400 mb-6">Call {contactName}</p>
              <Button variant="primary" onClick={startCall} disabled={!isConnected || !localStream}>
                <Phone className="w-4 h-4 mr-2" />
                Start Call
              </Button>
            </div>
          </div>
        )}

        {status === "calling" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl text-white">{contactName[0]}</span>
              </div>
              <h2 className="text-white text-xl mb-2">Calling {contactName}...</h2>
              <p className="text-slate-400 mb-6">Waiting for answer</p>
              <Button variant="destructive" onClick={endCall}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {status === "incoming" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Phone className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-white text-xl mb-2">Incoming Call</h2>
              <p className="text-slate-400 mb-6">From {incomingCallFrom}</p>
              <div className="flex gap-4 justify-center">
                <Button variant="destructive" onClick={rejectCall}>
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button variant="primary" onClick={acceptCall} disabled={!localStream}>
                  <Phone className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )}

        {status === "connecting" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white">Establishing connection...</p>
            </div>
          </div>
        )}

        {/* Local Video (picture-in-picture) */}
        {localStream && (
          <div className="absolute top-4 right-4 w-40 h-30 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-slate-500" />
              </div>
            )}
            <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
              You
            </div>
          </div>
        )}

        {/* Emotion Overlays */}
        {status === "active" && emotionEnabled && (
          <>
            {/* My Emotion */}
            {myEmotion && (
              <div className="absolute bottom-24 right-4 bg-black/70 rounded-lg p-3 max-w-48">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-white text-sm font-medium">You</span>
                </div>
                <p className="text-primary text-lg capitalize">{myEmotion.dominantEmotion}</p>
                <p className="text-slate-300 text-xs">{Math.round(myEmotion.confidence * 100)}% confident</p>
                {myEmotion.generatedText && (
                  <p className="text-slate-400 text-xs mt-1 italic">&quot;{myEmotion.generatedText}&quot;</p>
                )}
              </div>
            )}

            {/* Peer Emotion */}
            {peerEmotion && (
              <div className="absolute bottom-24 left-4 bg-black/70 rounded-lg p-3 max-w-48">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm font-medium">{contactName}</span>
                </div>
                <p className="text-green-400 text-lg capitalize">{peerEmotion.dominantEmotion}</p>
                <p className="text-slate-300 text-xs">{Math.round(peerEmotion.confidence * 100)}% confident</p>
                {peerEmotion.generatedText && (
                  <p className="text-slate-400 text-xs mt-1 italic">&quot;{peerEmotion.generatedText}&quot;</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      {status === "active" && (
        <div className="bg-slate-800/90 p-4 flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="icon"
            onClick={toggleMute}
            className="w-12 h-12 rounded-full"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            variant={isVideoOff ? "destructive" : "outline"}
            size="icon"
            onClick={toggleVideo}
            className="w-12 h-12 rounded-full"
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button>

          <Button
            variant={emotionEnabled ? "primary" : "outline"}
            size="icon"
            onClick={() => {
              setEmotionEnabled(!emotionEnabled);
              if (emotionEnabled) stopEmotionAnalysis();
              else startEmotionAnalysis();
            }}
            className="w-12 h-12 rounded-full"
            title="Toggle AI Emotion Analysis"
          >
            <Brain className="w-5 h-5" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={endCall}
            className="w-14 h-14 rounded-full"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Debug Log */}
      <div className="bg-black/80 p-2 max-h-32 overflow-y-auto">
        <p className="text-slate-500 text-xs mb-1">Debug Log:</p>
        {logs.map((log, i) => (
          <p key={i} className="text-slate-400 text-xs font-mono">{log}</p>
        ))}
      </div>
    </div>
  );
}

export default function TestCallPage() {
  const [serverIp, setServerIp] = useState("");
  const [userId, setUserId] = useState("");
  const [contactId, setContactId] = useState("");
  const [isInCall, setIsInCall] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      setServerIp(hostname);
    }
  }, []);

  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socketUrl = serverIp ? `http://${serverIp}:5000` : "http://localhost:5000";
  const aiServiceUrl = serverIp ? `http://${serverIp}:8000` : "http://localhost:8000";

  if (isInCall && userId && contactId) {
    return (
      <VideoCallInline
        userId={userId}
        socketUrl={socketUrl}
        aiServiceUrl={aiServiceUrl}
        contactId={contactId}
        contactName={contactId}
        onCallEnd={() => setIsInCall(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">HeartSpeak Video Call Test</h1>
          <p className="text-slate-500">WebRTC + AI Emotion Recognition</p>
        </div>

        {/* HTTPS Warning */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ Secure Context Required</h3>
            <p className="text-sm text-amber-800 mb-2">
              Camera access requires HTTPS or localhost. For HTTP testing:
            </p>
            <code className="block text-xs bg-amber-100 p-2 rounded">
              chrome://flags/#unsafely-treat-insecure-origin-as-secure
            </code>
            <p className="text-xs text-amber-700 mt-2">
              Add: http://{serverIp || 'YOUR_IP'}:3000, http://{serverIp || 'YOUR_IP'}:5000, http://{serverIp || 'YOUR_IP'}:8000
            </p>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-900">Setup Instructions</h3>
            </div>
            <div className="text-sm text-emerald-800 space-y-2">
              <p><strong>Server Computer:</strong></p>
              <ol className="list-decimal list-inside ml-2 space-y-1">
                <li>Start MongoDB: <code className="bg-emerald-200 px-1 rounded">mongod</code></li>
                <li>Start Backend: <code className="bg-emerald-200 px-1 rounded">cd Server && npm run dev</code></li>
                <li>Start AI Service: <code className="bg-emerald-200 px-1 rounded">cd AI-Service && uvicorn app.main:app --host 0.0.0.0 --port 8000</code></li>
                <li>Start Frontend: <code className="bg-emerald-200 px-1 rounded">cd client && npm run dev -- -H 0.0.0.0</code></li>
                <li>Get IP: <code className="bg-emerald-200 px-1 rounded">hostname -I</code></li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Setup Form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Server IP</label>
              <Input
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                placeholder="e.g., 192.168.1.100 (empty = localhost)"
              />
              <div className="text-xs text-slate-500 mt-1 space-y-1">
                <p>Socket: <code className="bg-slate-100 px-1 rounded">{socketUrl}</code></p>
                <p>AI: <code className="bg-slate-100 px-1 rounded">{aiServiceUrl}</code></p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your User ID</label>
              <div className="flex gap-2">
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., alice"
                  className="flex-1"
                />
                {userId && (
                  <Button variant="outline" size="icon" onClick={copyUserId}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact ID (other person)</label>
              <Input
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                placeholder="e.g., bob"
              />
            </div>

            <Button
              variant="primary"
              className="w-full"
              disabled={!userId || !contactId}
              onClick={() => setIsInCall(true)}
            >
              <Video className="w-4 h-4 mr-2" />
              Enter Call Room
            </Button>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-slate-900 mb-3">Quick Test Setup</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="font-medium text-blue-900">Computer 1</p>
                <p className="text-blue-700">User: <code>alice</code></p>
                <p className="text-blue-700">Contact: <code>bob</code></p>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <p className="font-medium text-green-900">Computer 2</p>
                <p className="text-green-700">User: <code>bob</code></p>
                <p className="text-green-700">Contact: <code>alice</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
