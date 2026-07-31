"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, Globe, Terminal, Play, CheckCircle, RefreshCw, Sparkles, Volume2, Video, Sliders } from "lucide-react";
import { Button } from "../ui/Button";

export default function AgentPlayground() {
  const [activeMode, setActiveMode] = useState<"agency" | "creator" | "scraping">("creator");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const modeScenarios = {
    creator: {
      title: "Creator Sponsorship & Media Kit Pipeline",
      subtitle: "Automate brand deal pitches, inbound sponsor calls, and campaign reporting.",
      agentType: "Phone + Browser Agent",
      badge: "Creator Mode",
      steps: [
        "[00:01] Browser Agent: Scraped 25 Brand Manager emails from TechDirectory",
        "[00:04] Browser Agent: Auto-submitted Media Kit to Sponsorship Form",
        "[00:09] Phone Agent: Inbound Sponsor Call received from TechCorp ($15k budget)",
        "[00:15] Phone Agent: Negotiated Q3 YouTube Integration & locked CPM rates",
        "[00:22] CLI Agent: Updated HubSpot deal to 'Sponsor Closed' & dispatched PDF contract"
      ]
    },
    agency: {
      title: "Agency Speed-to-Lead Outbound Suite",
      subtitle: "Qualify high-ticket B2B leads within 30 seconds of inbound submission.",
      agentType: "Caller + Ops Agent",
      badge: "Agency Mode",
      steps: [
        "[00:01] Webhook: Received inbound contact form submission from SaaSify Inc.",
        "[00:03] Browser Agent: Verified SMTP email & pulled LinkedIn headcount data",
        "[00:07] Phone Agent: Dialed prospect (Latency: 310ms). Conducted qualification",
        "[00:18] Phone Agent: Qualified budget ($50k+) & booked demo for Thursday 2 PM",
        "[00:24] CLI Agent: Synced transcript, sentiment tag, and Google Calendar invite"
      ]
    },
    scraping: {
      title: "RevOps Web Scraping & List Enrichment",
      subtitle: "Scrape directories, bypass captcha obstacles, and enrich contacts automatically.",
      agentType: "Browser + CLI Agent",
      badge: "Automation Mode",
      steps: [
        "[00:01] Browser Agent: Navigated to Sales Directory & bypassed layout changes",
        "[00:05] Browser Agent: Extracted 150 VP Sales profile cards & direct mobile numbers",
        "[00:10] CLI Agent: Performed SMTP handshake verification on 150 emails",
        "[00:16] CLI Agent: Exported verified lead batch payload to CRM Pipeline",
        "[00:20] System: Dispatched trigger alert to Sales Manager Slack Channel"
      ]
    }
  };

  const currentScenario = modeScenarios[activeMode];

  const handleRunSimulation = () => {
    setIsRunning(true);
    setLogs([]);
    setCurrentStep(0);

    let step = 0;
    const interval = setInterval(() => {
      if (step < currentScenario.steps.length) {
        setLogs((prev) => [...prev, currentScenario.steps[step]]);
        setCurrentStep(step + 1);
        step++;
      } else {
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 1200);
  };

  return (
    <section id="playground" className="py-24 md:py-32 bg-[#0B0B0F] border-t border-[#1C1C26] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            INTERACTIVE AGENT SIMULATOR
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Test Orbital Agent execution <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              live right in your browser.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1AA]">
            Select a mode to simulate real-time agent handoff for Creators or Sales Agencies.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
          <button
            onClick={() => { setActiveMode("creator"); setLogs([]); setCurrentStep(0); }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
              activeMode === "creator"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                : "bg-[#141419] text-gray-400 border border-[#22222E] hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" />
            Creator & Influencer Mode
          </button>

          <button
            onClick={() => { setActiveMode("agency"); setLogs([]); setCurrentStep(0); }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
              activeMode === "agency"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-[#141419] text-gray-400 border border-[#22222E] hover:text-white"
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            Sales Agency SDR Mode
          </button>

          <button
            onClick={() => { setActiveMode("scraping"); setLogs([]); setCurrentStep(0); }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
              activeMode === "scraping"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "bg-[#141419] text-gray-400 border border-[#22222E] hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            RevOps Web Scraping Mode
          </button>
        </div>

        {/* Playground Interactive Monitor Screen */}
        <div className="max-w-5xl mx-auto rounded-[24px] bg-[#141419] border border-[#22222E] p-6 md:p-8 shadow-2xl space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#22222E]">
            <div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-semibold">
                {currentScenario.badge}
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {currentScenario.title}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {currentScenario.subtitle}
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isRunning}
              onClick={handleRunSimulation}
              icon={isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            >
              {isRunning ? "Executing Simulation..." : "Run Live Simulation"}
            </Button>
          </div>

          {/* Execution Stream Output Box */}
          <div className="rounded-xl bg-[#09090D] border border-[#22222E] p-6 font-mono text-xs text-gray-300 min-h-[220px] flex flex-col justify-between space-y-3">
            
            <div className="flex items-center justify-between text-gray-500 border-b border-gray-800 pb-2 text-[11px]">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-emerald-400 animate-ping" : "bg-gray-600"}`} />
                {isRunning ? "AGENT_MESH_RUNNING" : "STANDBY_READY"}
              </span>
              <span>ORBITAL_VM_v2.4</span>
            </div>

            <div className="space-y-2.5 my-auto py-2">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic text-center py-6">
                  Press "Run Live Simulation" to start the multi-agent execution pipeline...
                </div>
              ) : (
                logs.map((logLine, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 text-emerald-300"
                  >
                    <span className="text-purple-400 select-none">&gt;</span>
                    <span>{logLine}</span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Audio Waveform visualizer for phone agent when running */}
            {isRunning && activeMode !== "scraping" && (
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-purple-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> NEURAL VOICE SYNTHESIS ACTIVE (320ms Latency)
                </span>
                <div className="flex items-center gap-1 h-3">
                  <span className="w-1 bg-purple-400 h-full animate-bounce" />
                  <span className="w-1 bg-indigo-400 h-2/3 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1 bg-blue-400 h-full animate-bounce [animation-delay:0.4s]" />
                  <span className="w-1 bg-emerald-400 h-1/2 animate-bounce [animation-delay:0.1s]" />
                </div>
              </div>
            )}

          </div>

          {/* Footer Metrics */}
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 pt-2">
            <span>Execution Steps: {currentStep} / {currentScenario.steps.length}</span>
            <span className="text-emerald-400">Auto-Handoff Guardrails: Enabled</span>
          </div>

        </div>

      </div>
    </section>
  );
}
