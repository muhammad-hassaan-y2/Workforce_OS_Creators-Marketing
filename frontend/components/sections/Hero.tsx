"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  Globe, 
  Video, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Zap,
  Key,
  Cpu,
  Quote
} from "lucide-react";

export default function Hero() {
  const [activeNode, setActiveNode] = useState<string>("center");

  const nodes = [
    {
      id: "guardrails",
      title: "Least Privilege",
      subtitle: "Grant minimum access for every agent task — nothing more.",
      icon: Lock,
      position: "top-0 left-1/2 -translate-x-1/2 -translate-y-6"
    },
    {
      id: "voice",
      title: "Just-in-Time Voice",
      subtitle: "Sub-310ms neural voice calls tailored to the lead at hand.",
      icon: Clock,
      position: "top-1/4 -left-12 sm:-left-20"
    },
    {
      id: "browser",
      title: "Universal Browser",
      subtitle: "One autonomous engine for all web portals & brand deal scraping.",
      icon: Globe,
      position: "top-1/4 -right-12 sm:-right-20"
    },
    {
      id: "video",
      title: "Verified AI Video",
      subtitle: "Automated 4K short video scriptwriting & MP4 rendering.",
      icon: Video,
      position: "bottom-10 -left-8 sm:-left-16"
    },
    {
      id: "audit",
      title: "Auditable CLI Ops",
      subtitle: "Every agent action is logged, traceable, and tamper-proof.",
      icon: FileText,
      position: "bottom-10 -right-8 sm:-right-16"
    }
  ];

  return (
    <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-[#090814] overflow-hidden text-white">
      
      {/* Teleport Ambient Deep Purple Radial Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/25 to-fuchsia-900/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Teleport Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Teleport Headline & Stats) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* Pill Tag (Teleport Purple) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-purple-950/60 border border-purple-500/50 shadow-md text-[11px] font-mono font-bold tracking-widest text-purple-300 uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AGENTIC WORKFORCE OS</span>
            </motion.div>

            {/* Massive Teleport Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white"
            >
              Orchestrate every lead. <br />
              <span className="text-teleport-purple">
                Power every agent.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed font-normal"
            >
              Kaiso secures, coordinates, and deploys autonomous AI agents across your sales, marketing, and content infrastructure — with sub-310ms voice, automated browser scraping, and 4K video rendering.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link href="/dashboard">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-purple-950/60 border border-purple-400/40"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Launch Agent OS Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Horizontal Stats Strip (Teleport style) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-purple-900/40 grid grid-cols-4 gap-4 text-left font-mono"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">10M+</div>
                <div className="text-[11px] text-gray-400 mt-1 leading-tight font-sans">Leads Processed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">1,000+</div>
                <div className="text-[11px] text-gray-400 mt-1 leading-tight font-sans">Agencies & Studios</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">99.99%</div>
                <div className="text-[11px] text-gray-400 mt-1 leading-tight font-sans">Agent Availability</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">&lt;310ms</div>
                <div className="text-[11px] text-gray-400 mt-1 leading-tight font-sans">Voice Latency</div>
              </div>
            </motion.div>

          </div>

          {/* Right Column (Exact Teleport Hexagon Hub & Radial Node Diagram) */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-12">
            
            {/* Diagram Outer Container */}
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              
              {/* Concentric Glowing Purple Ripple Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[340px] rounded-full border border-purple-500/20 animate-ripple" />
                <div className="absolute w-[240px] h-[240px] rounded-full border border-purple-500/40 animate-ripple" style={{ animationDelay: "1s" }} />
                <div className="absolute w-[160px] h-[160px] rounded-full border border-purple-500/60" />
              </div>

              {/* SOLID NON-TRANSPARENT GLOWING SVG CONNECTION LINES */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <defs>
                  <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C084FC" stopOpacity="1" />
                    <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="1" />
                  </linearGradient>
                  <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Line 1: Center to Top Node */}
                <line x1="50%" y1="50%" x2="50%" y2="14%" stroke="url(#lineGlow)" strokeWidth="2.5" filter="url(#neonFilter)" />
                <circle cx="50%" cy="14%" r="4" fill="#C084FC" />

                {/* Line 2: Center to Left Node */}
                <line x1="50%" y1="50%" x2="18%" y2="38%" stroke="url(#lineGlow)" strokeWidth="2.5" filter="url(#neonFilter)" />
                <circle cx="18%" cy="38%" r="4" fill="#C084FC" />

                {/* Line 3: Center to Right Node */}
                <line x1="50%" y1="50%" x2="82%" y2="38%" stroke="url(#lineGlow)" strokeWidth="2.5" filter="url(#neonFilter)" />
                <circle cx="82%" cy="38%" r="4" fill="#C084FC" />

                {/* Line 4: Center to Bottom-Left Node */}
                <line x1="50%" y1="50%" x2="22%" y2="82%" stroke="url(#lineGlow)" strokeWidth="2.5" filter="url(#neonFilter)" />
                <circle cx="22%" cy="82%" r="4" fill="#C084FC" />

                {/* Line 5: Center to Bottom-Right Node */}
                <line x1="50%" y1="50%" x2="78%" y2="82%" stroke="url(#lineGlow)" strokeWidth="2.5" filter="url(#neonFilter)" />
                <circle cx="78%" cy="82%" r="4" fill="#C084FC" />
              </svg>

              {/* CENTRAL NEON GLOWING HEXAGON KEYHOLE HUB */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="relative z-20 w-32 h-36 bg-gradient-to-b from-purple-600 via-indigo-900 to-[#0F0B24] border-2 border-purple-400 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.6)] flex flex-col items-center justify-center cursor-pointer group"
              >
                {/* Hexagon Inner Glowing Icon */}
                <div className="w-14 h-14 rounded-full bg-white text-purple-900 flex items-center justify-center shadow-inner font-bold">
                  <Key className="w-7 h-7 text-purple-900 fill-purple-900" />
                </div>
                <span className="text-[11px] font-mono font-bold text-white mt-2 tracking-widest uppercase">
                  KAISO CORE
                </span>
              </motion.div>

              {/* BRANCHING RADIAL NODE CARDS (Teleport Style) */}
              
              {/* 1. Top Node: Least Privilege */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                <div className="glass-teleport-card p-3 rounded-2xl w-48 text-left space-y-1 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">Least Privilege</div>
                  </div>
                  <p className="text-[10px] text-gray-300 leading-snug">Grant minimum access for every agent task — nothing more.</p>
                </div>
              </div>

              {/* 2. Left Middle Node: Just-in-Time Voice */}
              <div className="absolute top-1/3 -left-4 sm:-left-8 z-20">
                <div className="glass-teleport-card p-3 rounded-2xl w-44 text-left space-y-1 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">Just-in-Time</div>
                  </div>
                  <p className="text-[10px] text-gray-300 leading-snug">Sub-310ms voice calls tailored to the lead at hand.</p>
                </div>
              </div>

              {/* 3. Right Middle Node: Universal Browser */}
              <div className="absolute top-1/3 -right-4 sm:-right-8 z-20">
                <div className="glass-teleport-card p-3 rounded-2xl w-44 text-left space-y-1 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">Universal</div>
                  </div>
                  <p className="text-[10px] text-gray-300 leading-snug">One platform for all identities & web infrastructure.</p>
                </div>
              </div>

              {/* 4. Bottom Left Node: Verified AI Video */}
              <div className="absolute bottom-2 left-0 sm:left-2 z-20">
                <div className="glass-teleport-card p-3 rounded-2xl w-44 text-left space-y-1 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">Verified</div>
                  </div>
                  <p className="text-[10px] text-gray-300 leading-snug">Strong identity verification for humans & agents.</p>
                </div>
              </div>

              {/* 5. Bottom Right Node: Auditable CLI */}
              <div className="absolute bottom-2 right-0 sm:right-2 z-20">
                <div className="glass-teleport-card p-3 rounded-2xl w-44 text-left space-y-1 transition-all hover:scale-105">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white">Auditable</div>
                  </div>
                  <p className="text-[10px] text-gray-300 leading-snug">Every action is logged, traceable, and tamper-proof.</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Teleport Bottom Strip (Built for Modern Infrastructure & Testimonial Quote) */}
        <div className="mt-16 pt-8 border-t border-purple-900/30 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-6 space-y-3 text-left">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              Built for Modern Infrastructure
            </div>
            <div className="flex items-center gap-6 text-gray-400 font-mono text-xs overflow-x-auto">
              <span className="flex items-center gap-1.5 text-white font-bold"><Cpu className="w-4 h-4 text-purple-400" /> HubSpot CRM</span>
              <span className="flex items-center gap-1.5 text-white font-bold"><Zap className="w-4 h-4 text-amber-400" /> Salesforce</span>
              <span className="flex items-center gap-1.5 text-white font-bold"><Globe className="w-4 h-4 text-blue-400" /> GoHighLevel</span>
              <span className="flex items-center gap-1.5 text-white font-bold"><Video className="w-4 h-4 text-indigo-400" /> YouTube & Reels</span>
            </div>
          </div>

          <div className="md:col-span-6 glass-teleport-card p-5 rounded-2xl text-left flex items-start gap-3">
            <Quote className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
            <p className="text-xs text-gray-200 leading-relaxed italic font-sans">
              "Kaiso gives us the visibility and multi-agent control we need without slowing our closing teams down."
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
