"use client";

import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Smile,
  Settings,
  Maximize2,
  MessageSquare,
} from "lucide-react";

interface CallControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isEmotionEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleEmotion: () => void;
  onEndCall: () => void;
  onOpenChat?: () => void;
  onFullscreen?: () => void;
  onSettings?: () => void;
  disabled?: boolean;
}

export function CallControls({
  isVideoEnabled,
  isAudioEnabled,
  isEmotionEnabled,
  onToggleVideo,
  onToggleAudio,
  onToggleEmotion,
  onEndCall,
  onOpenChat,
  onFullscreen,
  onSettings,
  disabled = false,
}: CallControlsProps) {
  return (
    <div className="bg-slate-800/90 backdrop-blur-sm px-4 py-3 rounded-md">
      <div className="flex items-center justify-center gap-2">
        {/* Microphone */}
        <Button
          variant={isAudioEnabled ? "secondary" : "destructive"}
          size="icon"
          className="w-10 h-10 rounded-md"
          onClick={onToggleAudio}
          disabled={disabled}
          title={isAudioEnabled ? "Mute" : "Unmute"}
        >
          {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>

        {/* Camera */}
        <Button
          variant={isVideoEnabled ? "secondary" : "destructive"}
          size="icon"
          className="w-10 h-10 rounded-md"
          onClick={onToggleVideo}
          disabled={disabled}
          title={isVideoEnabled ? "Camera off" : "Camera on"}
        >
          {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </Button>

        {/* Emotion Detection */}
        <Button
          variant={isEmotionEnabled ? "primary" : "secondary"}
          size="icon"
          className="w-10 h-10 rounded-md"
          onClick={onToggleEmotion}
          disabled={disabled}
          title={isEmotionEnabled ? "Disable emotion" : "Enable emotion"}
        >
          <Smile className="w-4 h-4" />
        </Button>

        {/* Chat */}
        {onOpenChat && (
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-md"
            onClick={onOpenChat}
            disabled={disabled}
            title="Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        )}

        {/* Fullscreen */}
        {onFullscreen && (
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-md"
            onClick={onFullscreen}
            disabled={disabled}
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}

        {/* Settings */}
        {onSettings && (
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-md"
            onClick={onSettings}
            disabled={disabled}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}

        {/* End Call */}
        <Button
          variant="destructive"
          size="icon"
          className="w-12 h-10 rounded-md ml-2"
          onClick={onEndCall}
          title="End call"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default CallControls;
