"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface EmotionData {
  emotions: string[];
  dominantEmotion: string;
  confidence: number;
  intensity: number;
  text: string;
  nuances?: {
    eyeContact?: string;
    mouthExpression?: string;
    eyebrowPosition?: string;
    overallTension?: string;
  };
}

interface UseEmotionCaptureOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  captureInterval?: number; // ms between captures
  enabled?: boolean;
  onCapture?: (imageData: string) => void;
  onEmotionResult?: (data: EmotionData) => void;
}

interface UseEmotionCaptureReturn {
  isCapturing: boolean;
  latestEmotion: EmotionData | null;
  startCapture: () => void;
  stopCapture: () => void;
  captureFrame: () => string | null;
}

export function useEmotionCapture(
  options: UseEmotionCaptureOptions
): UseEmotionCaptureReturn {
  const { 
    videoRef, 
    captureInterval = 3000, 
    enabled = false,
    onCapture,
    onEmotionResult 
  } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState<EmotionData | null>(null);

  // Create canvas for frame capture
  useEffect(() => {
    canvasRef.current = document.createElement("canvas");
    return () => {
      canvasRef.current = null;
    };
  }, []);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      return null;
    }

    // Set canvas size to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 JPEG (more efficient than PNG)
    const imageData = canvas.toDataURL("image/jpeg", 0.8);

    return imageData;
  }, [videoRef]);

  const startCapture = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsCapturing(true);

    // Start periodic capture
    intervalRef.current = setInterval(() => {
      const frameData = captureFrame();
      if (frameData) {
        onCapture?.(frameData);
      }
    }, captureInterval);

    // Do an immediate capture
    const initialFrame = captureFrame();
    if (initialFrame) {
      onCapture?.(initialFrame);
    }
  }, [captureFrame, captureInterval, onCapture]);

  const stopCapture = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  // Handle enabled state changes
  useEffect(() => {
    if (enabled && videoRef.current) {
      startCapture();
    } else {
      stopCapture();
    }

    return () => {
      stopCapture();
    };
  }, [enabled, videoRef, startCapture, stopCapture]);

  // Update latest emotion when result received
  useEffect(() => {
    if (onEmotionResult) {
      // This effect allows parent to pass emotion results back
    }
  }, [onEmotionResult]);

  // Expose method to update emotion from external source
  const updateEmotion = useCallback((data: EmotionData) => {
    setLatestEmotion(data);
    onEmotionResult?.(data);
  }, [onEmotionResult]);

  return {
    isCapturing,
    latestEmotion,
    startCapture,
    stopCapture,
    captureFrame,
  };
}

export default useEmotionCapture;

