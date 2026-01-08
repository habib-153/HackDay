"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Search,
  Book,
  Video,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Mail,
  Heart,
  Palette,
  Bot,
  Phone,
  ExternalLink,
  Play,
} from "lucide-react";

// FAQ categories
const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    faqs: [
      {
        question: "How do I create my first emotion message?",
        answer:
          "Go to the Chat section, click on the heart icon to open the Emotion Composer. Select your primary emotion, adjust the intensity, and optionally add context. The AI will craft a message that authentically represents your feelings.",
      },
      {
        question: "What is the AI Avatar?",
        answer:
          "Your AI Avatar is a personal companion that learns your emotional patterns and communication style. The more you use HeartSpeak, the better it understands how you express yourself, helping you communicate more effectively.",
      },
      {
        question: "How does emotion recognition work in video calls?",
        answer:
          "During video calls, our AI analyzes your facial expressions every 2-3 seconds using advanced emotion recognition. It translates detected emotions into natural language that appears on the other person's screen, helping them understand your feelings.",
      },
    ],
  },
  {
    id: "patterns",
    title: "Pattern Language",
    icon: Palette,
    faqs: [
      {
        question: "How do I create an emotion pattern?",
        answer:
          "Navigate to Patterns, click 'Create Pattern', and use the drawing canvas to create your visual representation. Choose colors, add shapes, and associate it with an emotion. The AI will learn to recognize your pattern in future conversations.",
      },
      {
        question: "Can others understand my patterns?",
        answer:
          "Yes! When you send a pattern to someone, the AI interprets it based on your personal pattern language and provides a translation that helps the recipient understand the emotion you're expressing.",
      },
    ],
  },
  {
    id: "video-calls",
    title: "Video Calls",
    icon: Video,
    faqs: [
      {
        question: "How accurate is the emotion detection?",
        answer:
          "Our emotion recognition achieves approximately 85-95% accuracy for common emotions. It works best with good lighting and a clear view of your face. The system continuously improves as you use it.",
      },
      {
        question: "Is my video data stored?",
        answer:
          "No. Video frames are processed in real-time and immediately discarded after emotion analysis. We never store your video footage or facial images. Your privacy is our top priority.",
      },
    ],
  },
  {
    id: "avatar",
    title: "AI Avatar",
    icon: Bot,
    faqs: [
      {
        question: "How does the avatar learn from me?",
        answer:
          "Your avatar learns from your patterns, messages, and emotional expressions over time. It analyzes your communication style, preferred expressions, and emotional patterns to provide personalized assistance.",
      },
      {
        question: "Can I reset my avatar's learning?",
        answer:
          "Yes, you can reset your avatar's learned patterns in Settings > AI Avatar. Keep in mind this will remove all personalization, and your avatar will need to relearn your preferences.",
      },
    ],
  },
];

// Video tutorials
const tutorials = [
  {
    title: "Getting Started with HeartSpeak",
    duration: "5:30",
    thumbnail: "gradient-coral",
  },
  {
    title: "Creating Your First Pattern",
    duration: "3:45",
    thumbnail: "gradient-teal",
  },
  {
    title: "Emotion Video Calls Explained",
    duration: "4:20",
    thumbnail: "gradient-lavender",
  },
  {
    title: "Training Your AI Avatar",
    duration: "6:15",
    thumbnail: "gradient-amber",
  },
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
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-peach mx-auto mb-4 flex items-center justify-center shadow-lg shadow-coral/20">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          How can we help you?
        </h1>
        <p className="text-slate-500 mb-6">
          Find answers, watch tutorials, or reach out to our support team
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="pl-12 h-14 text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Book,
            title: "User Guide",
            description: "Complete documentation",
            color: "coral",
          },
          {
            icon: Video,
            title: "Video Tutorials",
            description: "Learn step by step",
            color: "teal",
          },
          {
            icon: MessageCircle,
            title: "Community",
            description: "Join discussions",
            color: "lavender",
          },
          {
            icon: Mail,
            title: "Contact Support",
            description: "Get personal help",
            color: "amber",
          },
        ].map((link, index) => (
          <motion.div
            key={link.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="cursor-pointer h-full">
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-${link.color}/10 flex items-center justify-center mb-4`}
                >
                  <link.icon className={`w-6 h-6 text-${link.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {link.title}
                </h3>
                <p className="text-sm text-slate-500">{link.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Frequently Asked Questions
              </h2>

              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      activeCategory === category.id
                        ? "bg-coral text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.title}</span>
                  </button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-3">
                {faqCategories
                  .find((c) => c.id === activeCategory)
                  ?.faqs.map((faq, index) => {
                    const faqId = `${activeCategory}-${index}`;
                    return (
                      <motion.div
                        key={faqId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(faqId)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium text-foreground pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                              expandedFaq === faqId ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {expandedFaq === faqId && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4"
                          >
                            <p className="text-slate-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Video Tutorials */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Video Tutorials</h3>
                <Button variant="ghost" size="sm">
                  View All
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {tutorials.map((tutorial, index) => (
                  <motion.div
                    key={tutorial.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div
                      className={`w-16 h-12 rounded-lg bg-${tutorial.thumbnail} flex items-center justify-center relative overflow-hidden`}
                      style={{
                        background:
                          tutorial.thumbnail === "gradient-coral"
                            ? "linear-gradient(135deg, #F87171, #FBBF24)"
                            : tutorial.thumbnail === "gradient-teal"
                            ? "linear-gradient(135deg, #14B8A6, #5EEAD4)"
                            : tutorial.thumbnail === "gradient-lavender"
                            ? "linear-gradient(135deg, #A78BFA, #F0ABFC)"
                            : "linear-gradient(135deg, #FBBF24, #FB923C)",
                      }}
                    >
                      <Play className="w-5 h-5 text-white group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {tutorial.title}
                      </p>
                      <p className="text-xs text-slate-500">{tutorial.duration}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-gradient-to-br from-coral/10 to-peach/10 border-coral/20">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral to-peach mx-auto mb-4 flex items-center justify-center shadow-lg shadow-coral/20">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Still need help?
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Our support team is here to assist you with any questions
              </p>
              <Button variant="primary" className="w-full">
                <Mail className="w-5 h-5" />
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Useful Links */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Useful Links
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                  { label: "Accessibility", href: "#" },
                  { label: "System Status", href: "#" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-coral transition-colors"
                  >
                    <span className="text-sm">{link.label}</span>
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
