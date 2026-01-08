"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Send,
  Heart,
  Smile,
  Sparkles,
  ChevronRight,
  Check,
  Clock,
} from "lucide-react";

const EMOTIONS = [
  { name: "Happy", color: "#22C55E", icon: "😊" },
  { name: "Grateful", color: "#3B82F6", icon: "🙏" },
  { name: "Excited", color: "#F59E0B", icon: "🎉" },
  { name: "Peaceful", color: "#06B6D4", icon: "😌" },
  { name: "Loving", color: "#EC4899", icon: "💕" },
  { name: "Hopeful", color: "#8B5CF6", icon: "✨" },
  { name: "Sad", color: "#6B7280", icon: "😢" },
  { name: "Anxious", color: "#EF4444", icon: "😰" },
];

const DEMO_CONVERSATIONS = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "S",
    lastMessage: "Thank you so much! That means a lot 💕",
    time: "2m ago",
    unread: 2,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "M",
    lastMessage: "I understand how you feel",
    time: "1h ago",
    unread: 0,
  },
  {
    id: "3",
    name: "Emma Williams",
    avatar: "E",
    lastMessage: "Hope you're feeling better today!",
    time: "Yesterday",
    unread: 0,
  },
];

const DEMO_MESSAGES = [
  {
    id: "1",
    sender: "them",
    emotion: "curious",
    text: "How are you feeling today?",
    time: "10:30 AM",
    emotionText: "They seem genuinely curious about your wellbeing",
  },
  {
    id: "2",
    sender: "me",
    emotion: "grateful",
    text: "I'm feeling really grateful today. Thank you for checking in on me.",
    time: "10:32 AM",
    colors: ["#3B82F6", "#06B6D4"],
  },
  {
    id: "3",
    sender: "them",
    emotion: "happy",
    text: "That's wonderful to hear! 😊",
    time: "10:33 AM",
    emotionText: "They're expressing genuine happiness",
  },
  {
    id: "4",
    sender: "me",
    emotion: "peaceful",
    text: "The meditation session this morning really helped me feel calm.",
    time: "10:35 AM",
    colors: ["#06B6D4", "#22C55E"],
  },
];

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(DEMO_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [selectedEmotion, setSelectedEmotion] = useState<typeof EMOTIONS[0] | null>(null);
  const [intensity, setIntensity] = useState(70);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const handleSelectEmotion = (emotion: typeof EMOTIONS[0]) => {
    setSelectedEmotion(emotion);
    // Simulate AI generating text
    const texts: Record<string, string[]> = {
      Happy: [
        "I'm feeling really happy right now and wanted to share that with you!",
        "There's a warm sense of joy in my heart today.",
        "I can't help but smile - life feels good right now.",
      ],
      Grateful: [
        "I'm feeling deeply grateful for having you in my life.",
        "Thank you for always being there - it means so much to me.",
        "I wanted you to know how much I appreciate you.",
      ],
      Excited: [
        "I'm so excited about this! I can barely contain myself!",
        "Something wonderful is happening and I had to tell you!",
        "My heart is racing with excitement right now!",
      ],
      Peaceful: [
        "I'm in such a calm, peaceful state right now.",
        "Everything feels serene and balanced today.",
        "I feel a deep sense of inner peace I wanted to share.",
      ],
      Loving: [
        "I'm feeling so much love for you right now.",
        "You mean the world to me, and I wanted you to know.",
        "My heart is full of warmth and affection for you.",
      ],
      Hopeful: [
        "I'm feeling really hopeful about the future.",
        "Something tells me good things are coming our way.",
        "I have this wonderful sense of optimism today.",
      ],
      Sad: [
        "I'm feeling a bit down today and could use some support.",
        "There's a heaviness in my heart I wanted to share with you.",
        "I'm going through a difficult moment right now.",
      ],
      Anxious: [
        "I'm feeling anxious and needed to reach out.",
        "My mind is racing and I'm feeling overwhelmed.",
        "I'm struggling with some worries right now.",
      ],
    };
    const options = texts[emotion.name] || ["I'm feeling " + emotion.name.toLowerCase()];
    setGeneratedText(options[Math.floor(Math.random() * options.length)]);
  };

  const handleSend = () => {
    if (!selectedEmotion || !generatedText) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "me" as const,
      emotion: selectedEmotion.name.toLowerCase(),
      text: generatedText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      colors: [selectedEmotion.color, "#06B6D4"],
    };

    setMessages([...messages, newMessage]);
    setSelectedEmotion(null);
    setGeneratedText("");
    setShowEmotionPicker(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations List */}
      <div className="w-80 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
          <p className="text-sm text-slate-500">Emotion-based communication</p>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {DEMO_CONVERSATIONS.map((conv) => (
            <Card
              key={conv.id}
              className={`cursor-pointer transition-colors ${
                selectedConversation.id === conv.id ? 'border-primary bg-primary/5' : 'hover:border-slate-300'
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900 text-sm">{conv.name}</p>
                    <span className="text-xs text-slate-400">{conv.time}</span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              {selectedConversation.avatar}
            </div>
            <div>
              <p className="font-medium text-slate-900">{selectedConversation.name}</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-primary" />
            AI-Powered Emotion Translation
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-2' : ''}`}>
                {msg.sender === 'me' ? (
                  <div
                    className="rounded-2xl rounded-br-sm p-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${msg.colors?.[0] || '#0D9488'}, ${msg.colors?.[1] || '#06B6D4'})`,
                    }}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-2 text-white/70 text-xs">
                      <span>{msg.time}</span>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-800">{msg.text}</p>
                    {msg.emotionText && (
                      <p className="text-xs text-primary mt-2 flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {msg.emotionText}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">{msg.time}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Emotion Picker */}
        {showEmotionPicker && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <p className="text-sm font-medium text-slate-700 mb-3">How are you feeling?</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => handleSelectEmotion(emotion)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedEmotion?.name === emotion.name
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl block text-center mb-1">{emotion.icon}</span>
                  <span className="text-xs text-slate-600">{emotion.name}</span>
                </button>
              ))}
            </div>

            {selectedEmotion && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">
                    Intensity: {intensity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Generated Message
                  </p>
                  <p className="text-sm text-slate-800">{generatedText}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowEmotionPicker(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSend} className="flex-1">
                    <Send className="w-4 h-4 mr-1" />
                    Send Emotion
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        {!showEmotionPicker && (
          <div className="p-4 border-t border-slate-200 flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => setShowEmotionPicker(true)}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Express Emotion
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Or type a regular message..."
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Send className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
