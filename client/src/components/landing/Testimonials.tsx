"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "HeartSpeak changed how I connect with my family. For the first time, they truly understand what I'm feeling without me struggling to type everything.",
    author: "Sarah M.",
    role: "User since 2024",
    avatar: "S",
    gradient: "from-coral to-peach",
  },
  {
    quote:
      "The emotion avatar knows me better than I know myself sometimes. It suggests exactly what I want to say when I can't find the words.",
    author: "David K.",
    role: "Daily user",
    avatar: "D",
    gradient: "from-teal-dark to-teal",
  },
  {
    quote:
      "Video calls were always hard for me. Now, my friends can see my emotions in real-time through the AI translations. It's like magic.",
    author: "Emily R.",
    role: "Communication advocate",
    avatar: "E",
    gradient: "from-lavender to-rose",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-lavender uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Stories from the{" "}
            <span className="text-gradient-warm">Heart</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Real experiences from people who found their voice through HeartSpeak.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card variant="bordered" className="h-full relative">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-6">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>

                <CardContent className="p-8 pt-10">
                  <p className="text-slate-600 leading-relaxed mb-8 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

