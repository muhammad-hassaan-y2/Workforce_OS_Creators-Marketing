"use client";

import { motion } from "framer-motion";
import { PROOF_METRICS } from "@/lib/constants";

export default function MetricsBar() {
  return (
    <section className="py-20 md:py-28 bg-[#0B0B0F] border-y border-[#1E1E28] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-blue-900/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {PROOF_METRICS.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center space-y-2 group"
            >
              {/* Big Gradient Numerals */}
              <div className="text-4xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 group-hover:scale-105 transition-transform duration-300">
                {metric.value}
              </div>

              <div className="text-base sm:text-lg font-semibold text-white tracking-tight">
                {metric.label}
              </div>

              <div className="text-xs text-[#A1A1AA] max-w-[200px] mx-auto leading-relaxed">
                {metric.subtext}
              </div>

              {/* Code Comment placeholder */}
              {/* [PLACEHOLDER — replace with real data] */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
