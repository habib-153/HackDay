"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircleHeart,
  Send,
  Heart,
  Smile,
  Sparkles,
  Search,
  Plus,
  Check,
  CheckCheck,
  Palette,
  Settings,
  MoreVertical,
  Phone,
  Video,
  Image,
  Mic,
  ChevronRight,
} from "lucide-react";

// Emotion options for message composition
const emotions = [
  { name: "Joy", emoji: "😊", color: "bg-amber", gradient: "from-amber to-amber-soft" },
  { name: "Sadness", emoji: "😢", color: "bg-lavender", gradient: "from-lavender to-lavender-soft" },
  { name: "Love", emoji: "❤️", color: "bg-coral", gradient: "from-coral to-peach" },
  { name: "Gratitude", emoji: "🥰", color: "bg-rose", gradient: "from-rose to-peach" },
  { name: "Anxiety", emoji: "😰", color: "bg-slate-400", gradient: "from-slate-400 to-slate-300" },
  { name: "Excitement", emoji: "🎉", color: "bg-peach", gradient: "from-peach to-amber-soft" },
  { name: "Peaceful", emoji: "😌", color: "bg-teal", gradient: "from-teal to-teal-light" },
  { name: "Curious", emoji: "🤔", color: "bg-teal-dark", gradient: "from-teal-dark to-teal" },
];

// Mock conversations
const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "SJ",
    lastMessage: "I felt your warmth in that message 💕",
    time: "2m",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Mom",
    avatar: "M",
    lastMessage: "The pattern you sent was beautiful",
    time: "1h",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "David Chen",
    avatar: "DC",
    lastMessage: "Thanks for sharing how you feel",
    time: "3h",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "EW",
    lastMessage: "Your emotion translation was so touching",
    time: "1d",
    unread: 0,
    online: false,
  },
];

// Mock messages
const messages = [
  {
    id: 1,
    sender: "them",
    type: "text",
    content: "Hey! How are you feeling today?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    type: "emotion",
    emotion: "Grateful",
    intensity: 80,
    content:
      "I'm feeling really grateful today. Thinking about how lucky I am to have people who understand me, even without words. Your support means everything to me. 💖",
    time: "10:32 AM",
    gradient: "from-rose to-peach",
  },
  {
    id: 3,
    sender: "them",
    type: "text",
    content: "That's so beautiful! I could feel the warmth in your message 🥰",
    time: "10:33 AM",
  },
  {
    id: 4,
    sender: "me",
    type: "pattern",
    patternName: "Warm Heart",
    content: "Sent a pattern expressing love",
    time: "10:35 AM",
    gradient: "from-coral to-peach",
  },
  {
    id: 5,
    sender: "them",
    type: "text",
    content: "I love the pattern! The colors are so warm and inviting.",
    time: "10:36 AM",
  },
  {
    id: 6,
    sender: "me",
    type: "emotion",
    emotion: "Joy",
    intensity: 90,
    content:
      "Feeling so happy right now! Everything just feels right. The sun is shining, and I'm surrounded by people who care. Life is good! ✨",
    time: "10:40 AM",
    gradient: "from-amber to-amber-soft",
  },
];

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [isComposing, setIsComposing] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(50);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Conversations List */}
      <Card className="w-80 flex-shrink-0 flex flex-col overflow-hidden hidden lg:flex">
        <CardContent className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
            <Button variant="ghost" size="icon">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </CardContent>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((conv) => (
            <motion.div
              key={conv.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedConversation(conv.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                selectedConversation === conv.id
                  ? "bg-coral/10"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-peach flex items-center justify-center text-white font-medium">
                  {conv.avatar}
                </div>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground truncate">
                    {conv.name}
                  </p>
                  <span className="text-xs text-slate-400">{conv.time}</span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-coral text-white text-xs flex items-center justify-center">
                  {conv.unread}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <CardContent className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-peach flex items-center justify-center text-white font-medium">
              SJ
            </div>
            <div>
              <p className="font-medium text-foreground">Sarah Johnson</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "text" ? (
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === "me"
                      ? "bg-coral text-white rounded-br-md"
                      : "bg-slate-100 text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs ${
                      message.sender === "me" ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    <span>{message.time}</span>
                    {message.sender === "me" && (
                      <CheckCheck className="w-3 h-3" />
                    )}
                  </div>
                </div>
              ) : message.type === "emotion" ? (
                <div className="max-w-md">
                  <div
                    className={`bg-gradient-to-br ${message.gradient} p-4 rounded-2xl rounded-br-md text-white`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Feeling {message.emotion}
                      </span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {message.intensity}%
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-white/70">
                      <Sparkles className="w-3 h-3" />
                      <span>AI-crafted message</span>
                      <span className="mx-1">•</span>
                      <span>{message.time}</span>
                      <CheckCheck className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </div>
              ) : message.type === "pattern" ? (
                <div className="max-w-sm">
                  <div
                    className={`bg-gradient-to-br ${message.gradient} p-4 rounded-2xl rounded-br-md`}
                  >
                    <div className="w-full aspect-video bg-white/20 rounded-xl flex items-center justify-center mb-3">
                      <Palette className="w-12 h-12 text-white/80" />
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {message.patternName}
                        </span>
                      </div>
                      <span className="text-xs text-white/70">{message.time}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>

        {/* Emotion Composer */}
        <AnimatePresence>
          {isComposing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-100 overflow-hidden"
            >
              <div className="p-4 bg-slate-50">
                {/* Step 1: Select Emotion */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-3">
                    How are you feeling?
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.name}
                        onClick={() => setSelectedEmotion(emotion.name)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          selectedEmotion === emotion.name
                            ? "border-coral bg-coral/10"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <span className="text-2xl block text-center mb-1">
                          {emotion.emoji}
                        </span>
                        <span className="text-xs text-slate-600 block text-center">
                          {emotion.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Intensity */}
                {selectedEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">
                        Intensity
                      </p>
                      <span className="text-sm text-coral font-medium">
                        {intensity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full accent-coral"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>Subtle</span>
                      <span>Overwhelming</span>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Optional context */}
                {selectedEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">
                      Add context (optional)
                    </p>
                    <Input placeholder="What's on your mind? The AI will craft a message..." />
                  </motion.div>
                )}

                {/* Preview and Send */}
                {selectedEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsComposing(false);
                        setSelectedEmotion(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1">
                      <Sparkles className="w-5 h-5" />
                      Generate & Send
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <CardContent className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <Button
              variant={isComposing ? "primary" : "outline"}
              size="icon"
              onClick={() => setIsComposing(!isComposing)}
              className="flex-shrink-0"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Palette className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder={
                  isComposing
                    ? "Use emotion composer above..."
                    : "Type a message or use emotion composer..."
                }
                disabled={isComposing}
                className="pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Image className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button variant="primary" size="icon" className="flex-shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Emotions */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-slate-400">Quick:</span>
            {emotions.slice(0, 5).map((emotion) => (
              <button
                key={emotion.name}
                onClick={() => {
                  setIsComposing(true);
                  setSelectedEmotion(emotion.name);
                }}
                className="text-lg hover:scale-125 transition-transform"
              >
                {emotion.emoji}
              </button>
            ))}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
