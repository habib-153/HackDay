"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "HeartSpeak changed how I connect with my family. They finally understand what I'm feeling.",
    author: "Sarah M.",
    role: "User",
  },
  {
    quote: "The emotion avatar knows exactly what I want to say when I can't find the words.",
    author: "David K.",
    role: "Daily user",
  },
  {
    quote: "Video calls were hard. Now my friends see my emotions in real-time. It's incredible.",
    author: "Emily R.",
    role: "Advocate",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Stories from Our Users
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-slate-200 p-6"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-slate-600 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {testimonial.author[0]}
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{testimonial.author}</p>
                  <p className="text-slate-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
