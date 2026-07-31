"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import VideoModal from "../VideoModal";
import { PhoneCall, Globe, Terminal, Play, ArrowRight, Activity, Sparkles, CheckCircle2, ShieldCheck, Video } from "lucide-react";

export default function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"caller" | "browser" | "cli">("caller");

  return (
    <section id="hero" className="relative pt-36 pb-24 md:pt-44 md:pb-32 bg-[#0B0B0F] overflow-hidden">
      {/* Background Ambient Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-orb-1" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-[120px] pointer-events-none animate-orb-2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Eyebrow Label */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141419] border border-[#22222E] shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              AI AGENTS FOR AGENCIES, CREATORS & REVOPS
            </span>
          </motion.div>

          {/* Headline - Apple-style massive tight tracking */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]"
          >
            Your autonomous workforce <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
              never stops executing.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Deploy AI agents that place sales calls, operate real browsers, negotiate creator brand deals, and run terminal pipelines — synchronized as one OS.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center pt-2"
          >
            <Link href="/dashboard">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Launch Agent OS Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Micro trust indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> SOC2 Type II Certified
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Sub-350ms Voice Engine
            </span>
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-indigo-400" /> Creator & Agency Ready
            </span>
          </motion.div>
        </div>

        {/* Hero Interactive Product Visual / Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 max-w-5xl mx-auto rounded-[24px] bg-[#141419] border border-[#22222E] p-3 sm:p-5 shadow-2xl shadow-purple-950/20 relative group"
        >
          {/* Top Window Header */}
          <div className="flex items-center justify-between pb-3 px-3 border-b border-[#22222E]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-3 text-xs font-mono text-gray-400">orbital-os // multi-agent-runtime</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM ACTIVE
              </span>
            </div>
          </div>

          {/* Dashboard Main View */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Phone Caller Agent Card */}
            <div 
              onClick={() => setActiveTab("caller")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === "caller"
                  ? "bg-[#1C1C24] border-purple-500/50 shadow-lg shadow-purple-500/10"
                  : "bg-[#0E0E13] border-[#22222E] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Phone Caller Agent</div>
                    <div className="text-[11px] text-gray-400 font-mono">ID: #CALL-8092</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  LIVE CALL
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-400 bg-[#09090D] p-2 rounded-lg font-mono">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-semibold">On call — 02:14</span>
                </div>
                <div className="bg-[#09090D] p-2.5 rounded-lg text-gray-300 space-y-1 font-mono text-[11px]">
                  <p className="text-purple-400 font-semibold">&gt; Transcript snippet:</p>
                  <p className="italic">"We can automate sponsor pitches and lead enrichment..."</p>
                </div>
              </div>
            </div>

            {/* Browser Control Agent Card */}
            <div 
              onClick={() => setActiveTab("browser")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === "browser"
                  ? "bg-[#1C1C24] border-blue-500/50 shadow-lg shadow-blue-500/10"
                  : "bg-[#0E0E13] border-[#22222E] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Browser Control Agent</div>
                    <div className="text-[11px] text-gray-400 font-mono">ID: #SCRAPE-412</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono">
                  NAVIGATING
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-400 bg-[#09090D] p-2 rounded-lg font-mono">
                  <span>Task:</span>
                  <span className="text-blue-400 font-semibold">Sponsor Scrape & Post</span>
                </div>
                <div className="bg-[#09090D] p-2.5 rounded-lg text-gray-300 space-y-1 font-mono text-[11px]">
                  <p className="text-blue-400 font-semibold">&gt; Current Action:</p>
                  <p className="italic">"Submitting media kit to 25 Brand Manager forms..."</p>
                </div>
              </div>
            </div>

            {/* CLI / Ops Agent Card */}
            <div 
              onClick={() => setActiveTab("cli")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === "cli"
                  ? "bg-[#1C1C24] border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                  : "bg-[#0E0E13] border-[#22222E] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">CLI / Ops Agent</div>
                    <div className="text-[11px] text-gray-400 font-mono">ID: #EXEC-991</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                  RUNNING
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-400 bg-[#09090D] p-2 rounded-lg font-mono">
                  <span>Job:</span>
                  <span className="text-emerald-400 font-semibold">Media Kit & CRM Sync</span>
                </div>
                <div className="bg-[#09090D] p-2.5 rounded-lg text-gray-300 space-y-1 font-mono text-[11px]">
                  <p className="text-emerald-400 font-semibold">&gt; Command:</p>
                  <p className="italic">"orbital sync --crm hubspot --status sponsor-closed"</p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Orchestration Status Strip */}
          <div className="mt-4 p-3 rounded-xl bg-[#0B0B0F] border border-[#22222E] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Multi-Agent Mesh Handoff: Active</span>
            </div>
            <div className="font-mono text-gray-400">
              Sync Latency: <span className="text-emerald-400">12ms</span> | Memory: <span className="text-purple-400">Optimal</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Video Modal Trigger */}
      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
    </section>
  );
}
