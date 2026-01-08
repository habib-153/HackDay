"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Video, Palette, MessageCircleHeart, Bot, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Emotion Video Calls",
    description:
      "Real-time facial expression analysis during video calls. AI translates your emotions into text for the other person, creating deeper understanding.",
    color: "coral",
    gradient: "from-coral to-peach",
  },
  {
    icon: Palette,
    title: "Pattern Language",
    description:
      "Create your personal visual vocabulary. Draw patterns, choose colors, and let AI learn your unique emotional expressions.",
    color: "teal",
    gradient: "from-teal-dark to-teal",
  },
  {
    icon: MessageCircleHeart,
    title: "Heart-to-Heart Chat",
    description:
      "Select emotions, intensity, and context. AI crafts authentic messages that truly convey your feelings to loved ones.",
    color: "lavender",
    gradient: "from-lavender to-rose",
  },
  {
    icon: Bot,
    title: "Personal Avatar",
    description:
      "An AI companion that learns your emotional patterns, suggests expressions, and becomes your authentic emotional voice.",
    color: "amber",
    gradient: "from-amber to-peach",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-coral uppercase tracking-wider mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Four Ways to{" "}
            <span className="text-gradient-coral">Express Yourself</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            HeartSpeak provides multiple channels for emotional expression, each
            powered by advanced AI that learns your unique communication style.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card
                variant="bordered"
                hover
                className="h-full group overflow-hidden relative"
              >
                {/* Gradient Accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                />

                <CardContent className="p-8 relative">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    style={{
                      boxShadow: `0 10px 30px -10px var(--${feature.color})`,
                    }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-sm font-medium text-coral group-hover:gap-3 transition-all duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

