"use client";

import { motion } from "framer-motion";
import { Video, Palette, MessageSquare, Bot } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Emotion Video Calls",
    description: "Real-time facial expression analysis during video calls with AI-powered emotion translation.",
  },
  {
    icon: Palette,
    title: "Pattern Language",
    description: "Create personal visual patterns that AI learns to interpret as your unique emotional expressions.",
  },
  {
    icon: MessageSquare,
    title: "Heart-to-Heart Chat",
    description: "Select emotions and context, let AI craft authentic messages that convey your true feelings.",
  },
  {
    icon: Bot,
    title: "Personal Avatar",
    description: "AI companion that learns your patterns and becomes your authentic emotional voice.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Four Ways to Express Yourself
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Multiple channels for emotional expression, each powered by AI that understands you.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
