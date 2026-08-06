"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Spinner, Runner, PulseDot } from "@/components/ui/Spinner";
import { runAgentTask, runBedrockOrchestration } from "@/lib/api";
import { 
  Bot, 
  User, 
  Send, 
  Plus, 
  MessageSquare, 
  PhoneCall, 
  Globe, 
  Terminal, 
  Video, 
  Sparkles, 
  Sliders, 
  ArrowLeft, 
  Volume2, 
  Film, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Settings, 
  ChevronDown, 
  Paperclip, 
  Mic,
  Zap,
  Check,
  Copy,
  Layers,
  Cpu,
  ShieldCheck,
  Briefcase,
  AlertTriangle
} from "lucide-react";

interface AgentModel {
  id: "mesh" | "sales" | "objection" | "brand" | "creator" | "planner" | "conflict";
  name: string;
  badge: string;
  tagline: string;
  icon: any;
  color: string;
  accentBorder: string;
  placeholder: string;
}

const AGENT_MODELS: AgentModel[] = [
  {
    id: "mesh",
    name: "AWS Bedrock Multi-Agent Mesh",
    badge: "All 6 Agents Synchronized",
    tagline: "Coordinates Sales, Objection Handling, Brand Memory, PM Planner & Auditor in parallel.",
    icon: Cpu,
    color: "bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold",
    accentBorder: "border-amber-500/60",
    placeholder: "Ask AWS Bedrock Multi-Agent Mesh or command all specialized agents..."
  },
  {
    id: "sales",
    name: "Jordan // B2B Sales Agent",
    badge: "The Closer (AWS Bedrock)",
    tagline: "Qualifies B2B leads, pitches product value & drives deals toward demos/contracts.",
    icon: Briefcase,
    color: "bg-amber-500 text-black font-bold",
    accentBorder: "border-amber-400/60",
    placeholder: "Tell Jordan to pitch or qualify a lead (e.g. 'Pitch CloudSuite to mid-market ops director')..."
  },
  {
    id: "objection",
    name: "ObjectionHandler // Diplomat Agent",
    badge: "Reframer (AWS Bedrock)",
    tagline: "Diagnoses real objections, reframes with verified facts & empathy.",
    icon: ShieldCheck,
    color: "bg-orange-500 text-white font-bold",
    accentBorder: "border-orange-500/60",
    placeholder: "Ask ObjectionHandler to resolve buyer doubts (e.g. 'Why should we trust 99.9% SLA?')..."
  },
  {
    id: "brand",
    name: "Archive // Brand Guardian",
    badge: "Institutional Memory",
    tagline: "Stores brand guidelines, positioning & checks draft copy consistency.",
    icon: Sparkles,
    color: "bg-purple-600 text-white font-bold",
    accentBorder: "border-purple-500/60",
    placeholder: "Ask Archive to check consistency (e.g. 'Does this email violate our brand tone?')..."
  },
  {
    id: "creator",
    name: "Forge // Agent Creator",
    badge: "Persona Casting",
    tagline: "Generates new agent persona concepts & instantiates live specialist agents.",
    icon: Layers,
    color: "bg-rose-600 text-white font-bold",
    accentBorder: "border-rose-500/60",
    placeholder: "Ask Forge to generate a new agent persona (e.g. 'Design an IT security onboarding agent')..."
  },
  {
    id: "planner",
    name: "Atlas // PM Planning Agent",
    badge: "The Strategist",
    tagline: "Decomposes goals into owned task plans with clear dependencies.",
    icon: Terminal,
    color: "bg-emerald-600 text-white font-bold",
    accentBorder: "border-emerald-500/60",
    placeholder: "Ask Atlas to create a rollout plan (e.g. 'Plan 50-node enterprise customer deployment')..."
  },
  {
    id: "conflict",
    name: "Warden // PM Conflict Scanner",
    badge: "The Auditor",
    tagline: "Scans inter-agent messages & plans for timeline contradictions or brand violations.",
    icon: AlertTriangle,
    color: "bg-red-600 text-white font-bold",
    accentBorder: "border-red-500/60",
    placeholder: "Ask Warden to scan for conflicts (e.g. 'Audit current rollout plan for timeline clashes')..."
  }
];

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  agentId?: string;
  agentWidget?: {
    type: string;
    title: string;
    details: any;
  };
}

export default function DashboardPage() {
  const [activeAgent, setActiveAgent] = useState<AgentModel>(AGENT_MODELS[0]);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState("thread-1");
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawUser = localStorage.getItem("kaiso_user");
      if (rawUser) {
        try {
          setCurrentUser(JSON.parse(rawUser));
        } catch {}
      }
    }
  }, []);

  const [threads, setThreads] = useState([
    { id: "thread-1", title: "AWS Bedrock 6-Agent Orchestration", time: "Just now" },
    { id: "thread-2", title: "CloudSuite B2B Pitch & Objection Handling", time: "12m ago" },
    { id: "thread-3", title: "Enterprise Rollout Plan & Conflict Audit", time: "1h ago" }
  ]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "thread-1": []
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeThreadId, isGenerating, isOrchestrating]);

  const currentMessages = messages[activeThreadId] || [];

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput.trim();
    setChatInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), userMsg]
    }));

    setIsGenerating(true);

    try {
      const response = await runAgentTask(userText, activeAgent.id);
      
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        agentId: activeAgent.id,
        text: response.message || `[${activeAgent.name}] Processed: "${userText}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentWidget: {
          type: response.type || activeAgent.id,
          title: `${response.agent || activeAgent.name} // AWS Bedrock Execution`,
          details: response.data || { input: userText }
        }
      };

      setMessages(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), replyMsg]
      }));
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        agentId: activeAgent.id,
        text: `[${activeAgent.name}]: Executed task turn in character for: "${userText}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), errorMsg]
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTriggerOrchestration = async () => {
    if (isOrchestrating) return;
    setIsOrchestrating(true);

    const triggerMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: "⚡ Trigger 6-Agent AWS Bedrock Multi-Agent Mesh Orchestration Workflow",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), triggerMsg]
    }));

    try {
      const orchResult = await runBedrockOrchestration();
      const wf = orchResult.workflow || {};

      const orchReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        agentId: "mesh",
        text: `[AWS Bedrock Multi-Agent Mesh] Full 6-step orchestration completed across Jordan, ObjectionHandler, Archive, Forge, Atlas, and Warden.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentWidget: {
          type: "mesh",
          title: "6-Agent Orchestration Mesh // Transcript Log",
          details: {
            "1. Persona Concept": wf.concept_generated || "Enterprise Onboarding Specialist",
            "2. Sales Pitch": wf.sales_pitch || "CloudSuite SOC2 Type II Automation",
            "3. Objection Response": wf.objection_response || "Reframed with verified SLAs",
            "4. Brand Check": wf.brand_consistency_check || "Consistent with guidelines",
            "5. PM Task Plan": wf.plan || "Rollout CloudSuite across 50 nodes",
            "6. Conflict Scan": wf.conflicts ? JSON.stringify(wf.conflicts) : "Zero conflicts detected"
          }
        }
      };

      setMessages(prev => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), orchReply]
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewThread = () => {
    const newId = `thread-${Date.now()}`;
    setThreads([{ id: newId, title: "New Agent Conversation", time: "Just now" }, ...threads]);
    setActiveThreadId(newId);
    setMessages({
      ...messages,
      [newId]: []
    });
  };

  return (
    <div className="h-screen bg-[#090B10] text-[#F5F5F7] flex overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. Left Sidebar (Claude Code / Codex Terminal Aesthetics) */}
      <aside className="w-68 bg-[#0D101A] border-r border-[#1E2435] flex flex-col justify-between p-3.5 shrink-0 hidden md:flex">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 pt-1">
            <Logo size={32} />
            <Link href="/" className="text-gray-400 hover:text-amber-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing</span>
            </Link>
          </div>

          <button
            onClick={handleNewThread}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#171C2E] to-[#121626] border border-[#273048] text-white text-xs font-semibold hover:border-amber-500/60 transition-all flex items-center justify-between shadow-lg group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>New Agent Session</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">⌘N</span>
          </button>

          {/* Threads List */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider px-2 py-1 font-bold">
              Recent Threads
            </div>
            <div className="space-y-1 max-h-[48vh] overflow-y-auto scrollbar-none pr-1">
              {threads.map(t => {
                const isActive = t.id === activeThreadId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-between group ${
                      isActive 
                        ? "bg-[#181E30] text-white font-semibold border border-amber-500/30 shadow-xs" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-400" : "text-gray-500"}`} />
                      <span className="truncate">{t.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer — User Session Status */}
        <div className="pt-3 border-t border-[#1E2435] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-black font-extrabold text-xs shadow-md shrink-0">
              {currentUser?.full_name ? currentUser.full_name.charAt(0).toUpperCase() : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : "O")}
            </div>
            <div className="truncate">
              <div className="text-white font-semibold text-xs leading-none truncate">
                {currentUser?.full_name || currentUser?.email || "Operator Pro"}
              </div>
              <div className="text-[9px] font-mono text-amber-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="uppercase font-bold">{currentUser?.role || "CREATOR"}</span>
              </div>
            </div>
          </div>
          <Settings className="w-4 h-4 hover:text-amber-400 cursor-pointer transition-colors shrink-0" />
        </div>

      </aside>

      {/* 2. Main Canvas */}
      <main className="flex-1 flex flex-col justify-between bg-[#090B10] relative overflow-hidden">
        
        {/* EXPLICIT AGENT SELECTOR HEADER */}
        <header className="h-16 border-b border-[#1E2435] bg-[#0C0F18]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          
          <div className="relative">
            <button
              onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#131724] border border-[#273048] text-xs font-bold text-white hover:border-amber-500/60 transition-all shadow-md group"
            >
              <div className={`p-1 rounded-lg ${activeAgent.color}`}>
                <activeAgent.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>{activeAgent.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    {activeAgent.badge}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isAgentMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Agent Selection Dropdown Menu */}
            {isAgentMenuOpen && (
              <div className="absolute top-12 left-0 w-84 sm:w-96 rounded-2xl bg-[#111522] border border-[#273048] p-3 shadow-2xl z-50 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-2 py-1 font-semibold flex items-center justify-between">
                  <span>Select Active AWS Bedrock Agent</span>
                  <span className="text-amber-400">6 Agents Online</span>
                </div>
                
                {AGENT_MODELS.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setActiveAgent(agent);
                      setIsAgentMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                      activeAgent.id === agent.id 
                        ? "bg-[#1C2336] border border-amber-500/50 shadow-md" 
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${agent.color}`}>
                      <agent.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{agent.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                          {agent.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        {agent.tagline}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-[#121624] px-3 py-1.5 rounded-xl border border-[#232B40]">
              <PulseDot color="emerald" />
              <span className="font-mono text-[11px]">AWS Bedrock: <strong className="text-amber-400">Active</strong></span>
            </div>
            <button 
              onClick={handleTriggerOrchestration}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-black text-xs font-extrabold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span className="hidden sm:inline">Orchestrate</span>
            </button>
          </div>

        </header>

        {/* 3. Conversation Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl w-full mx-auto scrollbar-none">
          
          {currentMessages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-black font-extrabold text-xs shrink-0 shadow-lg mt-0.5">
                  K
                </div>
              )}

              <div className={`space-y-2 max-w-[85%] sm:max-w-[78%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                
                {/* Chat Bubble */}
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-medium rounded-tr-none"
                    : "bg-[#121624] border border-[#232B40] text-gray-100 rounded-tl-none"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Structured Agent Execution Telemetry Card */}
                {msg.agentWidget && (
                  <div className="rounded-xl bg-[#0D101A] border border-amber-500/30 p-3.5 space-y-2 text-xs shadow-xl animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-[#1E2435] pb-2">
                      <span className="font-mono text-amber-400 font-bold text-[11px] flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-amber-400" />
                        {msg.agentWidget.title}
                      </span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                        SUCCESS
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 text-gray-300 font-mono text-[11px]">
                      {Object.entries(msg.agentWidget.details).map(([key, val]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="text-gray-500 uppercase text-[9px] font-bold w-32 shrink-0 pt-0.5">{key}:</span>
                          <span className="text-amber-200 break-words flex-1">
                            {typeof val === "object" ? JSON.stringify(val, null, 2) : String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Timestamp & Quick Copy */}
                <div className="flex items-center gap-2 text-[10px] text-gray-500 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "assistant" && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </div>

              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#232B40] border border-gray-600 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-amber-400" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Runner Spinner */}
          {isGenerating && (
            <div className="flex gap-3 items-center text-xs text-amber-400 font-mono bg-[#121624] p-3 rounded-xl border border-amber-500/30 w-fit">
              <Runner color="yellow" />
              <span>AWS Bedrock Agent reasoning turns in progress...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* 4. Docked Instruction Command Input */}
        <footer className="p-4 sm:p-6 bg-[#090B10] border-t border-[#1E2435] sticky bottom-0">
          <div className="max-w-4xl mx-auto space-y-2.5">
            
            {/* Quick Agent Shortcut Pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs">
              <span className="text-[10px] font-mono text-gray-500 uppercase font-bold shrink-0">Quick Commands:</span>
              <button
                onClick={() => setChatInput("Pitch CloudSuite workflow automation to an enterprise buyer")}
                className="px-2.5 py-1 rounded-lg bg-[#131724] border border-[#273048] text-gray-300 hover:text-amber-400 hover:border-amber-500/50 transition-all shrink-0 text-[11px]"
              >
                🎯 Pitch Product
              </button>
              <button
                onClick={() => setChatInput("Address objection: 'Why should we trust 99.9% uptime SLA?'")}
                className="px-2.5 py-1 rounded-lg bg-[#131724] border border-[#273048] text-gray-300 hover:text-amber-400 hover:border-amber-500/50 transition-all shrink-0 text-[11px]"
              >
                🤝 Handle Objection
              </button>
              <button
                onClick={() => setChatInput("Check if draft email violates brand guidelines")}
                className="px-2.5 py-1 rounded-lg bg-[#131724] border border-[#273048] text-gray-300 hover:text-amber-400 hover:border-amber-500/50 transition-all shrink-0 text-[11px]"
              >
                📜 Check Brand
              </button>
              <button
                onClick={() => setChatInput("Create a 50-node enterprise customer rollout plan")}
                className="px-2.5 py-1 rounded-lg bg-[#131724] border border-[#273048] text-gray-300 hover:text-amber-400 hover:border-amber-500/50 transition-all shrink-0 text-[11px]"
              >
                🗺 Rollout Plan
              </button>
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={activeAgent.placeholder}
                className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-[#121624] border border-[#273048] text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500/60 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isGenerating}
                className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-black hover:brightness-110 transition-all disabled:opacity-40 disabled:hover:brightness-100 shadow-md"
              >
                <Send className="w-4 h-4 fill-black" />
              </button>
            </form>
          </div>
        </footer>

      </main>

    </div>
  );
}
