"use client";

import { create } from "zustand";
import { SignalData } from "simple-peer";

export interface EmotionData {
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
  timestamp: Date;
}

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "busy";
  lastCall?: string;
}

export interface IncomingCall {
  callId: string;
  callerId: string;
  callerName?: string;
}

interface CallState {
  // Call status
  callId: string | null;
  status: "idle" | "calling" | "ringing" | "active" | "ended";
  isInitiator: boolean;
  
  // Participants
  localUserId: string | null;
  remoteUserId: string | null;
  remoteUserName: string | null;
  
  // Media state
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isEmotionEnabled: boolean;
  
  // Emotion data
  localEmotion: EmotionData | null;
  remoteEmotion: EmotionData | null;
  emotionHistory: EmotionData[];
  
  // Incoming call
  incomingCall: IncomingCall | null;
  
  // Signaling
  pendingSignal: SignalData | null;
  
  // Duration
  startTime: Date | null;
  duration: number;
  
  // Actions
  setCallId: (callId: string | null) => void;
  setStatus: (status: CallState["status"]) => void;
  setIsInitiator: (isInitiator: boolean) => void;
  setLocalUserId: (userId: string) => void;
  setRemoteUser: (userId: string, name?: string) => void;
  setVideoEnabled: (enabled: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setEmotionEnabled: (enabled: boolean) => void;
  setLocalEmotion: (emotion: EmotionData | null) => void;
  setRemoteEmotion: (emotion: EmotionData | null) => void;
  addEmotionToHistory: (emotion: EmotionData) => void;
  setIncomingCall: (call: IncomingCall | null) => void;
  setPendingSignal: (signal: SignalData | null) => void;
  startCall: () => void;
  endCall: () => void;
  updateDuration: () => void;
  resetCall: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  // Initial state
  callId: null,
  status: "idle",
  isInitiator: false,
  localUserId: null,
  remoteUserId: null,
  remoteUserName: null,
  isVideoEnabled: true,
  isAudioEnabled: true,
  isEmotionEnabled: true,
  localEmotion: null,
  remoteEmotion: null,
  emotionHistory: [],
  incomingCall: null,
  pendingSignal: null,
  startTime: null,
  duration: 0,

  // Actions
  setCallId: (callId) => set({ callId }),
  
  setStatus: (status) => set({ status }),
  
  setIsInitiator: (isInitiator) => set({ isInitiator }),
  
  setLocalUserId: (userId) => set({ localUserId: userId }),
  
  setRemoteUser: (userId, name) => set({ 
    remoteUserId: userId, 
    remoteUserName: name || null 
  }),
  
  setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),
  
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  
  setEmotionEnabled: (enabled) => set({ isEmotionEnabled: enabled }),
  
  setLocalEmotion: (emotion) => set({ localEmotion: emotion }),
  
  setRemoteEmotion: (emotion) => {
    set({ remoteEmotion: emotion });
    if (emotion) {
      const history = get().emotionHistory;
      set({ 
        emotionHistory: [...history.slice(-19), emotion]
      });
    }
  },
  
  addEmotionToHistory: (emotion) => {
    const history = get().emotionHistory;
    set({ emotionHistory: [...history.slice(-19), emotion] });
  },
  
  setIncomingCall: (call) => set({ incomingCall: call }),
  
  setPendingSignal: (signal) => set({ pendingSignal: signal }),
  
  startCall: () => set({ 
    status: "active", 
    startTime: new Date(),
    duration: 0 
  }),
  
  endCall: () => set({ status: "ended" }),
  
  updateDuration: () => {
    const startTime = get().startTime;
    if (startTime) {
      const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
      set({ duration });
    }
  },
  
  resetCall: () => set({
    callId: null,
    status: "idle",
    isInitiator: false,
    remoteUserId: null,
    remoteUserName: null,
    isVideoEnabled: true,
    isAudioEnabled: true,
    localEmotion: null,
    remoteEmotion: null,
    emotionHistory: [],
    incomingCall: null,
    pendingSignal: null,
    startTime: null,
    duration: 0,
  }),
}));

