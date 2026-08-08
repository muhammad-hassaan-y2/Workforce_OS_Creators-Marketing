"use client";

import { motion } from "framer-motion";
import { AGENTS, EXTENSIBLE_CARD } from "@/lib/constants";
import { PhoneCall, Globe, Terminal, CheckCircle2, ArrowRight, Code2, Cpu, Sparkles } from "lucide-react";

export default function CoreAgents() {
  const getAgentIcon = (id: string) => {
    switch (id) {
      case "caller":
        return <PhoneCall className="w-6 h-6 text-amber-400" />;
      case "browser":
        return <Globe className="w-6 h-6 text-blue-400" />;
      case "cli":
        return <Terminal className="w-6 h-6 text-emerald-400" />;
      default:
        return <Cpu className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section id="agents" className="py-24 md:py-32 bg-[#090814] text-white border-t border-[#1F1A3A] relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            CORE WORKFORCE SUITE
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Specialized AI Agents engineered for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
              autonomous agency execution.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
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
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#120E2B]/80 backdrop-blur-xl rounded-3xl border border-[#26204D] p-7 shadow-2xl hover:border-amber-500/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-5">
                {/* Agent Icon Header */}
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#1A153B] border border-[#322A63] shadow-md group-hover:scale-105 transition-transform">
                    {getAgentIcon(agent.id)}
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Agent v2.4
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-xs font-medium text-amber-400 mt-0.5 font-mono">
                    {agent.tagline}
                  </p>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {agent.description}
                </p>

                {/* 3 Capabilities bullets */}
                <ul className="space-y-2.5 pt-2">
                  {agent.capabilities.map((cap, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stylized Mini Interaction Preview Box */}
              <div className="mt-6 pt-5 border-t border-[#231E4D]">
                <div className="rounded-2xl bg-[#090716] border border-[#1E193C] p-4 font-mono text-[11px] space-y-2 shadow-inner">
                  <div className="flex items-center justify-between border-b border-[#1E193C] pb-2 text-[10px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Stream
                    </span>
                    <span className="text-gray-500">{agent.id.toUpperCase()}_LOG</span>
                  </div>

                  {agent.previewType === "call" && agent.previewData.transcript && (
                    <div className="space-y-1 text-gray-300">
                      <div className="text-amber-400 font-semibold">&gt; Sarah (Lead):</div>
                      <div className="italic text-gray-300">"{agent.previewData.transcript[1]?.text}"</div>
                      <div className="text-orange-400 font-semibold pt-1">&gt; Agent Response:</div>
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

        {/* Extensible Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 rounded-3xl bg-gradient-to-r from-[#140F30] via-[#1A143D] to-[#140F30] p-8 text-white border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
              <Code2 className="w-4 h-4 text-amber-400" />
              {EXTENSIBLE_CARD.badge}
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              {EXTENSIBLE_CARD.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {EXTENSIBLE_CARD.description}
            </p>
          </div>

          <a href="/dashboard" className="shrink-0">
            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-red-500 text-black font-extrabold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg">
              <span>Explore Agent SDK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
