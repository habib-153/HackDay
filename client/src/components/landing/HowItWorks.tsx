"use client";

import { motion } from "framer-motion";
import { Camera, Brain, MessageSquare, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Capture",
    description:
      "Express yourself through camera, drawings, or emotion selection. No need for words.",
    color: "coral",
  },
  {
    number: "02",
    icon: Brain,
    title: "Analyze",
    description:
      "Our AI understands your expressions, patterns, and emotional context in real-time.",
    color: "teal",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Translate",
    description:
      "Your feelings are transformed into natural, heartfelt messages that truly represent you.",
    color: "lavender",
  },
  {
    number: "04",
    icon: Heart,
    title: "Connect",
    description:
      "Share authentic emotions with loved ones and build deeper, more meaningful relationships.",
    color: "amber",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 bg-slate-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block text-sm font-semibold text-teal-dark uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            From Expression to{" "}
            <span className="text-gradient-warm">Connection</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            A seamless journey from your heart to theirs, powered by empathetic AI
            that truly understands.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-coral via-teal to-lavender opacity-20" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center relative"
              >
                {/* Number Badge */}
                <div className="relative inline-block mb-6">
                  <div
                    className={`w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform`}
                    style={{
                      boxShadow: `0 10px 40px -15px var(--${step.color})`,
                    }}
                  >
                    <step.icon
                      className="w-8 h-8"
                      style={{ color: `var(--${step.color})` }}
                    />
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, var(--${step.color}) 0%, var(--${step.color}-dark, var(--${step.color})) 100%)`,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

