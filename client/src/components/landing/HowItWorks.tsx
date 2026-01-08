"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Capture",
    description: "Express through camera, drawings, or emotion selection.",
  },
  {
    number: "02",
    title: "Analyze",
    description: "AI understands your expressions in real-time.",
  },
  {
    number: "03",
    title: "Translate",
    description: "Feelings transformed into natural messages.",
  },
  {
    number: "04",
    title: "Connect",
    description: "Share authentic emotions with loved ones.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            From Expression to Connection
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            A seamless journey powered by empathetic AI.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary text-white font-bold text-sm mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Connection line (desktop only) */}
        <div className="hidden md:block relative mt-[-140px] mb-8 mx-auto max-w-3xl">
          <div className="h-px bg-slate-200"></div>
        </div>
      </div>
    </section>
  );
}
