"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/Button";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 md:py-36 bg-[#0B0B0F] relative overflow-hidden">
      {/* Background Gradient Ambient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/25 to-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-orb-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto rounded-[32px] bg-[#141419] border border-purple-500/30 p-10 md:p-16 text-center space-y-8 shadow-2xl shadow-purple-950/30 relative overflow-hidden group">
          
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            DEPLOY YOUR AGENT WORKFORCE TODAY
          </div>

          {/* Main Punchy Apple Headline */}
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Ready to replace busywork <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-400">
              with autonomous agents?
            </span>
          </h2>

          <p className="text-base sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
            Set up your first Phone, Browser, and CLI multi-agent pipeline in less than 30 minutes. No developer required.
          </p>

          {/* Single Primary CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button 
                variant="primary" 
                size="lg" 
                className="px-10 py-4 text-base cursor-pointer" 
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Launch Agent OS Dashboard
              </Button>
            </Link>
          </div>

          {/* Micro Guarantee */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 14-Day Free Sandbox Trial
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Dedicated RevOps Onboarding
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
