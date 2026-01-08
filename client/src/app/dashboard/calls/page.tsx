"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  Settings,
  Maximize2,
  MessageSquare,
  Heart,
  Smile,
  Sparkles,
  Clock,
  Search,
  Plus,
  MoreVertical,
} from "lucide-react";

// Mock contacts for video calls
const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "SJ",
    status: "online",
    lastCall: "2 hours ago",
  },
  {
    id: 2,
    name: "Mom",
    avatar: "M",
    status: "online",
    lastCall: "Yesterday",
  },
  {
    id: 3,
    name: "David Chen",
    avatar: "DC",
    status: "offline",
    lastCall: "3 days ago",
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "EW",
    status: "online",
    lastCall: "1 week ago",
  },
];

// Mock recent calls
const recentCalls = [
  {
    id: 1,
    contact: "Sarah Johnson",
    avatar: "SJ",
    duration: "23 min",
    time: "Today, 2:30 PM",
    emotionsDetected: ["Happy", "Excited", "Grateful"],
    type: "outgoing",
  },
  {
    id: 2,
    contact: "Mom",
    avatar: "M",
    duration: "45 min",
    time: "Yesterday, 6:15 PM",
    emotionsDetected: ["Love", "Peaceful", "Nostalgic"],
    type: "incoming",
  },
  {
    id: 3,
    contact: "David Chen",
    avatar: "DC",
    duration: "12 min",
    time: "Jan 5, 11:00 AM",
    emotionsDetected: ["Curious", "Focused"],
    type: "outgoing",
  },
];

// Detected emotions during call (mock)
const liveEmotions = [
  { emotion: "Happy", confidence: 85, color: "bg-amber" },
  { emotion: "Engaged", confidence: 92, color: "bg-teal" },
  { emotion: "Interested", confidence: 78, color: "bg-lavender" },
];

export default function VideoCallsPage() {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showEmotionPanel, setShowEmotionPanel] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Video Calls</h1>
          <p className="text-slate-500">
            Connect through emotion-recognized video calls
          </p>
        </div>
        <Button variant="primary" size="lg">
          <Plus className="w-5 h-5" />
          New Call
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side - Contacts & Recent */}
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search contacts..."
              className="pl-12"
            />
          </div>

          {/* Online Contacts */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Contacts</h2>
                <span className="text-xs text-slate-500">
                  {contacts.filter((c) => c.status === "online").length} online
                </span>
              </div>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-peach flex items-center justify-center text-white font-medium">
                        {contact.avatar}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          contact.status === "online"
                            ? "bg-green-500"
                            : "bg-slate-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Last call: {contact.lastCall}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setIsInCall(true)}
                    >
                      <Video className="w-5 h-5 text-coral" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Calls */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold text-foreground mb-4">Recent Calls</h2>
              <div className="space-y-3">
                {recentCalls.map((call) => (
                  <div
                    key={call.id}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-light flex items-center justify-center text-white text-sm font-medium">
                        {call.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">
                          {call.contact}
                        </p>
                        <p className="text-xs text-slate-500">{call.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-600">
                          {call.duration}
                        </p>
                        <p
                          className={`text-xs ${
                            call.type === "incoming"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          {call.type === "incoming" ? "↓ Incoming" : "↑ Outgoing"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {call.emotionsDetected.map((emotion) => (
                        <span
                          key={emotion}
                          className="px-2 py-0.5 text-xs rounded-full bg-white text-slate-600"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Video Call Area */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Video Area */}
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                {isInCall ? (
                  <>
                    {/* Main Video (Remote) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-coral to-peach flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                          SJ
                        </div>
                        <p className="text-white text-lg font-medium">
                          Sarah Johnson
                        </p>
                        <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          12:34
                        </p>
                      </div>
                    </div>

                    {/* Self View (Picture-in-Picture) */}
                    <div className="absolute top-4 right-4 w-32 h-24 rounded-xl bg-slate-800 border-2 border-white/20 overflow-hidden">
                      {isVideoOff ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <VideoOff className="w-6 h-6 text-white/50" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal to-teal-light">
                          <span className="text-white font-medium">You</span>
                        </div>
                      )}
                    </div>

                    {/* Emotion Detection Overlay */}
                    <AnimatePresence>
                      {showEmotionPanel && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="absolute left-4 top-4 w-48 bg-black/60 backdrop-blur-sm rounded-xl p-4"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-coral" />
                            <span className="text-white text-sm font-medium">
                              Detected Emotions
                            </span>
                          </div>
                          <div className="space-y-2">
                            {liveEmotions.map((item) => (
                              <div key={item.emotion}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white/80 text-xs">
                                    {item.emotion}
                                  </span>
                                  <span className="text-white/60 text-xs">
                                    {item.confidence}%
                                  </span>
                                </div>
                                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.confidence}%` }}
                                    className={`h-full ${item.color} rounded-full`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* AI Translation */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-20 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-peach flex items-center justify-center flex-shrink-0">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs mb-1">
                            AI Translation
                          </p>
                          <p className="text-white text-sm">
                            &quot;Sarah seems genuinely happy to see you. She&apos;s showing
                            signs of excitement and engagement in the conversation.&quot;
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  /* Not in call state */
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <Video className="w-10 h-10 text-white/50" />
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">
                      Ready to Connect
                    </h3>
                    <p className="text-white/60 text-sm max-w-xs mx-auto mb-6">
                      Start an emotion-recognized video call with your contacts
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setIsInCall(true)}
                    >
                      <Phone className="w-5 h-5" />
                      Start Demo Call
                    </Button>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="bg-slate-800 p-4">
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    variant={isVideoOff ? "destructive" : "secondary"}
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? (
                      <VideoOff className="w-5 h-5" />
                    ) : (
                      <Video className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    variant={showEmotionPanel ? "primary" : "secondary"}
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={() => setShowEmotionPanel(!showEmotionPanel)}
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-12 h-12 rounded-full"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-12 h-12 rounded-full"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                  {isInCall && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-12 h-12 rounded-full ml-4"
                      onClick={() => setIsInCall(false)}
                    >
                      <PhoneOff className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Info */}
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            {[
              {
                icon: Sparkles,
                title: "Real-time Analysis",
                description: "AI analyzes facial expressions every 2-3 seconds",
              },
              {
                icon: MessageSquare,
                title: "Emotion Translation",
                description: "Your feelings translated into natural language",
              },
              {
                icon: Heart,
                title: "Deeper Connection",
                description: "Help others understand your true emotions",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-slate-50 to-white">
                  <CardContent className="p-4">
                    <feature.icon className="w-6 h-6 text-coral mb-2" />
                    <h3 className="font-medium text-foreground text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-500">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
