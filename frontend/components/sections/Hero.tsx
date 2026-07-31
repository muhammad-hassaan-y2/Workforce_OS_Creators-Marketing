"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { PhoneCall, Globe, Terminal, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Video, Zap, Activity, Cpu } from "lucide-react";

export default function Hero() {
  const [activeAgentPreview, setActiveAgentPreview] = useState<"caller" | "browser" | "video" | "cli">("caller");

  return (
    <section id="hero" className="relative pt-36 pb-24 md:pt-48 md:pb-36 bg-[#07070A] overflow-hidden">
      {/* Background Ambient Cyber Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[900px] md:h-[900px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-blue-600/15 rounded-full blur-[150px] pointer-events-none animate-orb-1" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-orb-2" />

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Cyber Eyebrow Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#12121A] border border-purple-500/30 shadow-lg shadow-purple-950/40"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-cyber-gradient font-mono">
              AI AGENT OS FOR AGENCIES, CREATORS & REVOPS
            </span>
          </motion.div>

          {/* Headline - Apple-style massive tight tracking */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Your autonomous AI workforce <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-400">
              never stops executing.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Deploy autonomous AI agents that place sales calls, operate browsers, render 4K video shorts, and run terminal pipelines — synchronized as one OS.
          </motion.p>

          {/* Single Primary CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center pt-2"
          >
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="px-9 py-4 text-base shadow-xl shadow-purple-600/30" icon={<ArrowRight className="w-5 h-5" />}>
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
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> SOC2 Type II Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Sub-310ms Neural Voice
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> 4K Video Render Engine
            </span>
          </motion.div>
        </div>

        {/* Hero Interactive Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto rounded-[28px] bg-[#12121A] border border-purple-500/30 p-4 sm:p-6 shadow-2xl shadow-purple-950/40 relative group"
        >
          {/* Window Top Header */}
          <div className="flex items-center justify-between pb-4 px-3 border-b border-[#222232]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-3 text-xs font-mono text-gray-400">orbital-os // multi-agent-runtime-mesh</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                4 AGENTS RUNNING LIVE
              </span>
            </div>
          </div>

          {/* Interactive Agent Tabs inside Dashboard Mockup */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Phone Caller Card */}
            <div 
              onClick={() => setActiveAgentPreview("caller")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeAgentPreview === "caller"
                  ? "bg-[#1A1A26] border-amber-400/50 shadow-lg"
                  : "bg-[#09090D] border-[#222232] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  LIVE CALL
                </span>
              </div>
              <div className="text-xs font-bold text-white">Phone Caller Agent</div>
              <div className="text-[11px] text-gray-400 font-mono mt-1">Qualifying inbound leads (02:45)</div>
            </div>

            {/* AI Video Creation Card */}
            <div 
              onClick={() => setActiveAgentPreview("video")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeAgentPreview === "video"
                  ? "bg-[#1A1A26] border-purple-500/50 shadow-lg"
                  : "bg-[#09090D] border-[#222232] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  RENDERING 88%
                </span>
              </div>
              <div className="text-xs font-bold text-white">AI Video & Content</div>
              <div className="text-[11px] text-gray-400 font-mono mt-1">Rendering 4K Short Video MP4</div>
            </div>

            {/* Browser Control Card */}
            <div 
              onClick={() => setActiveAgentPreview("browser")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeAgentPreview === "browser"
                  ? "bg-[#1A1A26] border-blue-500/50 shadow-lg"
                  : "bg-[#09090D] border-[#222232] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  SCRAPING
                </span>
              </div>
              <div className="text-xs font-bold text-white">Browser Control</div>
              <div className="text-[11px] text-gray-400 font-mono mt-1">Scraping 50 brand sponsors</div>
            </div>

            {/* CLI Ops Card */}
            <div 
              onClick={() => setActiveAgentPreview("cli")}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeAgentPreview === "cli"
                  ? "bg-[#1A1A26] border-emerald-500/50 shadow-lg"
                  : "bg-[#09090D] border-[#222232] hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  EXECUTING
                </span>
              </div>
              <div className="text-xs font-bold text-white">CLI / Ops Agent</div>
              <div className="text-[11px] text-gray-400 font-mono mt-1">Syncing CRM & Slack alerts</div>
            </div>

          </div>

          {/* Active Preview Display Window */}
          <div className="mt-4 p-5 rounded-2xl bg-[#09090D] border border-[#222232] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-[11px] text-gray-400">
              <span className="text-purple-400 font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                ACTIVE AGENT INSPECTOR: {activeAgentPreview.toUpperCase()}
              </span>
              <span className="text-emerald-400">STATUS OK</span>
            </div>

            {activeAgentPreview === "caller" && (
              <div className="space-y-1.5 text-gray-300">
                <div className="text-amber-400 font-bold">&gt; Voice Engine: Neural Sub-310ms Connected</div>
                <div className="italic text-gray-400">"Objection handled: Custom SDR workflow automation vs manual offshore VAs..."</div>
              </div>
            )}

            {activeAgentPreview === "video" && (
              <div className="space-y-1.5 text-gray-300">
                <div className="text-indigo-400 font-bold">&gt; Video Engine: 4K MP4 Asset Render 88%</div>
                <div className="italic text-gray-400">"Generated AI script & captions: Top 5 RevOps Automation Hacks..."</div>
              </div>
            )}

            {activeAgentPreview === "browser" && (
              <div className="space-y-1.5 text-gray-300">
                <div className="text-blue-400">&gt; DOM Navigator: https://linkedin.com/sales/search</div>
                <div className="italic text-gray-400">"Extracted 50 verified contact profiles & auto-submitted Media Kit..."</div>
              </div>
            )}

            {activeAgentPreview === "cli" && (
              <div className="space-y-1.5 text-gray-300">
                <div className="text-emerald-400">&gt; Command: orbital sync --dest hubspot-crm --webhook active</div>
                <div className="italic text-gray-400">"Synced 142 records to HubSpot CRM pipeline in 1.12s..."</div>
              </div>
            )}
          </div>

          {/* Footer Orchestration Status */}
          <div className="mt-4 pt-3 border-t border-[#222232] flex items-center justify-between text-xs text-gray-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Sovereign Cloud Mesh Connected
            </span>
            <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">
              Open Full Dashboard &rarr;
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
