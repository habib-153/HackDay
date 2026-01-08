"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { VideoOff, User } from "lucide-react";

interface VideoStreamProps {
  stream: MediaStream | null;
  muted?: boolean;
  mirrored?: boolean;
  label?: string;
  avatar?: string;
  isVideoOff?: boolean;
  className?: string;
  showPlaceholder?: boolean;
}

export interface VideoStreamRef {
  videoElement: HTMLVideoElement | null;
}

export const VideoStream = forwardRef<VideoStreamRef, VideoStreamProps>(
  function VideoStream(
    {
      stream,
      muted = false,
      mirrored = false,
      label,
      avatar,
      isVideoOff = false,
      className = "",
      showPlaceholder = true,
    },
    ref
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => ({
      videoElement: videoRef.current,
    }));

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    const showVideo = stream && !isVideoOff;

    return (
      <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
        {showVideo ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className={`w-full h-full object-cover ${mirrored ? "scale-x-[-1]" : ""}`}
          />
        ) : showPlaceholder ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            {isVideoOff ? (
              <div className="flex flex-col items-center gap-2">
                {avatar ? (
                  <div className="w-16 h-16 rounded-md bg-slate-700 flex items-center justify-center text-white text-xl font-semibold">
                    {avatar}
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-md bg-slate-700 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="flex items-center gap-1 text-slate-400">
                  <VideoOff className="w-3 h-3" />
                  <span className="text-xs">Camera off</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-md bg-slate-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-slate-400 text-xs">Waiting for video...</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Label */}
        {label && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md">
            <span className="text-white text-xs font-medium">{label}</span>
          </div>
        )}
      </div>
    );
  }
);

export default VideoStream;
