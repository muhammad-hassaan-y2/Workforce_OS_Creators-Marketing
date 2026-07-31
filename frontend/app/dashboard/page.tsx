"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { 
  PhoneCall, 
  Globe, 
  Terminal, 
  Video, 
  Sparkles, 
  Bot, 
  Send, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle2, 
  ArrowLeft,
  Volume2,
  Film,
  Zap,
  Sliders,
  ShieldCheck,
  Code2,
  Layers,
  Search,
  ExternalLink,
  Cpu,
  Mic,
  Monitor,
  Activity,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const [activeAgentTab, setActiveAgentTab] = useState<"orchestrator" | "phone" | "browser" | "video" | "cli">("orchestrator");
  const [chatInput, setChatInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Phone Agent State
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected">("idle");
  const [callTranscript, setCallTranscript] = useState([
    { speaker: "Phone Agent", text: "Hello Sarah, I saw SaaSify expanded its SDR team. Are you currently handling lead enrichment manually?" },
    { speaker: "Lead (Sarah)", text: "We are actually. Our reps spend about 2 hours a day copying LinkedIn data." },
    { speaker: "Phone Agent", text: "Orbital deploys browser agents to handle that 24/7. Should we pencil in a 10-minute demo for Thursday at 2 PM?" },
    { speaker: "Lead (Sarah)", text: "Thursday at 2 PM works great. Send over the invite." }
  ]);

  // Video Agent State
  const [videoProgress, setVideoProgress] = useState(74);
  const [videoRenderState, setVideoRenderState] = useState("Rendering 4K MP4 Video & Compiling AI Voiceover...");

  // Browser Agent State
  const [targetUrl, setTargetUrl] = useState("https://linkedin.com/sales/search/people");
  const [scrapedLeads, setScrapedLeads] = useState([
    { name: "Sarah Jenkins", role: "VP of Sales", company: "SaaSify Inc.", email: "sarah@saasify.io", status: "Verified" },
    { name: "David Chen", role: "Head of Marketing", company: "GrowthScale", email: "david@growthscale.com", status: "Verified" },
    { name: "Elena Rostova", role: "RevOps Director", company: "Outbound Scale", email: "elena@outbound.co", status: "Verified" },
    { name: "Marcus Vance", role: "Managing Director", company: "Vance Media", email: "marcus@vancemedia.com", status: "Verified" }
  ]);

  // CLI Agent State
  const [terminalLogs, setTerminalLogs] = useState([
    "[09:14:02] Initializing Orbital Ops Execution Bus v2.4",
    "[09:14:05] [SUCCESS] Synced 142 enriched contacts to HubSpot CRM pipeline",
    "[09:14:08] [TRIGGER] Dispatched lead payload to Phone Caller Agent [Queue ID: #8921]",
    "[09:14:12] [SUCCESS] Video Render Job #VID-901 completed. Exported to YouTube/Instagram",
    "[09:14:15] [STATUS] Multi-agent cycle completed in 1.24s with 99.9% accuracy"
  ]);

  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState([
    { id: "1", sender: "agent", text: "Welcome to the Orbital Agentic Control Room. All 4 specialized agents (Phone, Browser, Video, CLI) are running live. Select an agent workspace tab or command the mesh below." }
  ]);

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: userText }]);
    setIsProcessing(true);

    setTimeout(() => {
      let reply = "";
      if (userText.toLowerCase().includes("video") || userText.toLowerCase().includes("content")) {
        setActiveAgentTab("video");
        reply = "Switched to Content & Video Agent. Generating new 4K short video script & initializing video rendering pipeline...";
      } else if (userText.toLowerCase().includes("call") || userText.toLowerCase().includes("phone")) {
        setActiveAgentTab("phone");
        reply = "Switched to Phone Caller Agent. Neural voice latency verified at 320ms. Ready for live qualification call.";
      } else if (userText.toLowerCase().includes("scrape") || userText.toLowerCase().includes("browser")) {
        setActiveAgentTab("browser");
        reply = "Switched to Browser Control Agent. Navigating target DOM directory & auto-submitting sponsor proposal forms.";
      } else if (userText.toLowerCase().includes("cli") || userText.toLowerCase().includes("terminal")) {
        setActiveAgentTab("cli");
        reply = "Switched to CLI / Ops Agent. Executing bash automation pipeline and syncing HubSpot CRM database.";
      } else {
        reply = `Executing command '${userText}' across active multi-agent mesh. All outputs synced to database.`;
      }

      setChatMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: "agent", text: reply }]);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F5F7] flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Top Bold Header Bar */}
      <header className="bg-[#12121A] border-b border-[#222232] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Landing</span>
          </Link>
          <div className="h-4 w-px bg-gray-800 hidden sm:block" />
          <Logo size={32} />
        </div>

        {/* Theme Accent Badges: Yellow, Purple, Blue, White */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            MESH ACTIVE (4 AGENTS)
          </div>

          <div className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold tracking-wide shadow-md">
            PRO AGENTIC UI
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Workspace Agentic Navigation Tabs (White, Black, Blue, Yellow, Purple accents) */}
        <div className="bg-[#14141E] p-2 rounded-[20px] border border-[#222232] flex items-center gap-2 overflow-x-auto shadow-xl scrollbar-none">
          {[
            { id: "orchestrator", label: "Multi-Agent Orchestrator", icon: Cpu, badge: "Mesh", color: "bg-purple-600 text-white" },
            { id: "phone", label: "Phone Caller Agent", icon: PhoneCall, badge: "Live Voice", color: "bg-yellow-400 text-black font-bold" },
            { id: "video", label: "AI Video & Content Creation", icon: Video, badge: "4K Render", color: "bg-purple-600 text-white" },
            { id: "browser", label: "Browser Control Agent", icon: Globe, badge: "DOM Web", color: "bg-blue-600 text-white" },
            { id: "cli", label: "CLI & Backend Ops", icon: Terminal, badge: "Terminal", color: "bg-emerald-600 text-white" }
          ].map((tab) => {
            const isActive = activeAgentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAgentTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap ${
                  isActive
                    ? `${tab.color} shadow-lg scale-[1.02]`
                    : "bg-[#0B0B0F] text-gray-400 border border-[#222232] hover:text-white hover:border-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isActive ? "bg-black/20 text-current" : "bg-white/5 text-gray-400"}`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Main Workspace Panel per Agent */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Agent Workspace Display (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Orchestrator Mesh Overview */}
            {activeAgentTab === "orchestrator" && (
              <div className="p-6 md:p-8 rounded-[24px] bg-[#14141E] border border-[#222232] shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#222232] pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
                      SYSTEM ORCHESTRATION ARCHITECTURE
                    </span>
                    <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                      Multi-Agent Autonomous Mesh
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold">
                    SYNCED: 12ms Latency
                  </span>
                </div>

                {/* 4 Agent Summary Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#0E0E14] border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ACTIVE CALL
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">Phone Caller Agent</h3>
                    <p className="text-xs text-gray-400 font-mono">Qualifying inbound lead Sarah (SaaSify Inc.)</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0E0E14] border border-indigo-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                        <Video className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        RENDERING 74%
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">AI Video & Content Creation</h3>
                    <p className="text-xs text-gray-400 font-mono">Rendering 4K MP4 script & Media Kit</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0E0E14] border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        SCRAPING
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">Browser Control Agent</h3>
                    <p className="text-xs text-gray-400 font-mono">Scraping 50 tech brand managers on LinkedIn</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0E0E14] border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        RUNNING
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">CLI / Ops Agent</h3>
                    <p className="text-xs text-gray-400 font-mono">Syncing call transcripts & HubSpot database</p>
                  </div>
                </div>

                {/* Flow Connection Node Bar */}
                <div className="p-4 rounded-2xl bg-[#09090D] border border-[#222232] flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-yellow-400 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Pipeline Signal: Browser Scrape &rarr; AI Voice Call &rarr; Video Asset &rarr; CRM Log
                  </span>
                  <span className="text-emerald-400">0 Errors</span>
                </div>
              </div>
            )}

            {/* 2. Phone Caller Agent Workspace */}
            {activeAgentTab === "phone" && (
              <div className="p-6 md:p-8 rounded-[24px] bg-[#14141E] border border-purple-500/40 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#222232] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-yellow-400 text-black font-bold">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Phone Caller Agent Control</h2>
                      <p className="text-xs font-mono text-purple-400">Neural Speech Engine v2.4 (Latency: 310ms)</p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCallStatus(callStatus === "connected" ? "idle" : "connected")}
                  >
                    {callStatus === "connected" ? "End Call Session" : "Simulate Outbound Call"}
                  </Button>
                </div>

                {/* Voice Call Telemetry Box */}
                <div className="p-5 rounded-2xl bg-[#09090D] border border-[#222232] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                      <Volume2 className="w-4 h-4 text-purple-400" />
                      <span>Live Call Audio Stream: Sarah Jenkins (SaaSify Inc.)</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                      02:45 ACTIVE
                    </span>
                  </div>

                  {/* Audio Waveform Animating Bars */}
                  <div className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#14141E] justify-center">
                    {[...Array(24)].map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-purple-600 via-yellow-400 to-blue-500 rounded-full animate-bounce"
                        style={{
                          height: `${Math.floor(Math.random() * 28) + 8}px`,
                          animationDelay: `${(i % 5) * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Transcript Log */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">
                    Real-time Objection Handling Transcript:
                  </h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-xs pr-2">
                    {callTranscript.map((t, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#09090D] border border-white/5 space-y-1">
                        <span className="text-purple-400 font-bold">{t.speaker}:</span>
                        <p className="text-gray-200 italic">"{t.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. AI Video & Content Creation Agent Workspace */}
            {activeAgentTab === "video" && (
              <div className="p-6 md:p-8 rounded-[24px] bg-[#14141E] border border-indigo-500/40 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#222232] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-600 text-white font-bold">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">AI Content & Video Creation Agent</h2>
                      <p className="text-xs font-mono text-indigo-400">4K Short Video Generator & Media Kit Studio</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-xs font-mono font-bold">
                    RENDER ENGINE ACTIVE
                  </span>
                </div>

                {/* Video Render Monitor Panel */}
                <div className="p-6 rounded-2xl bg-[#09090D] border border-[#222232] space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-300 flex items-center gap-2">
                      <Film className="w-4 h-4 text-indigo-400" />
                      {videoRenderState}
                    </span>
                    <span className="text-yellow-400 font-bold">{videoProgress}%</span>
                  </div>

                  <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-400 transition-all duration-500"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-[11px] font-mono text-gray-400 pt-2">
                    <div className="p-2.5 rounded-xl bg-[#14141E] border border-white/5">
                      Resolution: <span className="text-white">4K UHD (3840x2160)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#14141E] border border-white/5">
                      Voiceover: <span className="text-purple-400">Neural Studio</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#14141E] border border-white/5">
                      Target: <span className="text-emerald-400">YouTube & Reels</span>
                    </div>
                  </div>
                </div>

                {/* Generated Script Preview */}
                <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/5 space-y-2 font-mono text-xs">
                  <div className="text-purple-400 font-bold">&gt; AI Scriptwriter Output:</div>
                  <p className="text-gray-300 leading-relaxed italic">
                    "Stop losing 60% of your day to manual SDR busywork. Orbital deploys AI agents that place calls, scrape brand deals, and render video content automatically..."
                  </p>
                </div>
              </div>
            )}

            {/* 4. Browser Control Agent Workspace */}
            {activeAgentTab === "browser" && (
              <div className="p-6 md:p-8 rounded-[24px] bg-[#14141E] border border-blue-500/40 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#222232] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-600 text-white font-bold">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Browser Control Agent Workspace</h2>
                      <p className="text-xs font-mono text-blue-400">DOM Visual Layout Engine & Auto DM Submitter</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
                    DOM NAVIGATING
                  </span>
                </div>

                {/* URL Bar Simulation */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#09090D] border border-[#222232] text-xs font-mono">
                  <span className="text-gray-500">URL:</span>
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="flex-1 bg-transparent text-blue-300 focus:outline-none"
                  />
                  <ExternalLink className="w-4 h-4 text-gray-500 cursor-pointer" />
                </div>

                {/* Scraped Leads Table */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">
                    Extracted Prospects & Sponsor Contacts:
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-[#222232] text-gray-500">
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Role</th>
                          <th className="pb-2">Company</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {scrapedLeads.map((lead, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="py-2.5 font-bold text-white">{lead.name}</td>
                            <td className="py-2.5 text-gray-300">{lead.role}</td>
                            <td className="py-2.5 text-purple-400">{lead.company}</td>
                            <td className="py-2.5 text-emerald-400">{lead.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CLI / Ops Agent Workspace */}
            {activeAgentTab === "cli" && (
              <div className="p-6 md:p-8 rounded-[24px] bg-[#14141E] border border-emerald-500/40 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#222232] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">CLI / Ops Backend Execution Terminal</h2>
                      <p className="text-xs font-mono text-emerald-400">Headless Bash & Python Pipeline Runner</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    EXECUTOR BUS OK
                  </span>
                </div>

                {/* Interactive Terminal Window */}
                <div className="p-6 rounded-2xl bg-[#09090D] border border-[#222232] font-mono text-xs space-y-3 text-gray-300 min-h-[260px]">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-[11px] text-gray-500">
                    <span>orbital-cli v2.4 // execution-stdout</span>
                    <span className="text-emerald-400">PID: 8092</span>
                  </div>

                  <div className="space-y-2">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Universal Agentic Conversational AI Console (4 Cols) */}
          <div className="lg:col-span-4 rounded-[24px] bg-[#14141E] border border-[#222232] p-6 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3 border-b border-[#222232] pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-bold text-white">Agentic AI Console</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Command all agents via voice or text. Real-time multi-agent execution bus active.
              </p>
            </div>

            {/* Chat Stream */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 font-mono text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl border ${
                    msg.sender === "user"
                      ? "bg-purple-600/20 border-purple-500/40 text-white ml-4"
                      : "bg-[#09090D] border-[#222232] text-gray-200 mr-4"
                  }`}
                >
                  <div className="text-[10px] text-gray-500 mb-1">
                    {msg.sender === "user" ? "You (Operator)" : "Orbital Mesh"}
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="space-y-3 pt-2">
              <textarea
                rows={3}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Command agents (e.g. 'Render video script', 'Dial Sarah', 'Scrape brand sponsors')..."
                className="w-full p-3 rounded-xl bg-[#09090D] border border-[#222232] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 font-sans"
              />
              
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isProcessing}
                className="w-full justify-center bg-gradient-to-r from-yellow-400 via-purple-600 to-blue-600 text-black font-bold"
                icon={<Send className="w-4 h-4 text-white" />}
              >
                {isProcessing ? "Executing..." : "Send Command"}
              </Button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
