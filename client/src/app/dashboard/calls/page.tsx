"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Brain,
  Users,
  Clock,
  Heart,
} from "lucide-react";

// Simulated emotions for demo
const DEMO_EMOTIONS = [
  { emotion: "happy", text: "They seem happy and engaged in the conversation", confidence: 0.92 },
  { emotion: "thoughtful", text: "They appear to be contemplating something deeply", confidence: 0.85 },
  { emotion: "curious", text: "They're showing interest and curiosity", confidence: 0.88 },
  { emotion: "peaceful", text: "They seem calm and at ease", confidence: 0.90 },
  { emotion: "excited", text: "They're showing signs of excitement", confidence: 0.87 },
  { emotion: "grateful", text: "They appear grateful and appreciative", confidence: 0.83 },
];

const DEMO_CONTACTS = [
  { id: "1", name: "Sarah Johnson", status: "online", avatar: "S", lastCall: "2 hours ago" },
  { id: "2", name: "Michael Chen", status: "online", avatar: "M", lastCall: "Yesterday" },
  { id: "3", name: "Emma Williams", status: "offline", avatar: "E", lastCall: "3 days ago" },
  { id: "4", name: "David Brown", status: "online", avatar: "D", lastCall: "1 week ago" },
];

export default function CallsPage() {
  const [isInCall, setIsInCall] = useState(false);
  const [selectedContact, setSelectedContact] = useState<typeof DEMO_CONTACTS[0] | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(DEMO_EMOTIONS[0]);
  const [peerEmotion, setPeerEmotion] = useState(DEMO_EMOTIONS[2]);
  const [callDuration, setCallDuration] = useState(0);
  const [emotionEnabled, setEmotionEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate camera access
  useEffect(() => {
    if (isInCall && videoRef.current) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Demo mode - camera not required
        });
    }
  }, [isInCall]);

  // Simulate emotion changes during call
  useEffect(() => {
    if (!isInCall || !emotionEnabled) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * DEMO_EMOTIONS.length);
      setCurrentEmotion(DEMO_EMOTIONS[randomIndex]);
      
      const peerIndex = Math.floor(Math.random() * DEMO_EMOTIONS.length);
      setPeerEmotion(DEMO_EMOTIONS[peerIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isInCall, emotionEnabled]);

  // Call timer
  useEffect(() => {
    if (!isInCall) return;
    const interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = (contact: typeof DEMO_CONTACTS[0]) => {
    setSelectedContact(contact);
    setIsInCall(true);
    setCallDuration(0);
  };

  const endCall = () => {
    setIsInCall(false);
    setSelectedContact(null);
    setCallDuration(0);
  };

  if (isInCall && selectedContact) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
        {/* Call Header */}
        <div className="bg-slate-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              {selectedContact.avatar}
            </div>
            <div>
              <h2 className="text-white font-medium">{selectedContact.name}</h2>
              <p className="text-slate-400 text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(callDuration)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {emotionEnabled && (
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-1">
                <Brain className="w-4 h-4" />
                AI Active
              </span>
            )}
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 relative bg-gradient-to-b from-slate-800 to-slate-900">
          {/* Remote Video Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl text-white">{selectedContact.avatar}</span>
              </div>
              <p className="text-white text-xl">{selectedContact.name}</p>
              <p className="text-green-400 text-sm mt-1">Connected</p>
            </div>
          </div>

          {/* Local Video (PiP) */}
          <div className="absolute top-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white/20 bg-slate-800">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-slate-500" />
              </div>
            )}
            <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
              You
            </div>
          </div>

          {/* Emotion Overlays */}
          {emotionEnabled && (
            <>
              {/* Your Emotion */}
              <div className="absolute bottom-28 right-4 bg-black/70 rounded-lg p-3 max-w-52">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-white text-sm font-medium">Your Emotion</span>
                </div>
                <p className="text-primary text-lg capitalize">{currentEmotion.emotion}</p>
                <p className="text-slate-300 text-xs">{Math.round(currentEmotion.confidence * 100)}% confidence</p>
                <p className="text-slate-400 text-xs mt-1 italic">&quot;{currentEmotion.text}&quot;</p>
              </div>

              {/* Peer Emotion */}
              <div className="absolute bottom-28 left-4 bg-black/70 rounded-lg p-3 max-w-52">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm font-medium">{selectedContact.name}</span>
                </div>
                <p className="text-green-400 text-lg capitalize">{peerEmotion.emotion}</p>
                <p className="text-slate-300 text-xs">{Math.round(peerEmotion.confidence * 100)}% confidence</p>
                <p className="text-slate-400 text-xs mt-1 italic">&quot;{peerEmotion.text}&quot;</p>
              </div>
            </>
          )}
        </div>

        {/* Call Controls */}
        <div className="bg-slate-800/90 p-6 flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="w-14 h-14 rounded-full"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            variant={isVideoOff ? "destructive" : "outline"}
            size="icon"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className="w-14 h-14 rounded-full"
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>

          <Button
            variant={emotionEnabled ? "primary" : "outline"}
            size="icon"
            onClick={() => setEmotionEnabled(!emotionEnabled)}
            className="w-14 h-14 rounded-full"
            title="Toggle AI Emotion Detection"
          >
            <Brain className="w-6 h-6" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={endCall}
            className="w-16 h-16 rounded-full"
          >
            <PhoneOff className="w-7 h-7" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Video Calls</h1>
          <p className="text-sm text-slate-500">Connect with emotion-aware video calls</p>
        </div>
      </div>

      {/* Feature Highlight */}
      <Card className="bg-gradient-to-r from-primary/10 to-teal-50 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">AI Emotion Detection</h3>
              <p className="text-sm text-slate-600">
                Real-time facial expression analysis translates emotions into meaningful text,
                helping your loved ones understand how you&apos;re feeling during the call.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Calls", value: "24", icon: Phone },
          { label: "This Week", value: "8", icon: Clock },
          { label: "Contacts", value: "4", icon: Users },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contacts */}
      <div>
        <h2 className="font-semibold text-slate-900 mb-4">Contacts</h2>
        <div className="grid gap-3">
          {DEMO_CONTACTS.map((contact) => (
            <Card key={contact.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                      {contact.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      contact.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{contact.name}</p>
                    <p className="text-sm text-slate-500">Last call: {contact.lastCall}</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => startCall(contact)}
                  disabled={contact.status !== 'online'}
                >
                  <Video className="w-4 h-4 mr-1" />
                  {contact.status === 'online' ? 'Call' : 'Offline'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
