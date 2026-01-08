"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Search,
  Book,
  Video,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Mail,
  Palette,
  Bot,
  Play,
  ExternalLink,
} from "lucide-react";

const faqCategories = [
  {
    id: "getting-started", title: "Getting Started", icon: Book,
    faqs: [
      { question: "How do I create my first emotion message?", answer: "Go to Chat, click the heart icon to open the Emotion Composer. Select your emotion, adjust intensity, and optionally add context. The AI will craft your message." },
      { question: "What is the AI Avatar?", answer: "Your AI Avatar is a personal companion that learns your emotional patterns and communication style to help you express yourself better." },
      { question: "How does emotion recognition work?", answer: "During video calls, our AI analyzes facial expressions every 2-3 seconds and translates detected emotions into natural language." },
    ],
  },
  {
    id: "patterns", title: "Patterns", icon: Palette,
    faqs: [
      { question: "How do I create an emotion pattern?", answer: "Navigate to Patterns, click 'Create Pattern', use the drawing canvas, choose colors and shapes, then associate it with an emotion." },
      { question: "Can others understand my patterns?", answer: "Yes! When you send a pattern, the AI interprets it based on your personal pattern language and provides a translation." },
    ],
  },
  {
    id: "video-calls", title: "Video Calls", icon: Video,
    faqs: [
      { question: "How accurate is emotion detection?", answer: "Our recognition achieves 85-95% accuracy for common emotions. It works best with good lighting and clear face visibility." },
      { question: "Is my video data stored?", answer: "No. Video frames are processed in real-time and immediately discarded. We never store video footage or facial images." },
    ],
  },
  {
    id: "avatar", title: "AI Avatar", icon: Bot,
    faqs: [
      { question: "How does the avatar learn?", answer: "Your avatar learns from your patterns, messages, and expressions over time, analyzing your communication style and preferences." },
      { question: "Can I reset my avatar's learning?", answer: "Yes, you can reset in Settings > AI Avatar. Note that this removes all personalization." },
    ],
  },
];

const tutorials = [
  { title: "Getting Started with HeartSpeak", duration: "5:30", color: "#10B981" },
  { title: "Creating Your First Pattern", duration: "3:45", color: "#3B82F6" },
  { title: "Emotion Video Calls Explained", duration: "4:20", color: "#8B5CF6" },
  { title: "Training Your AI Avatar", duration: "6:15", color: "#F59E0B" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-md bg-primary/10 mx-auto mb-3 flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">How can we help?</h1>
        <p className="text-sm text-slate-500 mb-4">Find answers, watch tutorials, or contact support</p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for help..." className="pl-9 h-10" />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Book, title: "User Guide", desc: "Documentation", color: "text-primary" },
          { icon: Video, title: "Tutorials", desc: "Step by step", color: "text-blue-500" },
          { icon: MessageSquare, title: "Community", desc: "Join discussions", color: "text-purple-500" },
          { icon: Mail, title: "Support", desc: "Get help", color: "text-amber-500" },
        ].map((link) => (
          <Card key={link.title} hover className="cursor-pointer">
            <CardContent className="p-4">
              <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center mb-3">
                <link.icon className={`w-4 h-4 ${link.color}`} />
              </div>
              <h3 className="font-medium text-slate-900 text-sm mb-0.5">{link.title}</h3>
              <p className="text-xs text-slate-500">{link.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-medium text-slate-900 mb-4">FAQ</h2>
              
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                {faqCategories.map((category) => (
                  <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors text-sm ${activeCategory === category.id ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    <category.icon className="w-4 h-4" />
                    <span>{category.title}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {faqCategories.find((c) => c.id === activeCategory)?.faqs.map((faq, index) => {
                  const faqId = `${activeCategory}-${index}`;
                  return (
                    <div key={faqId} className="border border-slate-200 rounded-md overflow-hidden">
                      <button onClick={() => toggleFaq(faqId)} className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-medium text-slate-900 pr-4">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expandedFaq === faqId ? "rotate-180" : ""}`} />
                      </button>
                      {expandedFaq === faqId && (
                        <div className="px-3 pb-3">
                          <p className="text-sm text-slate-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-900">Tutorials</h3>
                <Button variant="ghost" size="sm" className="text-xs"><ExternalLink className="w-3 h-3" />All</Button>
              </div>
              <div className="space-y-2">
                {tutorials.map((tutorial) => (
                  <div key={tutorial.title} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors group">
                    <div className="w-12 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: tutorial.color }}>
                      <Play className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{tutorial.title}</p>
                      <p className="text-xs text-slate-500">{tutorial.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-md bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">Need help?</h3>
              <p className="text-xs text-slate-500 mb-3">Our team is here to assist</p>
              <Button variant="primary" className="w-full"><Mail className="w-4 h-4" />Contact Support</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-slate-900 mb-3">Useful Links</h3>
              <div className="space-y-1">
                {["Privacy Policy", "Terms of Service", "Accessibility", "System Status"].map((link) => (
                  <a key={link} href="#" className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-sm text-slate-600 hover:text-primary transition-colors">
                    <span>{link}</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
