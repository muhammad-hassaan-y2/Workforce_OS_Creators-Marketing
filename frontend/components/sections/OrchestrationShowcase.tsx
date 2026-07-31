"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ORCHESTRATION_STEPS } from "@/lib/constants";
import { Globe, PhoneCall, Terminal, ArrowRight, Zap, CheckCircle2, Play, Pause, RefreshCw } from "lucide-react";

export default function OrchestrationShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ORCHESTRATION_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe":
        return <Globe className="w-6 h-6 text-blue-400" />;
      case "PhoneCall":
        return <PhoneCall className="w-6 h-6 text-purple-400" />;
      case "Terminal":
        return <Terminal className="w-6 h-6 text-emerald-400" />;
      default:
        return <Zap className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <section id="how-it-works" className="py-28 md:py-36 bg-[#0B0B0F] relative overflow-hidden">
      {/* Ambient Radial Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-indigo-900/15 via-purple-900/20 to-blue-900/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            MULTI-AGENT ORCHESTRATION LAYER
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Not isolated tools. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              A synchronized autonomous mesh.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            Watch how Millo agents pass control seamlessly: from initial web discovery to live telephone qualification and CRM pipeline updates.
          </p>

          {/* Autoplay Controls */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs font-mono text-gray-400">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141419] border border-[#22222E] hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-purple-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isPlaying ? "Pause Orchestration Demo" : "Play Orchestration Demo"}</span>
            </button>
          </div>
        </div>

        {/* Orchestration Pipeline Interactive Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-5 space-y-4">
            {ORCHESTRATION_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`p-6 rounded-[20px] border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? "bg-[#16161F] border-purple-500/60 shadow-xl shadow-purple-950/30 scale-[1.02]"
                      : "bg-[#111116] border-[#22222E] hover:border-gray-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* Left Active Progress Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-blue-500"
                    />
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl border ${step.badgeColor} shrink-0`}>
                      {getStepIcon(step.icon)}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold">
                        {step.agent}
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Orchestration Telemetry Screen */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] bg-[#141419] border border-[#22222E] p-6 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between">
              
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#22222E]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
                  <span className="text-xs font-mono text-gray-300">
                    ORCHESTRATION_BUS // STEP {activeStep + 1} OF 3
                  </span>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  HANDOFF_LATENCY: 14ms
                </div>
              </div>

              {/* Animated Animated Step Output */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="my-auto py-8 space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 shadow-lg">
                      {getStepIcon(ORCHESTRATION_STEPS[activeStep].icon)}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                        Active Executor
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {ORCHESTRATION_STEPS[activeStep].agent}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#09090D] border border-[#22222E] space-y-3">
                    <div className="text-xs font-mono text-purple-400 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      EVENT_PAYLOAD_TRANSIT
                    </div>
                    <p className="text-sm font-mono text-gray-200 leading-relaxed">
                      "{ORCHESTRATION_STEPS[activeStep].detail}"
                    </p>
                  </div>

                  {/* Connected Signal Flow Visual */}
                  <div className="pt-2 flex items-center gap-3">
                    {ORCHESTRATION_STEPS.map((s, i) => (
                      <div key={i} className="flex-1 flex items-center gap-2">
                        <div
                          className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                            i <= activeStep
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                              : "bg-gray-800"
                          }`}
                        />
                        {i < ORCHESTRATION_STEPS.length - 1 && (
                          <ArrowRight className={`w-3.5 h-3.5 ${i < activeStep ? "text-purple-400" : "text-gray-700"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Screen Footer Status */}
              <div className="pt-4 border-t border-[#22222E] flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Auto-Recovery Guardrail: Active
                </span>
                <span>Workspace: Enterprise Node #04</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
