"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Peer, { Instance as PeerInstance, SignalData } from "simple-peer";

interface UseWebRTCOptions {
  localStream: MediaStream | null;
  onSignal?: (signal: SignalData) => void;
  onStream?: (stream: MediaStream) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

interface UseWebRTCReturn {
  peer: PeerInstance | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  isConnecting: boolean;
  createPeer: (initiator: boolean) => void;
  signal: (data: SignalData) => void;
  destroyPeer: () => void;
}

export function useWebRTC(options: UseWebRTCOptions): UseWebRTCReturn {
  const { localStream, onSignal, onStream, onError, onClose } = options;
  
  const peerRef = useRef<PeerInstance | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const destroyPeer = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setRemoteStream(null);
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const createPeer = useCallback((initiator: boolean) => {
    if (!localStream) {
      console.error("WebRTC: Cannot create peer without local stream");
      return;
    }

    // Clean up existing peer
    if (peerRef.current) {
      peerRef.current.destroy();
    }

    setIsConnecting(true);
    setIsConnected(false);

    const peer = new Peer({
      initiator,
      trickle: false,
      stream: localStream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (data: SignalData) => {
      console.log("WebRTC: Signal generated");
      onSignal?.(data);
    });

    peer.on("stream", (stream: MediaStream) => {
      console.log("WebRTC: Remote stream received");
      setRemoteStream(stream);
      onStream?.(stream);
    });

    peer.on("connect", () => {
      console.log("WebRTC: Connected");
      setIsConnected(true);
      setIsConnecting(false);
    });

    peer.on("close", () => {
      console.log("WebRTC: Connection closed");
      setIsConnected(false);
      setIsConnecting(false);
      onClose?.();
    });

    peer.on("error", (err: Error) => {
      console.error("WebRTC: Error -", err.message);
      setIsConnecting(false);
      onError?.(err);
    });

    peerRef.current = peer;
  }, [localStream, onSignal, onStream, onError, onClose]);

  const signal = useCallback((data: SignalData) => {
    if (peerRef.current && !peerRef.current.destroyed) {
      console.log("WebRTC: Signaling peer");
      peerRef.current.signal(data);
    } else {
      console.warn("WebRTC: Cannot signal, peer not ready");
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyPeer();
    };
  }, [destroyPeer]);

  return {
    peer: peerRef.current,
    remoteStream,
    isConnected,
    isConnecting,
    createPeer,
    signal,
    destroyPeer,
  };
}

export default useWebRTC;

