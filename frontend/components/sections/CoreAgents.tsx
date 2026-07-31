"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AGENTS, EXTENSIBLE_CARD } from "@/lib/constants";
import { PhoneCall, Globe, Terminal, CheckCircle2, ArrowRight, Code2, Cpu, Sparkles } from "lucide-react";

export default function CoreAgents() {
  const [activePreview, setActivePreview] = useState<string>("caller");

  const getAgentIcon = (id: string) => {
    switch (id) {
      case "caller":
        return <PhoneCall className="w-6 h-6 text-purple-600" />;
      case "browser":
        return <Globe className="w-6 h-6 text-blue-600" />;
      case "cli":
        return <Terminal className="w-6 h-6 text-indigo-600" />;
      default:
        return <Cpu className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <section id="agents" className="py-24 md:py-32 bg-[#FAFAFA] border-t border-[#ECECEF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            CORE WORKFORCE SUITE
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B0B0F] leading-tight">
            Specialized AI Agents engineered for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              autonomous agency execution.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            Deploy role-specific agents that handle phone qualification, web research, and backend execution without human intervention.
          </p>
        </div>

        {/* 3 Main Agent Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {AGENTS.map((agent, idx) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[20px] border border-[#ECECEF] p-7 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-5">
                {/* Agent Icon Header */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-xs group-hover:scale-105 transition-transform">
                    {getAgentIcon(agent.id)}
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Agent v2.4
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#0B0B0F] tracking-tight">
                    {agent.name}
                  </h3>
                  <p className="text-xs font-medium text-purple-600 mt-0.5">
                    {agent.tagline}
                  </p>
                </div>

                <p className="text-sm text-[#52525B] leading-relaxed">
                  {agent.description}
                </p>

                {/* 3 Capabilities bullets */}
                <ul className="space-y-2.5 pt-2">
                  {agent.capabilities.map((cap, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2.5 text-xs text-[#0B0B0F]/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stylized Mini Interaction Preview Box */}
              <div className="mt-6 pt-5 border-t border-[#ECECEF]">
                <div className="rounded-xl bg-[#0B0B0F] p-3.5 text-white font-mono text-[11px] space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-1.5 text-[10px]">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Stream
                    </span>
                    <span>{agent.id.toUpperCase()}_LOG</span>
                  </div>

                  {agent.previewType === "call" && agent.previewData.transcript && (
                    <div className="space-y-1 text-gray-300">
                      <div className="text-purple-400 font-semibold">&gt; Sarah (Lead):</div>
                      <div className="italic text-gray-300">"{agent.previewData.transcript[1]?.text}"</div>
                      <div className="text-indigo-400 font-semibold pt-1">&gt; Agent Response:</div>
                      <div className="text-gray-200">"{agent.previewData.transcript[2]?.text}"</div>
                    </div>
                  )}

                  {agent.previewType === "browser" && agent.previewData.actions && (
                    <div className="space-y-1 text-gray-300">
                      {agent.previewData.actions.slice(0, 2).map((act: string, aIdx: number) => (
                        <div key={aIdx} className="text-blue-300">{act}</div>
                      ))}
                    </div>
                  )}

                  {agent.previewType === "cli" && agent.previewData.output && (
                    <div className="space-y-1 text-gray-300">
                      {agent.previewData.output.slice(0, 2).map((out: string, oIdx: number) => (
                        <div key={oIdx} className="text-emerald-300">{out}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4th Distinct "And More / Extensible" Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 rounded-[20px] bg-gradient-to-r from-[#0B0B0F] via-[#141419] to-[#0B0B0F] p-8 text-white border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              <Code2 className="w-4 h-4" />
              {EXTENSIBLE_CARD.badge}
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              {EXTENSIBLE_CARD.title}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {EXTENSIBLE_CARD.description}
            </p>
          </div>

          <a href="#pricing" className="shrink-0">
            <button className="px-6 py-3 rounded-full bg-white text-[#0B0B0F] font-semibold text-sm hover:bg-purple-100 transition-colors flex items-center gap-2 shadow-lg">
              Explore Agent SDK
              <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
