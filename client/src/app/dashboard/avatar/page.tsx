"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Send,
  Heart,
  Brain,
  Settings,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Volume2,
  Mic,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";

const personalityTraits = [
  { trait: "Empathetic", level: 92 },
  { trait: "Patient", level: 88 },
  { trait: "Encouraging", level: 95 },
  { trait: "Understanding", level: 90 },
];

const learningProgress = [
  { category: "Your Emotions", patterns: 48, accuracy: 94 },
  { category: "Expression Style", patterns: 32, accuracy: 89 },
  { category: "Context Awareness", patterns: 56, accuracy: 91 },
];

const suggestedPrompts = [
  { text: "Help me express gratitude", icon: "💝" },
  { text: "I'm feeling anxious", icon: "😰" },
  { text: "Create a message for my mom", icon: "👩" },
  { text: "Share my excitement", icon: "🎉" },
  { text: "I need to calm down", icon: "🧘" },
  { text: "Express my love", icon: "❤️" },
];

const initialMessages = [
  { 
    id: 1, 
    sender: "avatar", 
    content: "Hello! 👋 I'm your personal emotion companion. I've been learning how you express yourself, and I'm here to help you communicate your feelings better. How are you feeling today?", 
    time: "Just now" 
  },
];

export default function AvatarPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: messages.length + 1, sender: "user", content: inputValue, time: "Just now" };
    setMessages([...messages, userMessage]);
    setInputValue("");

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const avatarResponses = [
      "I can sense the emotion in your words. Based on what you've shared, it sounds like you're experiencing something meaningful. Would you like me to help you express this to someone? 💭",
      "That's a beautiful feeling to have! I've noticed you often express this emotion with warmth and sincerity. Should I help craft a message that captures this? ✨",
      "I understand how you feel. Remember, it's completely okay to experience this. Based on your communication patterns, I think a heartfelt message would resonate well. Want me to help? 🌟",
      "Thank you for sharing that with me. Your emotional awareness is growing - I can see it in how you articulate your feelings. How can I assist you further? 💫",
    ];

    const avatarMessage = { 
      id: messages.length + 2, 
      sender: "avatar", 
      content: avatarResponses[Math.floor(Math.random() * avatarResponses.length)], 
      time: "Just now" 
    };
    setMessages((prev) => [...prev, avatarMessage]);
    setIsTyping(false);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-4">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">HeartSpeak Avatar</h1>
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Active & Learning from you
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Customize
            </Button>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "avatar" && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[70%] ${message.sender === "user" ? "order-1" : ""}`}>
                  <div 
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === "user" 
                        ? "bg-primary text-white rounded-br-md" 
                        : "bg-white text-slate-900 rounded-bl-md shadow-sm border border-slate-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <div 
                    className={`flex items-center gap-2 mt-1.5 px-1 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-xs text-slate-400">{message.time}</span>
                    {message.sender === "avatar" && (
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                          <ThumbsUp className="w-3 h-3 text-slate-400 hover:text-primary" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                          <ThumbsDown className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                          <Copy className="w-3 h-3 text-slate-400 hover:text-primary" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span 
                        key={i} 
                        className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" 
                        style={{ animationDelay: `${i * 0.15}s` }} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {suggestedPrompts.map((prompt, index) => (
                <button 
                  key={index} 
                  onClick={() => setInputValue(prompt.text)} 
                  className="flex items-center gap-2 flex-shrink-0 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-primary/30 rounded-full text-sm text-slate-700 transition-all hover:shadow-sm"
                >
                  <span>{prompt.icon}</span>
                  <span>{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="w-10 h-10 rounded-full flex-shrink-0">
                <Mic className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyPress={(e) => e.key === "Enter" && handleSend()} 
                  placeholder="Tell me how you're feeling..." 
                  className="pr-12 h-11 rounded-full bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
              <Button 
                variant="primary" 
                size="icon" 
                onClick={handleSend} 
                disabled={!inputValue.trim()} 
                className="w-10 h-10 rounded-full flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Sidebar - Hidden on smaller screens */}
      <div className="w-80 flex-shrink-0 space-y-4 hidden xl:block">
        {/* Avatar Stats Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark mx-auto mb-4 flex items-center justify-center shadow-lg relative">
              <Bot className="w-10 h-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Your Personal Avatar</h3>
            <p className="text-xs text-slate-500 mb-4">Continuously learning your style</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">94%</p>
                <p className="text-xs text-slate-500">Accuracy</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">48</p>
                <p className="text-xs text-slate-500">Patterns</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Personality Traits */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-slate-900">Personality Traits</h3>
            </div>
            <div className="space-y-3">
              {personalityTraits.map((item) => (
                <div key={item.trait}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-600">{item.trait}</span>
                    <span className="text-xs font-semibold text-primary">{item.level}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500" 
                      style={{ width: `${item.level}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-slate-900">Learning Progress</h3>
            </div>
            <div className="space-y-3">
              {learningProgress.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.category}</p>
                    <p className="text-xs text-slate-500">{item.patterns} patterns learned</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">{item.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tip */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-900 mb-1">Pro Tip</h4>
                <p className="text-xs text-amber-700">
                  The more you chat, the better I understand your emotional language. Try describing your feelings in detail!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
