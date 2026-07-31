"use client";

import { motion } from "framer-motion";
import { AGITATION_STATS } from "@/lib/constants";
import { AlertCircle, Clock, TrendingUp, Users } from "lucide-react";

export default function ProblemAgitation() {
  return (
    <section className="py-24 md:py-32 bg-[#0B0B0F] relative overflow-hidden">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e0a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            THE SDR CAPACITY BOTTLENECK
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Human SDRs spend 60%+ of their day <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-indigo-400">
              on admin, not selling.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            Outbound agencies are caught between rising headcount costs and decaying lead response times. Brittle automation scripts break constantly, while manual lead enrichment kills deal momentum.
          </p>
        </div>

        {/* Agitation Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AGITATION_STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 rounded-[20px] bg-[#141419] border border-[#22222E] hover:border-purple-500/40 transition-all duration-300 group hover:-translate-y-1 relative"
            >
              {/* Gradient Accent Glow on Hover */}
              <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="text-5xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
                  {stat.value}
                </div>
                
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  {stat.label}
                </h3>

                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* Code Comment tag indicating placeholder data */}
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-gray-500">
                {/* [PLACEHOLDER — replace with real data] */}
                Data source: Industry RevOps Benchmark 2025
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
