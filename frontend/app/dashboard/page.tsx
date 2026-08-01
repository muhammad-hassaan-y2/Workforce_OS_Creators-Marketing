"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
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
  Cpu
} from "lucide-react";

interface AgentModel {
  id: "mesh" | "phone" | "video" | "browser" | "cli";
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
    name: "Kaiso-4o Multi-Agent Mesh",
    badge: "All Agents Synchronized",
    tagline: "Coordinates Phone, Video Creation, Browser, and CLI agents automatically.",
    icon: Cpu,
    color: "bg-purple-600 text-white",
    accentBorder: "border-purple-500/50",
    placeholder: "Ask Kaiso-4o Mesh or command all agents simultaneously..."
  },
  {
    id: "phone",
    name: "Phone Caller Agent",
    badge: "Sub-350ms Neural Voice",
    tagline: "Natural voice outbound/inbound calls, objection handling & CRM booking.",
    icon: PhoneCall,
    color: "bg-yellow-400 text-black font-bold",
    accentBorder: "border-yellow-400/50",
    placeholder: "Tell Phone Agent who to call or qualify (e.g. 'Dial Sarah Jenkins at SaaSify')..."
  },
  {
    id: "video",
    name: "AI Video & Content Creation Agent",
    badge: "4K Render Engine",
    tagline: "Generates 4K Short Video scripts, MP4 rendering & Media Kit distribution.",
    icon: Video,
    color: "bg-indigo-600 text-white",
    accentBorder: "border-indigo-500/50",
    placeholder: "Tell Video Agent what content to generate (e.g. 'Render 4K YouTube short')..."
  },
  {
    id: "browser",
    name: "Browser Control Agent",
    badge: "DOM Auto-Scraper",
    tagline: "Navigates target sites, extracts sponsor leads & auto-fills forms.",
    icon: Globe,
    color: "bg-blue-600 text-white",
    accentBorder: "border-blue-500/50",
    placeholder: "Tell Browser Agent what to scrape (e.g. 'Extract 50 tech brand managers')..."
  },
  {
    id: "cli",
    name: "CLI / Backend Ops Agent",
    badge: "Terminal Execution",
    tagline: "Runs headless bash scripts, webhooks & CRM database sync.",
    icon: Terminal,
    color: "bg-emerald-600 text-white",
    accentBorder: "border-emerald-500/50",
    placeholder: "Type bash command or CLI job (e.g. 'sync hubspot --dest slack')..."
  }
];

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  agentId?: "mesh" | "phone" | "video" | "browser" | "cli";
  agentWidget?: {
    type: "phone" | "video" | "browser" | "cli";
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sidebar Threads (ChatGPT / Claude style)
  const [threads, setThreads] = useState([
    { id: "thread-1", title: "Sponsorship Outreach & Media Kit", time: "Just now" },
    { id: "thread-2", title: "Inbound SDR Voice Call - SaaSify", time: "2h ago" },
    { id: "thread-3", title: "LinkedIn VP Scraping Pipeline", time: "Yesterday" },
    { id: "thread-4", title: "HubSpot CRM & Video Render Sync", time: "3 days ago" },
  ]);

  // Messages per thread
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "thread-1": [
      {
        id: "1",
        sender: "assistant",
        agentId: "mesh",
        text: "Hello! You are currently using Kaiso-4o Multi-Agent Mesh. You can switch to individual agents (Phone Caller, AI Video Creation, Browser Control, CLI Ops) using the top Agent Selector.",
        timestamp: "09:14 AM"
      },
      {
        id: "2",
        sender: "user",
        text: "Scrape 50 brand managers from TechDirectory, pitch our Q3 YouTube media kit, and render a 4K promotional video short.",
        timestamp: "09:15 AM"
      },
      {
        id: "3",
        sender: "assistant",
        agentId: "browser",
        text: "Browser Control Agent active. Dispatched target web session for sponsor lead extraction.",
        timestamp: "09:15 AM",
        agentWidget: {
          type: "browser",
          title: "Browser Control Agent // Active Session",
          details: {
            url: "https://linkedin.com/sales/search/brand-managers",
            extractedCount: 50,
            status: "Auto-submitted Media Kit ($15k CPM base rate sheet) to 50 brand inquiry forms."
          }
        }
      },
      {
        id: "4",
        sender: "assistant",
        agentId: "video",
        text: "AI Video Creation Agent has generated the video script and initialized 4K MP4 rendering.",
        timestamp: "09:16 AM",
        agentWidget: {
          type: "video",
          title: "AI Content & Video Creation // Render Engine",
          details: {
            script: "'Stop losing 60% of your day to SDR busywork. Kaiso deploys AI agents that place calls and scale deals...'",
            progress: 92,
            resolution: "4K UHD (3840x2160)",
            target: "YouTube Shorts & Reels"
          }
        }
      }
    ]
  });

  const currentMessages = messages[activeThreadId] || [];
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isGenerating]);

  const handleSendMessage = (textOverride?: string) => {
    const text = textOverride || chatInput;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), newMsg]
    }));

    if (!textOverride) setChatInput("");
    setIsGenerating(true);

    setTimeout(() => {
      let replyMsg: ChatMessage;

      if (activeAgent.id === "phone") {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          agentId: "phone",
          text: `[Phone Caller Agent] Initiating live outbound call session. Sub-350ms neural speech engine connected for instruction: "${text}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "phone",
            title: "Phone Caller Agent // Live Call Connected",
            details: {
              lead: "Sarah Jenkins (VP Sales, SaaSify Inc.)",
              duration: "01:45",
              transcript: [
                "Agent: Hi Sarah, calling to qualify your lead enrichment workflow.",
                "Sarah: We're looking to automate our SDR prospecting.",
                "Agent: Demo scheduled for Thursday at 2:00 PM EST."
              ]
            }
          }
        };
      } else if (activeAgent.id === "video") {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          agentId: "video",
          text: `[AI Video Creation Agent] Generated 4K video script & initialized MP4 rendering pipeline for: "${text}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "video",
            title: "AI Video Creation // Render Engine Active",
            details: {
              script: `'Rendered short video script for ${text}...'`,
              progress: 95,
              resolution: "4K UHD 60FPS",
              target: "YouTube Shorts & Instagram Reels"
            }
          }
        };
      } else if (activeAgent.id === "browser") {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          agentId: "browser",
          text: `[Browser Control Agent] DOM navigation complete. Extracted contacts & submitted forms for: "${text}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "browser",
            title: "Browser Control Agent // Web Session",
            details: {
              url: "https://linkedin.com/sales/search/active",
              extractedCount: 50,
              status: "Extracted 50 verified contact profiles & submitted forms."
            }
          }
        };
      } else if (activeAgent.id === "cli") {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          agentId: "cli",
          text: `[CLI Ops Agent] Execution bus stdout complete for instruction: "${text}".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "cli",
            title: "CLI Ops // Execution Bus Log",
            details: {
              command: `orbital-cli exec --task "${text}"`,
              logs: [
                "[SUCCESS] Synced 142 records to HubSpot CRM database",
                "[SUCCESS] Dispatched alert notification to Slack channel #agent-alerts",
                "[STATUS] Execution cycle completed in 1.15s"
              ]
            }
          }
        };
      } else {
        // Multi-Agent Mesh
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          agentId: "mesh",
          text: `[Kaiso-4o Multi-Agent Mesh] Task "${text}" dispatched in parallel across Phone, Video Creation, Browser, and CLI agents.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "browser",
            title: "Multi-Agent Mesh // Parallel Execution",
            details: {
              url: "https://orbital-os.internal/mesh",
              extractedCount: 50,
              status: "All 4 agents executing parallel workflow cycles."
            }
          }
        };
      }

      setMessages((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), replyMsg]
      }));
      setIsGenerating(false);
    }, 1000);
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
      [newId]: [
        {
          id: Date.now().toString(),
          sender: "assistant",
          agentId: activeAgent.id,
          text: `Active Agent: ${activeAgent.name}. Type instructions below or select another agent from the top selector.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    });
  };

  return (
    <div className="h-screen bg-[#0B0B0F] text-[#F5F5F7] flex overflow-hidden font-sans selection:bg-purple-600 selection:text-white">
      
      {/* 1. Left Sidebar (ChatGPT / Claude Style) */}
      <aside className="w-64 bg-[#111116] border-r border-[#22222E] flex flex-col justify-between p-3.5 shrink-0 hidden md:flex">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 pt-1">
            <Logo size={28} />
            <Link href="/" className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-xs flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing</span>
            </Link>
          </div>

          <button
            onClick={handleNewThread}
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#1A1A24] border border-[#2A2A38] text-white text-xs font-semibold hover:bg-[#222230] hover:border-purple-500/40 transition-all flex items-center justify-between shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" />
              <span>New Conversation</span>
            </span>
            <span className="text-[10px] font-mono text-gray-400 font-normal">⌘K</span>
          </button>

          {/* Conversations History */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider px-2 font-semibold">
              Agent Workspaces
            </div>
            
            <div className="space-y-0.5 max-h-[380px] overflow-y-auto pr-1">
              {threads.map((t) => {
                const isActive = activeThreadId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`w-full text-left py-2 px-2.5 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                      isActive
                        ? "bg-[#1C1C28] text-white font-semibold border border-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-purple-400" : "text-gray-500"}`} />
                      <span className="truncate">{t.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 border-t border-[#22222E] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-yellow-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
              O
            </div>
            <div className="truncate">
              <div className="text-white font-semibold text-xs leading-none">Operator Pro</div>
              <div className="text-[10px] font-mono text-purple-400 mt-0.5">Agency & Creator Plan</div>
            </div>
          </div>
          <Settings className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
        </div>

      </aside>

      {/* 2. Main ChatGPT / Claude Style Canvas */}
      <main className="flex-1 flex flex-col justify-between bg-[#0B0B0F] relative overflow-hidden">
        
        {/* EXPLICIT AGENT SELECTOR HEADER (ChatGPT / Claude Model Dropdown) */}
        <header className="h-16 border-b border-[#1C1C26] bg-[#0E0E14]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          
          <div className="relative">
            {/* Agent Selector Trigger Pill */}
            <button
              onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#141419] border border-[#262638] text-xs font-bold text-white hover:border-purple-500/60 transition-all shadow-md group"
            >
              <div className={`p-1 rounded-lg ${activeAgent.color}`}>
                <activeAgent.icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>{activeAgent.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                    {activeAgent.badge}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isAgentMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Agent Selection Dropdown Modal/Menu */}
            {isAgentMenuOpen && (
              <div className="absolute top-12 left-0 w-80 sm:w-96 rounded-2xl bg-[#14141E] border border-[#2A2A3C] p-3 shadow-2xl z-50 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-2 py-1 font-semibold flex items-center justify-between">
                  <span>SELECT ACTIVE AI AGENT MODEL:</span>
                  <span className="text-emerald-400">4 ONLINE</span>
                </div>

                {AGENT_MODELS.map((agent) => {
                  const isSelected = activeAgent.id === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setActiveAgent(agent);
                        setIsAgentMenuOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                        isSelected
                          ? "bg-[#1E1E2C] border-purple-500/60 shadow-md"
                          : "bg-[#09090D] border-transparent hover:border-gray-700 hover:bg-[#12121A]"
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${agent.color}`}>
                        <agent.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{agent.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-400 leading-snug font-normal">{agent.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE MESH ACTIVE
            </span>
            <Link href="/" className="md:hidden text-xs text-gray-400 hover:text-white">Landing</Link>
          </div>
        </header>

        {/* Central Chat Thread */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto w-full">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "assistant" && (
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.agentId === "phone" ? "bg-yellow-400 text-black font-bold" :
                  msg.agentId === "video" ? "bg-indigo-600 text-white" :
                  msg.agentId === "browser" ? "bg-blue-600 text-white" :
                  msg.agentId === "cli" ? "bg-emerald-600 text-white" : "bg-purple-600 text-white"
                }`}>
                  {msg.agentId === "phone" ? <PhoneCall className="w-4 h-4" /> :
                   msg.agentId === "video" ? <Video className="w-4 h-4" /> :
                   msg.agentId === "browser" ? <Globe className="w-4 h-4" /> :
                   msg.agentId === "cli" ? <Terminal className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
              )}

              <div className="space-y-3 max-w-[88%] sm:max-w-[80%]">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1C1C28] text-white rounded-br-none border border-purple-500/30 shadow-md font-medium"
                      : "bg-[#141419] text-gray-200 rounded-bl-none border border-[#22222E]"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Inline Agent Widget */}
                {msg.agentWidget && (
                  <div className="p-4 rounded-2xl bg-[#09090D] border border-purple-500/40 space-y-3 font-mono text-xs shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                        {msg.agentWidget.type === "phone" && <PhoneCall className="w-4 h-4 text-yellow-400" />}
                        {msg.agentWidget.type === "video" && <Video className="w-4 h-4 text-indigo-400" />}
                        {msg.agentWidget.type === "browser" && <Globe className="w-4 h-4 text-blue-400" />}
                        {msg.agentWidget.type === "cli" && <Terminal className="w-4 h-4 text-emerald-400" />}
                        <span>{msg.agentWidget.title}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        EXECUTED
                      </span>
                    </div>

                    {msg.agentWidget.type === "phone" && (
                      <div className="space-y-2">
                        <div className="text-gray-400">Lead: <span className="text-white font-bold">{msg.agentWidget.details.lead}</span></div>
                        <div className="space-y-1 text-gray-300 italic bg-[#141419] p-3 rounded-xl border border-white/5 text-[11px]">
                          {msg.agentWidget.details.transcript?.map((t: string, tIdx: number) => (
                            <div key={tIdx}>{t}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.agentWidget.type === "video" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-300">
                          <span>Progress: {msg.agentWidget.details.progress}%</span>
                          <span className="text-indigo-400">{msg.agentWidget.details.resolution}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-400" style={{ width: `${msg.agentWidget.details.progress}%` }} />
                        </div>
                        <div className="text-gray-400 italic text-[11px]">{msg.agentWidget.details.script}</div>
                      </div>
                    )}

                    {msg.agentWidget.type === "browser" && (
                      <div className="space-y-1 text-gray-300">
                        <div className="text-blue-400">URL: {msg.agentWidget.details.url}</div>
                        <div className="text-emerald-400">&gt; {msg.agentWidget.details.status}</div>
                      </div>
                    )}

                    {msg.agentWidget.type === "cli" && (
                      <div className="space-y-1 text-gray-300">
                        <div className="text-emerald-400">Command: {msg.agentWidget.details.command}</div>
                        {msg.agentWidget.details.logs?.map((l: string, lIdx: number) => (
                          <div key={lIdx} className="text-gray-400">{l}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500 px-1">
                  <span>{msg.timestamp}</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:text-gray-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-3 text-xs text-purple-400 font-mono">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{activeAgent.name} is processing instruction...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 3. Floating ChatGPT / Claude Prompt Input Dock with Quick Agent Switcher Chips */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F] to-transparent sticky bottom-0 z-30">
          <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Quick 1-Click Agent Selection Bar */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {AGENT_MODELS.map((agent) => {
                const isActive = activeAgent.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgent(agent)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                      isActive
                        ? "bg-purple-600 text-white border-purple-400 shadow-md scale-105"
                        : "bg-[#141419] text-gray-400 border-[#22222E] hover:text-white"
                    }`}
                  >
                    <agent.icon className="w-3.5 h-3.5" />
                    <span>{agent.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Prompt Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className={`relative flex items-center rounded-3xl bg-[#141419] border ${activeAgent.accentBorder} shadow-2xl transition-all p-2`}
            >
              <button type="button" className="p-2.5 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>

              <textarea
                rows={1}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={activeAgent.placeholder}
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none font-sans resize-none max-h-32"
              />

              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isGenerating || !chatInput.trim()}
                className="rounded-full p-2.5 w-9 h-9 flex items-center justify-center shrink-0"
                icon={<Send className="w-4 h-4" />}
              >
                <span className="sr-only">Send</span>
              </Button>
            </form>

            <div className="text-[10px] text-center text-gray-500 font-mono flex items-center justify-center gap-2">
              <span>Active Agent: <strong className="text-purple-400">{activeAgent.name}</strong></span>
              <span>&bull;</span>
              <span>Sub-350ms Latency</span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
