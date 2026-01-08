"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary-subtle border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              SDG 3: Good Health & Wellbeing
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Communicate
              <br />
              <span className="text-primary">Without Words</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              AI-powered platform that transforms facial expressions and emotions 
              into meaningful communication for speech-impaired individuals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signin?mode=signup">
                <Button variant="primary" size="lg">
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  <Play className="w-4 h-4" />
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-slate-100">
              {[
                { value: "Real-time", label: "Analysis" },
                { value: "50+", label: "Emotions" },
                { value: "100%", label: "Private" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square max-w-lg mx-auto relative">
              {/* Main visual container */}
              <div className="absolute inset-0 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                {/* Video call mockup */}
                <div className="absolute inset-4 bg-slate-900 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white/60 text-sm">Emotion-aware video calling</p>
                  </div>
                </div>
                
                {/* Emotion detection card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-6 right-6 bg-white rounded-md shadow-lg p-3 border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-medium text-slate-600">Detected</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Happy • 92%</p>
                  <p className="text-xs text-slate-500 mt-1">Feeling positive and engaged</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
