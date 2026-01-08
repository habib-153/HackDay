"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { SignalData } from "simple-peer";
import { Clock } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useMediaStream } from "@/hooks/useMediaStream";
import { useCallStore, EmotionData } from "@/store/callStore";

import { VideoStream, VideoStreamRef } from "./VideoStream";
import { CallControls } from "./CallControls";
import { EmotionOverlay, EmotionTranslation } from "./EmotionOverlay";
import { IncomingCallModal } from "./IncomingCallModal";

interface VideoCallProps {
  userId: string;
  token: string;
  contactId?: string;
  contactName?: string;
  contactAvatar?: string;
  autoCall?: boolean;
  onCallEnd?: () => void;
}

export function VideoCall({
  userId,
  token,
  contactId,
  contactName,
  contactAvatar,
  autoCall = false,
  onCallEnd,
}: VideoCallProps) {
  const localVideoRef = useRef<VideoStreamRef>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [isEmotionVisible, setIsEmotionVisible] = useState(true);
  
  const {
    callId,
    status,
    isInitiator,
    remoteUserId,
    remoteUserName,
    isVideoEnabled,
    isAudioEnabled,
    isEmotionEnabled,
    remoteEmotion,
    incomingCall,
    pendingSignal,
    duration,
    setCallId,
    setStatus,
    setIsInitiator,
    setLocalUserId,
    setRemoteUser,
    setVideoEnabled,
    setAudioEnabled,
    setEmotionEnabled,
    setRemoteEmotion,
    setIncomingCall,
    setPendingSignal,
    startCall,
    updateDuration,
    resetCall,
  } = useCallStore();

  // Initialize media stream
  const {
    stream: localStream,
    isLoading: isMediaLoading,
    error: mediaError,
    startStream,
    stopStream,
    toggleVideo,
    toggleAudio,
    isVideoEnabled: localVideoEnabled,
    isAudioEnabled: localAudioEnabled,
  } = useMediaStream({ autoStart: true });

  // Socket connection
  const { isConnected, connect, emit, on, off } = useSocket({
    autoConnect: true,
    token,
  });

  // Handle WebRTC signaling
  const handleSignal = useCallback(
    (signal: SignalData) => {
      if (callId && remoteUserId) {
        emit("call:signal", {
          callId,
          signal,
          targetUserId: remoteUserId,
        });
      }
    },
    [callId, remoteUserId, emit]
  );

  const handleRemoteStream = useCallback((stream: MediaStream) => {
    console.log("Remote stream received");
  }, []);

  const handlePeerClose = useCallback(() => {
    console.log("Peer connection closed");
    setStatus("ended");
  }, [setStatus]);

  // WebRTC hook
  const {
    remoteStream,
    isConnected: isPeerConnected,
    isConnecting: isPeerConnecting,
    createPeer,
    signal: signalPeer,
    destroyPeer,
  } = useWebRTC({
    localStream,
    onSignal: handleSignal,
    onStream: handleRemoteStream,
    onClose: handlePeerClose,
  });

  // Set local user ID
  useEffect(() => {
    setLocalUserId(userId);
  }, [userId, setLocalUserId]);

  // Connect socket when token available
  useEffect(() => {
    if (token && !isConnected) {
      connect();
    }
  }, [token, isConnected, connect]);

  // Socket event handlers
  useEffect(() => {
    if (!isConnected) return;

    // Incoming call
    const handleIncomingCall = (data: { callId: string; callerId: string }) => {
      console.log("Incoming call:", data);
      setIncomingCall({
        callId: data.callId,
        callerId: data.callerId,
        callerName: contactName,
      });
    };

    // Call initiated confirmation
    const handleCallInitiated = (data: { callId: string }) => {
      console.log("Call initiated:", data.callId);
      setCallId(data.callId);
      setStatus("calling");
    };

    // Call accepted
    const handleCallAccepted = (data: { callId: string }) => {
      console.log("Call accepted:", data.callId);
      setStatus("active");
      startCall();
      // Initiator creates the peer connection
      if (isInitiator && localStream) {
        createPeer(true);
      }
    };

    // Call started (for recipient)
    const handleCallStarted = (data: { callId: string }) => {
      console.log("Call started:", data.callId);
      setStatus("active");
      startCall();
    };

    // Call rejected
    const handleCallRejected = (data: { callId: string }) => {
      console.log("Call rejected:", data.callId);
      setStatus("ended");
      resetCall();
      onCallEnd?.();
    };

    // Call ended
    const handleCallEnded = (data: { callId: string }) => {
      console.log("Call ended:", data.callId);
      setStatus("ended");
      destroyPeer();
      onCallEnd?.();
    };

    // WebRTC signal
    const handleSignalData = (data: {
      callId: string;
      signal: SignalData;
      fromUserId: string;
    }) => {
      console.log("Received signal from:", data.fromUserId);
      
      if (!isPeerConnected && !isPeerConnecting) {
        // Non-initiator creates peer and signals
        createPeer(false);
        setPendingSignal(data.signal);
      } else {
        signalPeer(data.signal);
      }
    };

    // Emotion analysis result
    const handleEmotionResult = (data: {
      callId: string;
      fromUserId: string;
      emotions: string[];
      dominantEmotion: string;
      text: string;
      confidence: number;
      intensity?: number;
      nuances?: EmotionData["nuances"];
    }) => {
      console.log("Emotion received:", data.dominantEmotion);
      setRemoteEmotion({
        emotions: data.emotions,
        dominantEmotion: data.dominantEmotion,
        confidence: data.confidence,
        intensity: data.intensity || 0.5,
        text: data.text,
        nuances: data.nuances,
        timestamp: new Date(),
      });
    };

    // Call error
    const handleCallError = (data: { message: string }) => {
      console.error("Call error:", data.message);
    };

    // Register listeners
    on("call:incoming", handleIncomingCall);
    on("call:initiated", handleCallInitiated);
    on("call:accepted", handleCallAccepted);
    on("call:started", handleCallStarted);
    on("call:rejected", handleCallRejected);
    on("call:ended", handleCallEnded);
    on("call:signal", handleSignalData);
    on("call:emotion", handleEmotionResult);
    on("call:error", handleCallError);

    return () => {
      off("call:incoming");
      off("call:initiated");
      off("call:accepted");
      off("call:started");
      off("call:rejected");
      off("call:ended");
      off("call:signal");
      off("call:emotion");
      off("call:error");
    };
  }, [
    isConnected,
    isInitiator,
    localStream,
    isPeerConnected,
    isPeerConnecting,
    on,
    off,
    emit,
    setCallId,
    setStatus,
    setIncomingCall,
    setPendingSignal,
    setRemoteEmotion,
    startCall,
    resetCall,
    createPeer,
    signalPeer,
    destroyPeer,
    onCallEnd,
    contactName,
  ]);

  // Signal pending signal when peer is ready
  useEffect(() => {
    if (pendingSignal && isPeerConnecting) {
      setTimeout(() => {
        signalPeer(pendingSignal);
        setPendingSignal(null);
      }, 100);
    }
  }, [pendingSignal, isPeerConnecting, signalPeer, setPendingSignal]);

  // Auto-call on mount if requested
  useEffect(() => {
    if (autoCall && contactId && isConnected && status === "idle") {
      initiateCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCall, contactId, isConnected, status]);

  // Duration timer
  useEffect(() => {
    if (status === "active") {
      durationIntervalRef.current = setInterval(updateDuration, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [status, updateDuration]);

  // Frame capture for emotion analysis
  useEffect(() => {
    if (status !== "active" || !isEmotionEnabled || !localStream) {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
      return;
    }

    // Create canvas if needed
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const captureAndSendFrame = () => {
      const videoElement = localVideoRef.current?.videoElement;
      const canvas = canvasRef.current;

      if (!videoElement || !canvas || videoElement.readyState < 2) return;

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(videoElement, 0, 0);
      const frameData = canvas.toDataURL("image/jpeg", 0.7);

      // Send frame for emotion analysis
      emit("emotion:frame", {
        callId,
        frameData,
        targetUserId: remoteUserId,
      });
    };

    // Capture every 3 seconds
    captureIntervalRef.current = setInterval(captureAndSendFrame, 3000);
    // Initial capture
    setTimeout(captureAndSendFrame, 1000);

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, [status, isEmotionEnabled, localStream, callId, remoteUserId, emit]);

  // Initiate a call
  const initiateCall = useCallback(() => {
    if (!contactId || !isConnected) return;

    setIsInitiator(true);
    setRemoteUser(contactId, contactName);
    setStatus("calling");

    emit("call:initiate", { recipientId: contactId });
  }, [contactId, contactName, isConnected, emit, setIsInitiator, setRemoteUser, setStatus]);

  // Accept incoming call
  const acceptCall = useCallback(() => {
    if (!incomingCall) return;

    setCallId(incomingCall.callId);
    setRemoteUser(incomingCall.callerId, incomingCall.callerName);
    setIsInitiator(false);
    setIncomingCall(null);

    emit("call:accept", { callId: incomingCall.callId });
  }, [incomingCall, emit, setCallId, setRemoteUser, setIsInitiator, setIncomingCall]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (!incomingCall) return;

    emit("call:reject", { callId: incomingCall.callId });
    setIncomingCall(null);
  }, [incomingCall, emit, setIncomingCall]);

  // End call
  const endCall = useCallback(() => {
    if (callId) {
      emit("call:end", { callId });
    }
    destroyPeer();
    stopStream();
    resetCall();
    onCallEnd?.();
  }, [callId, emit, destroyPeer, stopStream, resetCall, onCallEnd]);

  // Handle video toggle
  const handleToggleVideo = useCallback(() => {
    toggleVideo();
    setVideoEnabled(!localVideoEnabled);
  }, [toggleVideo, localVideoEnabled, setVideoEnabled]);

  // Handle audio toggle
  const handleToggleAudio = useCallback(() => {
    toggleAudio();
    setAudioEnabled(!localAudioEnabled);
  }, [toggleAudio, localAudioEnabled, setAudioEnabled]);

  // Handle emotion toggle
  const handleToggleEmotion = useCallback(() => {
    setEmotionEnabled(!isEmotionEnabled);
    setIsEmotionVisible(!isEmotionEnabled);
  }, [isEmotionEnabled, setEmotionEnabled]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (isMediaLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-coral border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Setting up camera...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (mediaError) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">Camera access denied</p>
          <p className="text-white/60 text-sm mb-4">
            Please allow camera and microphone access to make video calls.
          </p>
          <button
            onClick={startStream}
            className="px-4 py-2 bg-coral text-white rounded-lg hover:bg-coral/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* Main Remote Video */}
      <div className="absolute inset-0">
        {status === "active" ? (
          <VideoStream
            stream={remoteStream}
            label={remoteUserName || "Remote"}
            avatar={contactAvatar}
            isVideoOff={!remoteStream}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {status === "calling" && (
                <>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-coral to-peach flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {contactAvatar || contactName?.[0] || "?"}
                  </div>
                  <p className="text-white text-lg font-medium mb-2">
                    {contactName || "Calling..."}
                  </p>
                  <p className="text-white/60 text-sm">Connecting...</p>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex justify-center gap-1 mt-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-coral" />
                    <div className="w-2 h-2 rounded-full bg-coral" />
                    <div className="w-2 h-2 rounded-full bg-coral" />
                  </motion.div>
                </>
              )}
              
              {status === "idle" && contactId && (
                <>
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white/50 text-3xl">📹</span>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-2">Ready to Call</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Click the button below to start a video call
                  </p>
                  <button
                    onClick={initiateCall}
                    className="px-6 py-3 bg-gradient-to-r from-coral to-peach text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Start Call
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-4 right-4 w-40 h-32 rounded-xl overflow-hidden shadow-xl border-2 border-white/20"
      >
        <VideoStream
          ref={localVideoRef}
          stream={localStream}
          muted
          mirrored
          label="You"
          isVideoOff={!localVideoEnabled}
          className="w-full h-full"
        />
      </motion.div>

      {/* Call Duration */}
      {status === "active" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{formatDuration(duration)}</span>
          </div>
        </div>
      )}

      {/* Emotion Overlay - Remote User's Emotions */}
      <EmotionOverlay
        emotion={remoteEmotion}
        isVisible={isEmotionVisible && status === "active"}
        position="top-left"
        showDetails={true}
      />

      {/* Emotion Translation */}
      <EmotionTranslation
        text={remoteEmotion?.text || ""}
        isVisible={isEmotionVisible && status === "active" && !!remoteEmotion?.text}
      />

      {/* Call Controls */}
      {(status === "active" || status === "calling") && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <CallControls
            isVideoEnabled={localVideoEnabled}
            isAudioEnabled={localAudioEnabled}
            isEmotionEnabled={isEmotionEnabled}
            onToggleVideo={handleToggleVideo}
            onToggleAudio={handleToggleAudio}
            onToggleEmotion={handleToggleEmotion}
            onEndCall={endCall}
          />
        </div>
      )}

      {/* Incoming Call Modal */}
      <IncomingCallModal
        isOpen={!!incomingCall}
        callerName={incomingCall?.callerName || "Unknown"}
        callerAvatar={contactAvatar}
        onAccept={acceptCall}
        onReject={rejectCall}
      />
    </div>
  );
}

export default VideoCall;

