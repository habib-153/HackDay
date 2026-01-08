"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  MessageCircleHeart,
  Video,
  Palette,
  Bot,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-rose/30 to-lavender-soft/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-amber-soft/40 to-peach/30 blur-3xl"
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[15%] hidden lg:block"
      >
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-coral/10 flex items-center justify-center">
          <Video className="w-6 h-6 text-coral" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-48 right-[12%] hidden lg:block"
      >
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-teal/10 flex items-center justify-center">
          <Palette className="w-6 h-6 text-teal" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-[20%] hidden lg:block"
      >
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-lavender/10 flex items-center justify-center">
          <MessageCircleHeart className="w-6 h-6 text-lavender" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-[18%] hidden lg:block"
      >
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-amber/10 flex items-center justify-center">
          <Bot className="w-6 h-6 text-amber" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-coral" />
          <span className="text-sm font-medium text-slate-600">
            AI-Powered Emotional Communication
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
        >
          Speak from the{" "}
          <span className="relative inline-block">
            <span className="text-gradient-warm">Heart</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -right-3 -top-2"
            >
              <Heart className="w-8 h-8 text-coral fill-coral" />
            </motion.span>
          </span>
          <br />
          <span className="text-slate-500">Without Words</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Transform your expressions, gestures, and emotions into meaningful
          communication. HeartSpeak AI helps speech-impaired individuals connect
          deeper than ever before.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signin?mode=signup">
            <Button variant="primary" size="xl" className="min-w-[200px]">
              Start Speaking
              <Heart className="w-5 h-5 fill-current" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="xl" className="min-w-[200px]">
              See How It Works
            </Button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        >
          {[
            { value: "50+", label: "Emotions" },
            { value: "Real-time", label: "Analysis" },
            { value: "100%", label: "Privacy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gradient-coral">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

