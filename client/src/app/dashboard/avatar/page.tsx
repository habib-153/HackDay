"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Send,
  Sparkles,
  Heart,
  Brain,
  Users,
  MessageCircle,
  Lightbulb,
  RefreshCw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const DEMO_SUGGESTIONS = [
  "I'm thinking of you and wanted to reach out with some warmth today.",
  "Your kindness means so much to me - thank you for being you.",
  "I hope this message finds you in good spirits. You've been on my mind.",
  "Sending you positive thoughts and hoping today treats you well.",
  "Just wanted you to know how much I appreciate having you in my life.",
];

const CONTACTS = [
  { id: "1", name: "Sarah Johnson", relationship: "Friend", avatar: "S", recentMood: "Happy" },
  { id: "2", name: "Michael Chen", relationship: "Family", avatar: "M", recentMood: "Thoughtful" },
  { id: "3", name: "Emma Williams", relationship: "Friend", avatar: "E", recentMood: "Peaceful" },
];

const QUICK_PROMPTS = [
  "Say thank you",
  "Share excitement",
  "Express concern",
  "Send encouragement",
  "Show gratitude",
  "Comfort them",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  emotion?: string;
}

export default function AvatarPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your HeartSpeak AI Assistant. I can help you express your emotions to loved ones through thoughtful messages. Who would you like to connect with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContact, setSelectedContact] = useState<typeof CONTACTS[0] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateResponse = (userInput: string): Message => {
    const lowered = userInput.toLowerCase();

    // Emotional responses
    if (lowered.includes("thank") || lowered.includes("grateful")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "That's wonderful! Expressing gratitude strengthens connections. Here are some heartfelt ways to say thank you:",
        timestamp: new Date(),
        suggestions: [
          "Your kindness touches my heart deeply. Thank you for everything.",
          "I'm so grateful to have you in my life. You make everything better.",
          "Words can't express how thankful I am. Your support means the world.",
        ],
        emotion: "grateful",
      };
    }

    if (lowered.includes("sad") || lowered.includes("down") || lowered.includes("upset")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "I understand you're going through a difficult time. It's okay to share these feelings. Here are some ways to open up:",
        timestamp: new Date(),
        suggestions: [
          "I'm having a hard day and could use some support from you.",
          "I wanted to share that I'm feeling down. Your presence helps.",
          "Things have been tough lately. Thank you for being someone I can turn to.",
        ],
        emotion: "sad",
      };
    }

    if (lowered.includes("happy") || lowered.includes("excited") || lowered.includes("great")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "That's amazing! Sharing joy multiplies it. Here's how you can spread that happiness:",
        timestamp: new Date(),
        suggestions: [
          "I'm so excited and had to share this moment with you!",
          "Life feels wonderful right now, and you're part of why!",
          "Something great happened and you were the first person I wanted to tell!",
        ],
        emotion: "happy",
      };
    }

    if (lowered.includes("miss") || lowered.includes("thinking")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "Missing someone shows how much they mean to you. Here are heartfelt ways to let them know:",
        timestamp: new Date(),
        suggestions: [
          "You've been on my mind all day. I miss our time together.",
          "Distance only makes me appreciate you more. Thinking of you.",
          "I find myself smiling remembering our moments. Miss you.",
        ],
        emotion: "loving",
      };
    }

    if (lowered.includes("encourage") || lowered.includes("support")) {
      return {
        id: Date.now().toString(),
        role: "assistant",
        content: "Encouragement can make all the difference! Here are some uplifting messages:",
        timestamp: new Date(),
        suggestions: [
          "I believe in you completely. You've got this!",
          "Remember how strong you are. I'm cheering for you always.",
          "Whatever happens, know that I'm proud of you and here for you.",
        ],
        emotion: "hopeful",
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: `I can help you express that! Based on what you've shared, here are some suggestions${selectedContact ? ` for ${selectedContact.name}` : ""}:`,
      timestamp: new Date(),
      suggestions: DEMO_SUGGESTIONS.slice(0, 3),
    };
  };

  const handleSend = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(messageText);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Sidebar */}
      <div className="w-72 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900">AI Avatar</h1>
          <p className="text-sm text-slate-500">Your communication assistant</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { icon: MessageCircle, label: "Messages", value: "156" },
            { icon: Heart, label: "Sent", value: "42" },
            { icon: Users, label: "Contacts", value: "8" },
            { icon: Sparkles, label: "AI Helps", value: "89" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 text-center">
                <stat.icon className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contacts */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Send to:</h3>
          <div className="space-y-2">
            {CONTACTS.map((contact) => (
              <Card
                key={contact.id}
                className={`cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id ? "border-primary bg-primary/5" : "hover:border-slate-300"
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-sm">
                    {contact.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">{contact.name}</p>
                    <p className="text-xs text-slate-500">{contact.relationship}</p>
                  </div>
                  {selectedContact?.id === contact.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Quick prompts:</h3>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-2.5 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium text-slate-900">HeartSpeak Assistant</h2>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <Brain className="w-3 h-3" /> AI-powered • Always here to help
              </p>
            </div>
          </div>
          {selectedContact && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <span className="text-sm text-primary">
                Writing to: {selectedContact.name}
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${msg.role === "user" ? "order-2" : ""}`}>
                {msg.role === "assistant" ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-100">
                      <p className="text-sm text-slate-800">{msg.content}</p>
                    </div>
                    
                    {msg.suggestions && (
                      <div className="space-y-2 ml-2">
                        {msg.suggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-r from-primary/10 to-teal-50 rounded-lg p-3 border border-primary/20"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-slate-700 flex-1">&quot;{suggestion}&quot;</p>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleCopy(suggestion, `${msg.id}-${i}`)}
                                >
                                  {copiedId === `${msg.id}-${i}` ? (
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                variant="primary"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => handleCopy(suggestion, `${msg.id}-${i}`)}
                              >
                                <Send className="w-3 h-3 mr-1" /> Use This
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ThumbsDown className="w-3.5 h-3.5 text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-primary text-white rounded-2xl rounded-br-sm p-4">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-500">
              Tell me how you&apos;re feeling or what you want to say, and I&apos;ll help craft the perfect message.
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message or describe your feelings..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button variant="primary" onClick={() => handleSend()} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
