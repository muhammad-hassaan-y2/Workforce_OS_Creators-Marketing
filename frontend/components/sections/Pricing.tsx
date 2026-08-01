"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRICING_TIERS } from "@/lib/constants";
import { Button } from "../ui/Button";
import AuthModal from "../AuthModal";
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#07070A] border-t border-[#1C1C26] relative overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-purple-900/15 via-indigo-900/20 to-blue-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            TRANSPARENT WORKFORCE PRICING
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Predictable plans designed to scale <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-yellow-400">
              with your client retainers & sponsorships.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1AA]">
            All plans include full multi-agent orchestration, CRM synchronization, and live neural voice guardrails.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="p-1 rounded-full bg-[#141419] border border-[#22222E] flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>

              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.2 rounded-full font-bold">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Tier Pricing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_TIERS.map((plan, idx) => {
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-[28px] p-8 transition-all duration-300 flex flex-col justify-between relative glass-panel ${
                  plan.popular
                    ? "bg-[#12121A] border-2 border-purple-500/60 shadow-2xl shadow-purple-950/40 ring-4 ring-purple-500/10 scale-[1.03]"
                    : "bg-[#0E0E14] border-white/10 hover:border-purple-500/40"
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-yellow-400 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center justify-between">
                      <span>{plan.name}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed font-normal">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                      {billingCycle === "annual" && plan.price !== "Custom"
                        ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}`
                        : plan.price}
                    </span>
                    <span className="text-sm text-gray-400 font-mono">
                      {plan.period}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                      Included Capabilities:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs leading-relaxed font-medium text-gray-300">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4">
                  <Link href="/dashboard">
                    <Button
                      variant={plan.popular ? "primary" : "outline"}
                      size="lg"
                      className="w-full justify-center"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {plan.ctaText}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Security & Guarantee Strip */}
        <div className="mt-16 text-center flex flex-wrap items-center justify-center gap-8 text-xs text-gray-400 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 14-Day Free Sandbox Trial
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> No Setup Fees or Hidden Charges
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-yellow-400" /> Pause or Cancel Anytime
          </span>
        </div>

      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
      />
    </section>
  );
}
