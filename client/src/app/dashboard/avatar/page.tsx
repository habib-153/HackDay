"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Send,
  Sparkles,
  Heart,
  Brain,
  Settings,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Volume2,
  Mic,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  Palette,
  Star,
  ChevronRight,
} from "lucide-react";

// Avatar personality traits
const personalityTraits = [
  { trait: "Empathetic", level: 92 },
  { trait: "Patient", level: 88 },
  { trait: "Encouraging", level: 95 },
  { trait: "Understanding", level: 90 },
];

// Learning progress
const learningProgress = [
  { category: "Your Emotions", patterns: 48, accuracy: 94 },
  { category: "Expression Style", patterns: 32, accuracy: 89 },
  { category: "Context Awareness", patterns: 56, accuracy: 91 },
];

// Suggested prompts
const suggestedPrompts = [
  "Help me express gratitude to my friend",
  "I'm feeling anxious, can you help?",
  "Create a message for my mom",
  "How should I share my excitement?",
];

// Mock conversation with avatar
const initialMessages = [
  {
    id: 1,
    sender: "avatar",
    content:
      "Hello! 👋 I'm your personal emotion companion. I've learned a lot about how you express yourself, and I'm here to help you communicate your feelings. How are you feeling today?",
    time: "Just now",
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

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: inputValue,
      time: "Just now",
    };
    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate avatar typing
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add avatar response
    const avatarResponses = [
      "I can feel the emotion in your words. Based on what you've shared, it sounds like you're experiencing a mix of feelings. Would you like me to help you express this to someone?",
      "That's a beautiful way to feel! I've noticed you often express this emotion through warm colors and flowing patterns. Should I suggest a way to share this with someone special?",
      "I understand. Remember, it's okay to feel this way. Based on your patterns, I think a gentle, reassuring message would work well. Want me to help craft one?",
    ];

    const avatarMessage = {
      id: messages.length + 2,
      sender: "avatar",
      content: avatarResponses[Math.floor(Math.random() * avatarResponses.length)],
      time: "Just now",
    };
    setMessages((prev) => [...prev, avatarMessage]);
    setIsTyping(false);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Avatar</h1>
          <p className="text-slate-500">
            Your personal emotion companion that learns from you
          </p>
        </div>
        <Button variant="outline" size="lg">
          <Settings className="w-5 h-5" />
          Customize Avatar
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <CardContent className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber to-peach flex items-center justify-center shadow-lg shadow-amber/20"
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">HeartSpeak Avatar</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Active & Learning
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Volume2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <RotateCcw className="w-5 h-5" />
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
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "avatar" && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber to-peach flex items-center justify-center mr-2 flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-md ${
                      message.sender === "user"
                        ? "bg-coral text-white rounded-2xl rounded-br-md"
                        : "bg-gradient-to-br from-amber/10 to-peach/10 border border-amber/20 text-foreground rounded-2xl rounded-bl-md"
                    } px-4 py-3`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div
                      className={`flex items-center gap-2 mt-2 ${
                        message.sender === "user"
                          ? "justify-end text-white/70"
                          : "justify-start text-slate-400"
                      }`}
                    >
                      <span className="text-xs">{message.time}</span>
                      {message.sender === "avatar" && (
                        <>
                          <Button variant="ghost" size="icon" className="w-6 h-6">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-6 h-6">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-6 h-6">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber to-peach flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                            className="w-2 h-2 rounded-full bg-slate-400"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-600 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <CardContent className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Mic className="w-5 h-5" />
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Tell me how you're feeling..."
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  size="icon"
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Avatar Status */}
          <Card className="bg-gradient-to-br from-amber/10 to-peach/10 border-amber/20">
            <CardContent className="p-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber to-peach mx-auto mb-4 flex items-center justify-center shadow-xl shadow-amber/30"
              >
                <Bot className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Your Avatar
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Learning your emotional language
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-coral">94%</p>
                  <p className="text-xs text-slate-500">Accuracy</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal">48</p>
                  <p className="text-xs text-slate-500">Patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personality Traits */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-coral" />
                <h3 className="font-semibold text-foreground">
                  Personality Traits
                </h3>
              </div>
              <div className="space-y-3">
                {personalityTraits.map((item) => (
                  <div key={item.trait}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">{item.trait}</span>
                      <span className="text-xs font-medium text-foreground">
                        {item.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-full bg-gradient-to-r from-coral to-peach rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-teal" />
                <h3 className="font-semibold text-foreground">
                  Learning Progress
                </h3>
              </div>
              <div className="space-y-4">
                {learningProgress.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.category}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.patterns} patterns learned
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {item.accuracy}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Avatar Can Help With
              </h3>
              <div className="space-y-2">
                {[
                  { icon: MessageCircle, label: "Compose emotion messages" },
                  { icon: Palette, label: "Suggest patterns" },
                  { icon: Lightbulb, label: "Expression ideas" },
                  { icon: Star, label: "Track your progress" },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-coral/10 transition-colors">
                        <action.icon className="w-4 h-4 text-slate-600 group-hover:text-coral transition-colors" />
                      </div>
                      <span className="text-sm text-slate-600 group-hover:text-foreground transition-colors">
                        {action.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-coral transition-colors" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
