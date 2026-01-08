"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Communicate Differently?
          </h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            Join thousands who discovered a new way to connect. 
            Your voice matters, even without words.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/signin?mode=signup">
              <Button variant="primary" size="lg">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Free to start · No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
