"use client";

import { motion } from "framer-motion";
import { INTEGRATIONS } from "@/lib/constants";
import { Layers, Database, Sparkles } from "lucide-react";

export default function Integrations() {
  return (
    <section className="py-24 md:py-32 bg-[#0B0B0F] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            NATIVE STACK COMPATIBILITY
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Works seamlessly with the stack <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              your agency already runs.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1AA]">
            Connect Millo agents to your existing CRM, dialer infrastructure, ad platforms, and custom backend webhooks in under 30 minutes.
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {INTEGRATIONS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 rounded-[20px] bg-[#141419] border border-[#22222E] hover:border-purple-500/50 hover:bg-[#1A1A22] transition-all duration-300 flex flex-col items-center justify-center text-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-mono font-bold text-purple-400 text-sm group-hover:scale-110 transition-transform">
                {item.name.substring(0, 2).toUpperCase()}
              </div>

              <div className="text-sm font-bold text-white tracking-tight">
                {item.name}
              </div>

              <div className="text-[11px] font-mono text-gray-500">
                {item.category}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Webhooks Banner */}
        <div className="mt-12 p-6 rounded-[20px] bg-[#141419]/60 border border-[#22222E] text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400 text-left font-mono">
            Need a proprietary integration? Connect via REST API or WebSocket bus.
          </div>
          <a href="#pricing">
            <span className="text-xs font-semibold text-purple-400 hover:text-purple-300 underline font-mono cursor-pointer shrink-0">
              View Developer API Docs &rarr;
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
