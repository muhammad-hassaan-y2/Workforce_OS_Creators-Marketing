"use client";

import { motion } from "framer-motion";
import { PRICING_PLANS } from "@/lib/constants";
import { Button } from "../ui/Button";
import { CheckCircle2, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#FAFAFA] border-t border-[#ECECEF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            TRANSPARENT AGENCY PRICING
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B0B0F] leading-tight">
            Predictable plans designed to scale <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              with your client retainers.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#52525B]">
            All plans include full multi-agent orchestration, CRM synchronization, and live guardrails.
          </p>
        </div>

        {/* 3 Tier Pricing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan, idx) => {
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-[24px] p-8 transition-all duration-300 flex flex-col justify-between relative ${
                  plan.highlight
                    ? "bg-[#0B0B0F] text-white shadow-2xl scale-[1.03] border-2 border-purple-500 ring-4 ring-purple-500/10"
                    : "bg-white text-[#0B0B0F] border border-[#ECECEF] shadow-xs hover:shadow-xl hover:border-purple-300"
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Price */}
                  <div>
                    <h3 className={`text-xl font-bold ${plan.highlight ? "text-white" : "text-[#0B0B0F]"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs mt-1 ${plan.highlight ? "text-gray-400" : "text-[#52525B]"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlight ? "text-gray-400" : "text-[#52525B]"}`}>
                      {plan.period}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className={`pt-6 border-t ${plan.highlight ? "border-gray-800" : "border-[#ECECEF]"} space-y-3`}>
                    <div className={`text-xs font-semibold uppercase tracking-wider ${plan.highlight ? "text-purple-400" : "text-purple-700"}`}>
                      Included Capabilities:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs leading-relaxed font-medium">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-emerald-400" : "text-emerald-600"}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4">
                  <Button
                    variant={plan.highlight ? "primary" : "secondary"}
                    size="lg"
                    className="w-full justify-center"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {plan.cta}
                  </Button>
                </div>

                {/* Code comment marker for placeholder stats */}
                {/* [PLACEHOLDER — replace with real pricing data] */}
              </motion.div>
            );
          })}
        </div>

        {/* Security & Guarantee Strip */}
        <div className="mt-14 text-center flex flex-wrap items-center justify-center gap-8 text-xs text-[#52525B] font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 14-Day Free Sandbox Trial
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" /> No Setup Fees or Hidden Charges
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Pause or Cancel Anytime
          </span>
        </div>

      </div>
    </section>
  );
}
