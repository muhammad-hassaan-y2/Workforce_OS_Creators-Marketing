"use client";

import { useEffect, useState } from "react";
import { X, Play, Volume2, PhoneCall, Globe, Terminal, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const demoTimeline = [
    {
      time: "00:02",
      agent: "Browser Agent",
      icon: Globe,
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      action: "Identified high-intent lead from Sales Navigator & extracted direct mobile number."
    },
    {
      time: "00:08",
      agent: "Phone Caller Agent",
      icon: PhoneCall,
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      action: "Initiated automated speed-to-lead call (Latency: 320ms). Qualified budget & authority."
    },
    {
      time: "00:22",
      agent: "CLI / Ops Agent",
      icon: Terminal,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      action: "Synced call recording, transcript & updated HubSpot deal stage to 'Demo Booked'."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity">
      <div 
        className="relative w-full max-w-4xl bg-[#141419] border border-[#262633] rounded-[24px] shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262633] bg-[#0E0E13]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs font-mono text-gray-400">orbital-live-simulation.mp4</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content / Simulated Video Player */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="relative aspect-video rounded-xl bg-[#09090D] border border-[#22222E] overflow-hidden flex flex-col justify-between p-6">
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE DEMO SIMULATION
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <Volume2 className="w-4 h-4 text-purple-400" />
                HD Audio Engine Active
              </div>
            </div>

            {/* Center Dynamic Visual */}
            <div className="relative z-10 my-auto text-center space-y-4">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/30 shadow-xl">
                  <div className="p-3 rounded-xl bg-purple-600/30 text-purple-300">
                    {activeStep === 0 && <Globe className="w-8 h-8" />}
                    {activeStep === 1 && <PhoneCall className="w-8 h-8 animate-bounce" />}
                    {activeStep === 2 && <Terminal className="w-8 h-8" />}
                  </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {demoTimeline[activeStep].agent}
                </h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto mt-1 font-mono">
                  "{demoTimeline[activeStep].action}"
                </p>
              </div>
            </div>

            {/* Simulated Player Controls */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Step {activeStep + 1} of 3</span>
                <span>00:30 Total Demo</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoTimeline.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeStep === idx
                        ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Execution Log List */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Automated Multi-Agent Event Stream
            </h4>
            <div className="space-y-2">
              {demoTimeline.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeStep === idx
                      ? "bg-[#1C1C24] border-purple-500/40 shadow-md"
                      : "bg-[#0F0F14] border-[#22222E] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        {item.agent}
                        <span className="text-[10px] font-mono text-gray-500">{item.time}</span>
                      </div>
                      <div className="text-xs text-gray-400 line-clamp-1">{item.action}</div>
                    </div>
                  </div>
                  {activeStep === idx && (
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0E0E13] border-t border-[#262633] flex items-center justify-between">
          <span className="text-xs text-gray-400">Ready to test on your client accounts?</span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Book Live Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
