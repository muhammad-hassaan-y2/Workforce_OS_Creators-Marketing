"use client";

import { useState, useEffect } from "react";
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
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Volume2,
  Film,
  Zap,
  Sliders,
  ShieldCheck
} from "lucide-react";

interface AgentStatus {
  id: string;
  name: string;
  category: "Sales & Marketing" | "Content & Video" | "Browser Scraping" | "Backend Ops";
  status: "Running" | "Live Call" | "Rendering Video" | "Idle";
  activeTask: string;
  icon: any;
  color: string;
  badgeColor: string;
  progress?: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "sales" | "video" | "browser" | "cli">("all");
  const [chatInput, setChatInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Active Agents Working Live
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: "sales-1",
      name: "Sales & Marketing Qualifier",
      category: "Sales & Marketing",
      status: "Live Call",
      activeTask: "On call with lead Sarah Jenkins (SaaSify Inc.) — 02:45",
      icon: PhoneCall,
      color: "border-purple-500/50 bg-purple-500/10 text-purple-400",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    },
    {
      id: "video-1",
      name: "AI Video & Content Creation Agent",
      category: "Content & Video",
      status: "Rendering Video",
      activeTask: "Generating 4K Short Video Script & Rendering MP4 Assets",
      icon: Video,
      color: "border-indigo-500/50 bg-indigo-500/10 text-indigo-400",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      progress: 68
    },
    {
      id: "browser-1",
      name: "Browser Scraper & DM Automation",
      category: "Browser Scraping",
      status: "Running",
      activeTask: "Scraping 50 Brand Manager Contacts & Auto-Pitching Media Kit",
      icon: Globe,
      color: "border-blue-500/50 bg-blue-500/10 text-blue-400",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    {
      id: "cli-1",
      name: "CLI Ops & Pipeline Execution",
      category: "Backend Ops",
      status: "Running",
      activeTask: "Syncing Call Transcripts & Dispatching Slack Sponsor Alerts",
      icon: Terminal,
      color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    }
  ]);

  // Conversational Command Logs
  const [logs, setLogs] = useState([
    { id: "1", type: "system", sender: "Orbital OS", text: "Multi-Agent System initialized. 4 autonomous agents running across Sales, Video Creation, Browser, and CLI workflows." },
    { id: "2", type: "sales", sender: "Sales Agent", text: "[09:14:02] Inbound lead form received. Initiated Speed-to-Lead call (Latency: 310ms)." },
    { id: "3", type: "video", sender: "Video Creation Agent", text: "[09:14:15] Generated AI script: 'Top 5 RevOps Automation Hacks for 2026'. Video rendering at 68%." },
    { id: "4", type: "browser", sender: "Browser Agent", text: "[09:14:28] Parsed 50 tech brand managers on LinkedIn. Dispatched 18 media kit proposals." }
  ]);

  const handleSendCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userCmd = chatInput;
    setChatInput("");
    setIsProcessing(true);

    setLogs((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", sender: "Operator", text: userCmd }
    ]);

    setTimeout(() => {
      let agentReply = "";
      if (userCmd.toLowerCase().includes("video") || userCmd.toLowerCase().includes("content")) {
        agentReply = "[Video Creation Agent] Command received. Generating viral video script, compiling voiceover & rendering MP4 video asset...";
      } else if (userCmd.toLowerCase().includes("call") || userCmd.toLowerCase().includes("sales")) {
        agentReply = "[Sales Agent] Dialing prospect... Sub-350ms neural speech engine active. Qualifying B2B budget.";
      } else if (userCmd.toLowerCase().includes("sponsor") || userCmd.toLowerCase().includes("scrape")) {
        agentReply = "[Browser Agent] Navigated to Brand Directory. Scraping emails and auto-submitting sponsor proposal.";
      } else {
        agentReply = `[Orbital Orchestrator] Task '${userCmd}' dispatched to multi-agent mesh. Executing parallel jobs.`;
      }

      setLogs((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), type: "agent", sender: "Orbital Mesh", text: agentReply }
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F5F7] flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Dashboard Top Glassmorphic Navigation */}
      <header className="bg-[#0E0E13]/90 backdrop-blur-xl border-b border-[#22222E] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing</span>
          </Link>
          <div className="h-4 w-px bg-gray-800 hidden sm:block" />
          <Logo size={32} />
        </div>

        {/* Live System Uptime Indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            4 AGENTS WORKING LIVE
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-300 font-mono hidden sm:inline">Workspace: Agency & Creator Pro</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
              OR
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[24px] bg-[#141419] border border-[#22222E] shadow-xl relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              LIVE MULTI-AGENT OPERATING SYSTEM
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Autonomous Agent Control Center
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Running live automated operations for Sales Leads, Marketing Campaigns, Content & Video Creation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSendCommand()}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync Pipelines
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              + Deploy New Agent
            </Button>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-purple-600/10 to-transparent pointer-events-none" />
        </div>

        {/* Multi-Agent Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: "All Active Agents (4)", icon: Bot },
            { id: "sales", label: "Sales & Marketing", icon: PhoneCall },
            { id: "video", label: "Content & Video Creation", icon: Video },
            { id: "browser", label: "Browser Scraping & DMs", icon: Globe },
            { id: "cli", label: "CLI & Backend Ops", icon: Terminal },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-[#141419] text-gray-400 border border-[#22222E] hover:text-white"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Active Agents Working Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents
            .filter((a) => activeTab === "all" || (activeTab === "sales" && a.category === "Sales & Marketing") || (activeTab === "video" && a.category === "Content & Video") || (activeTab === "browser" && a.category === "Browser Scraping") || (activeTab === "cli" && a.category === "Backend Ops"))
            .map((agent) => (
              <div
                key={agent.id}
                className="p-5 rounded-[20px] bg-[#141419] border border-[#22222E] hover:border-purple-500/40 transition-all duration-300 space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${agent.color}`}>
                      <agent.icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${agent.badgeColor}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {agent.name}
                    </h3>
                    <div className="text-[11px] font-mono text-purple-400 mt-0.5">
                      {agent.category}
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-mono bg-[#09090D] p-2.5 rounded-xl border border-white/5">
                    &gt; {agent.activeTask}
                  </p>

                  {/* Video Render Progress Bar */}
                  {agent.progress !== undefined && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                        <span>4K MP4 Render</span>
                        <span className="text-indigo-400 font-semibold">{agent.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${agent.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#22222E] flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Executing
                  </span>
                  <span>ID: #{agent.id}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Conversational UI Agent Control Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Real-time Live Log & Audio/Video Telemetry Screen */}
          <div className="lg:col-span-7 rounded-[24px] bg-[#141419] border border-[#22222E] p-6 shadow-2xl space-y-4 flex flex-col justify-between min-h-[440px]">
            <div className="flex items-center justify-between border-b border-[#22222E] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-white font-bold">
                  MULTI_AGENT_EXECUTION_BUS // REALTIME
                </span>
              </div>
              <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                STREAMING
              </span>
            </div>

            {/* Log Stream */}
            <div className="space-y-3 font-mono text-xs overflow-y-auto max-h-[300px] pr-2">
              {logs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-[#09090D] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span className="text-purple-400 font-semibold">{log.sender}</span>
                    <span>{log.type.toUpperCase()}</span>
                  </div>
                  <div className="text-gray-200 leading-relaxed">{log.text}</div>
                </div>
              ))}
            </div>

            {/* Bottom Status Bar */}
            <div className="pt-3 border-t border-[#22222E] flex items-center justify-between text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Auto-Recovery Guardrails Enabled
              </span>
              <span>Memory: Optimal (1.2GB)</span>
            </div>
          </div>

          {/* Right Column: Conversational Command Console */}
          <div className="lg:col-span-5 rounded-[24px] bg-[#141419] border border-[#22222E] p-6 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2 border-b border-[#22222E] pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Agent OS Command Console</h3>
              </div>
              <p className="text-xs text-gray-400">
                Type instructions to command Sales, Video Creation, or Browser agents.
              </p>
            </div>

            {/* Quick Action Prompt Buttons */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block font-semibold">
                Quick Agent Commands:
              </label>
              
              <button
                onClick={() => setChatInput("Generate 3 Short Video Scripts & Render 4K Video MP4s")}
                className="w-full p-2.5 rounded-xl bg-[#09090D] border border-[#22222E] text-left text-xs text-indigo-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all flex items-center gap-2 font-mono"
              >
                <Video className="w-3.5 h-3.5 shrink-0" />
                <span>Render AI Short Video Scripts</span>
              </button>

              <button
                onClick={() => setChatInput("Dial inbound sales lead & qualify budget")}
                className="w-full p-2.5 rounded-xl bg-[#09090D] border border-[#22222E] text-left text-xs text-purple-300 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center gap-2 font-mono"
              >
                <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                <span>Dial Lead & Qualify Budget</span>
              </button>

              <button
                onClick={() => setChatInput("Scrape 50 tech brand managers & pitch media kit")}
                className="w-full p-2.5 rounded-xl bg-[#09090D] border border-[#22222E] text-left text-xs text-blue-300 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all flex items-center gap-2 font-mono"
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span>Scrape Sponsor Emails & Pitch</span>
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendCommand} className="space-y-3 pt-2">
              <textarea
                rows={3}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type command for agents (e.g. 'Create short video script and call lead Sarah')..."
                className="w-full p-3 rounded-xl bg-[#09090D] border border-[#22222E] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans resize-none"
              />
              
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isProcessing}
                className="w-full justify-center"
                icon={<Send className="w-4 h-4" />}
              >
                {isProcessing ? "Processing Command..." : "Execute Across Agents"}
              </Button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
