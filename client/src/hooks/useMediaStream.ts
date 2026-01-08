"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseMediaStreamOptions {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
  autoStart?: boolean;
}

interface UseMediaStreamReturn {
  stream: MediaStream | null;
  isLoading: boolean;
  error: Error | null;
  hasPermission: boolean;
  startStream: () => Promise<void>;
  stopStream: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export function useMediaStream(
  options: UseMediaStreamOptions = {}
): UseMediaStreamReturn {
  const {
    video = { facingMode: "user", width: 1280, height: 720 },
    audio = true,
    autoStart = false,
  } = options;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  const streamRef = useRef<MediaStream | null>(null);

  const startStream = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermission(true);
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to get media stream");
      setError(error);
      setHasPermission(false);
      console.error("Media stream error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [video, audio]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(videoTracks[0]?.enabled ?? false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(audioTracks[0]?.enabled ?? false);
    }
  }, []);

  // Auto-start stream if requested
  useEffect(() => {
    if (autoStart) {
      startStream();
    }

    // Cleanup on unmount
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return {
    stream,
    isLoading,
    error,
    hasPermission,
    startStream,
    stopStream,
    toggleVideo,
    toggleAudio,
    isVideoEnabled,
    isAudioEnabled,
  };
}

export default useMediaStream;

