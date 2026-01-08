"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Heart,
  Search,
  Plus,
  CheckCheck,
  Palette,
  Phone,
  Video,
  MoreVertical,
  Image,
  Mic,
} from "lucide-react";

const emotions = [
  { name: "Joy", emoji: "😊" },
  { name: "Sadness", emoji: "😢" },
  { name: "Love", emoji: "❤️" },
  { name: "Gratitude", emoji: "🥰" },
  { name: "Anxiety", emoji: "😰" },
  { name: "Excitement", emoji: "🎉" },
  { name: "Peaceful", emoji: "😌" },
  { name: "Curious", emoji: "🤔" },
];

const conversations = [
  { id: 1, name: "Sarah Johnson", avatar: "SJ", lastMessage: "I felt your warmth in that message", time: "2m", unread: 2, online: true },
  { id: 2, name: "Mom", avatar: "M", lastMessage: "The pattern you sent was beautiful", time: "1h", unread: 0, online: true },
  { id: 3, name: "David Chen", avatar: "DC", lastMessage: "Thanks for sharing how you feel", time: "3h", unread: 0, online: false },
  { id: 4, name: "Emma Wilson", avatar: "EW", lastMessage: "Your emotion translation was touching", time: "1d", unread: 0, online: false },
];

const messages = [
  { id: 1, sender: "them", type: "text", content: "Hey! How are you feeling today?", time: "10:30 AM" },
  { id: 2, sender: "me", type: "emotion", emotion: "Grateful", content: "I'm feeling really grateful today. Thinking about how lucky I am to have people who understand me.", time: "10:32 AM" },
  { id: 3, sender: "them", type: "text", content: "That's so beautiful! I could feel the warmth in your message", time: "10:33 AM" },
  { id: 4, sender: "me", type: "text", content: "Thank you! Your support means everything.", time: "10:35 AM" },
  { id: 5, sender: "them", type: "text", content: "I love the new pattern you created. The colors are warm and inviting.", time: "10:36 AM" },
];

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [isComposing, setIsComposing] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(50);

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-72 flex-shrink-0 flex flex-col overflow-hidden hidden lg:flex">
        <CardContent className="p-3 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-slate-900">Messages</h2>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search..." className="pl-9 h-9" />
          </div>
        </CardContent>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${selectedConversation === conv.id ? "bg-primary/10" : "hover:bg-slate-50"}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium">
                  {conv.avatar}
                </div>
                {conv.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900 truncate">{conv.name}</p>
                  <span className="text-xs text-slate-400">{conv.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">{conv.unread}</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <CardContent className="p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium">SJ</div>
            <div>
              <p className="text-sm font-medium text-slate-900">Sarah Johnson</p>
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8"><Phone className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="w-8 h-8"><Video className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="w-8 h-8"><MoreVertical className="w-4 h-4" /></Button>
          </div>
        </CardContent>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              {message.type === "text" ? (
                <div className={`max-w-md px-3 py-2 rounded-md ${message.sender === "me" ? "bg-primary text-white" : "bg-slate-100 text-slate-900"}`}>
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${message.sender === "me" ? "text-white/70" : "text-slate-400"}`}>
                    <span>{message.time}</span>
                    {message.sender === "me" && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              ) : message.type === "emotion" ? (
                <div className="max-w-md bg-primary/10 border border-primary/20 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-slate-900">Feeling {message.emotion}</span>
                  </div>
                  <p className="text-sm text-slate-700">{message.content}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <span>AI-crafted</span>
                    <span>•</span>
                    <span>{message.time}</span>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Emotion Composer */}
        {isComposing && (
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <p className="text-sm font-medium text-slate-900 mb-3">How are you feeling?</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {emotions.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => setSelectedEmotion(emotion.name)}
                  className={`p-2 rounded-md border transition-colors ${selectedEmotion === emotion.name ? "border-primary bg-primary/10" : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <span className="text-xl block text-center">{emotion.emoji}</span>
                  <span className="text-xs text-slate-600 block text-center">{emotion.name}</span>
                </button>
              ))}
            </div>

            {selectedEmotion && (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-700">Intensity</p>
                    <span className="text-sm font-medium text-primary">{intensity}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-full accent-primary" />
                </div>
                <Input placeholder="Add context (optional)..." className="mb-4" />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setIsComposing(false); setSelectedEmotion(null); }}>Cancel</Button>
                  <Button variant="primary" className="flex-1">Generate & Send</Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Input Area */}
        <CardContent className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Button variant={isComposing ? "primary" : "outline"} size="icon" className="w-9 h-9" onClick={() => setIsComposing(!isComposing)}>
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-9 h-9">
              <Palette className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input placeholder={isComposing ? "Use emotion composer above..." : "Type a message..."} disabled={isComposing} className="pr-20" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" className="w-7 h-7"><Image className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-7 h-7"><Mic className="w-4 h-4" /></Button>
              </div>
            </div>
            <Button variant="primary" size="icon" className="w-9 h-9">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-400">Quick:</span>
            {emotions.slice(0, 5).map((emotion) => (
              <button key={emotion.name} onClick={() => { setIsComposing(true); setSelectedEmotion(emotion.name); }} className="text-lg hover:scale-110 transition-transform">
                {emotion.emoji}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
