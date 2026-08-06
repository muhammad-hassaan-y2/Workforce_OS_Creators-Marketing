"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Spinner, Runner, PulseDot } from "@/components/ui/Spinner";
import { 
  runAgentTask, 
  runBedrockOrchestration, 
  fetchThreads, 
  createThread, 
  fetchThreadMessages, 
  postChatMessage,
  deleteThread
} from "@/lib/api";
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
  AlertTriangle,
  LayoutGrid,
  PhoneOff,
  MicOff,
  BarChart3,
  ArrowRight,
  Radio,
  Trash2,
  EyeOff,
  ShieldAlert
} from "lucide-react";

interface AgentModel {
  id: "mesh" | "sales" | "objection" | "brand" | "creator" | "planner" | "conflict" | "phone" | "video" | "browser" | "cli";
  name: string;
  badge: string;
  tagline: string;
  icon: any;
  color: string;
  accentBorder: string;
  placeholder: string;
  category: "sales" | "creation" | "ops" | "orchestration";
  usageMetrics: {
    totalRuns: number;
    avgLatency: string;
    successRate: string;
  };
}

const AGENT_MODELS: AgentModel[] = [
  {
    id: "mesh",
    name: "AWS Bedrock Multi-Agent Mesh",
    badge: "All Agents Synchronized",
    tagline: "Coordinates Sales, Objection Handling, Brand Memory, PM Planner & Auditor in parallel.",
    icon: Cpu,
    color: "bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold",
    accentBorder: "border-amber-500/60",
    placeholder: "Ask AWS Bedrock Multi-Agent Mesh or command all specialized agents...",
    category: "orchestration",
    usageMetrics: { totalRuns: 1240, avgLatency: "0.88s", successRate: "99.8%" }
  },
  {
    id: "sales",
    name: "Jordan // B2B Sales Agent",
    badge: "The Closer (AWS Bedrock)",
    tagline: "Qualifies B2B leads, pitches product value & drives deals toward demos/contracts.",
    icon: Briefcase,
    color: "bg-amber-500 text-black font-bold",
    accentBorder: "border-amber-400/60",
    placeholder: "Tell Jordan to pitch or qualify a lead (e.g. 'Pitch CloudSuite to mid-market ops director')...",
    category: "sales",
    usageMetrics: { totalRuns: 450, avgLatency: "0.29s", successRate: "98.5%" }
  },
  {
    id: "objection",
    name: "ObjectionHandler // Diplomat Agent",
    badge: "Reframer (AWS Bedrock)",
    tagline: "Diagnoses real objections, reframes with verified facts & empathy.",
    icon: ShieldCheck,
    color: "bg-orange-500 text-white font-bold",
    accentBorder: "border-orange-500/60",
    placeholder: "Ask ObjectionHandler to resolve buyer doubts (e.g. 'Why should we trust 99.9% SLA?')...",
    category: "sales",
    usageMetrics: { totalRuns: 280, avgLatency: "0.31s", successRate: "97.2%" }
  },
  {
    id: "phone",
    name: "Phone Caller Voice Agent",
    badge: "Sub-310ms Neural Voice",
    tagline: "Natural voice outbound/inbound calls, objection handling & CRM booking.",
    icon: PhoneCall,
    color: "bg-yellow-400 text-black font-bold",
    accentBorder: "border-yellow-400/60",
    placeholder: "Tell Voice Agent who to call or qualify (e.g. 'Dial Sarah Jenkins at SaaSify')...",
    category: "sales",
    usageMetrics: { totalRuns: 310, avgLatency: "0.28s", successRate: "99.1%" }
  },
  {
    id: "brand",
    name: "Archive // Brand Guardian",
    badge: "Institutional Memory",
    tagline: "Stores brand guidelines, positioning & checks draft copy consistency.",
    icon: Sparkles,
    color: "bg-purple-600 text-white font-bold",
    accentBorder: "border-purple-500/60",
    placeholder: "Ask Archive to check consistency (e.g. 'Does this email violate our brand tone?')...",
    category: "orchestration",
    usageMetrics: { totalRuns: 620, avgLatency: "0.24s", successRate: "100%" }
  },
  {
    id: "video",
    name: "AI Video Creation Agent",
    badge: "4K Render Engine",
    tagline: "Generates 4K Short Video scripts, MP4 rendering & Media Kit distribution.",
    icon: Video,
    color: "bg-indigo-600 text-white font-bold",
    accentBorder: "border-indigo-500/60",
    placeholder: "Tell Video Agent what content to generate (e.g. 'Render 4K YouTube short')...",
    category: "creation",
    usageMetrics: { totalRuns: 190, avgLatency: "1.45s", successRate: "96.8%" }
  },
  {
    id: "browser",
    name: "Browser Control Agent",
    badge: "DOM Auto-Scraper",
    tagline: "Navigates target sites, extracts sponsor leads & auto-fills forms.",
    icon: Globe,
    color: "bg-blue-600 text-white font-bold",
    accentBorder: "border-blue-500/60",
    placeholder: "Tell Browser Agent what to scrape (e.g. 'Extract 50 tech brand managers')...",
    category: "ops",
    usageMetrics: { totalRuns: 890, avgLatency: "1.12s", successRate: "97.5%" }
  },
  {
    id: "cli",
    name: "CLI / Backend Ops Agent",
    badge: "Terminal Execution",
    tagline: "Runs headless bash scripts, webhooks & CRM database sync.",
    icon: Terminal,
    color: "bg-emerald-600 text-white font-bold",
    accentBorder: "border-emerald-500/60",
    placeholder: "Type bash command or CLI job (e.g. 'sync hubspot --dest slack')...",
    category: "ops",
    usageMetrics: { totalRuns: 1100, avgLatency: "0.35s", successRate: "99.9%" }
  },
  {
    id: "planner",
    name: "Atlas // PM Planning Agent",
    badge: "The Strategist",
    tagline: "Decomposes goals into owned task plans with clear dependencies.",
    icon: Layers,
    color: "bg-teal-600 text-white font-bold",
    accentBorder: "border-teal-500/60",
    placeholder: "Ask Atlas to create a rollout plan (e.g. 'Plan 50-node enterprise customer deployment')...",
    category: "orchestration",
    usageMetrics: { totalRuns: 340, avgLatency: "0.42s", successRate: "98.9%" }
  },
  {
    id: "conflict",
    name: "Warden // PM Conflict Scanner",
    badge: "The Auditor",
    tagline: "Scans inter-agent messages & plans for timeline contradictions or brand violations.",
    icon: AlertTriangle,
    color: "bg-red-600 text-white font-bold",
    accentBorder: "border-red-500/60",
    placeholder: "Ask Warden to scan for conflicts (e.g. 'Audit current rollout plan for timeline clashes')...",
    category: "orchestration",
    usageMetrics: { totalRuns: 210, avgLatency: "0.38s", successRate: "99.4%" }
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
  const [activeTab, setActiveTab] = useState<"chat" | "dashboard">("chat");
  const [activeAgent, setActiveAgent] = useState<AgentModel>(AGENT_MODELS[0]);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState("thread-1");
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Live Neural Voice Call Modal State
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isCallActive) {
      timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("kaiso_access_token");
      const rawUser = localStorage.getItem("kaiso_user");
      if (!token || !rawUser) {
        router.push("/?auth=login");
        return;
      }
      try {
        setCurrentUser(JSON.parse(rawUser));
      } catch {
        router.push("/?auth=login");
      }
    }
  }, [router]);

  const [isIncognito, setIsIncognito] = useState<boolean>(false);

  const [threads, setThreads] = useState<Array<{ id: string; title: string; time: string }>>([
    { id: "thread-1", title: "AWS Bedrock 6-Agent Session", time: "Just now" }
  ]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "thread-1": []
  });

  const handleDeleteThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteThread(threadId);
      const updated = threads.filter(t => t.id !== threadId);
      setThreads(updated);
      if (activeThreadId === threadId) {
        setActiveThreadId(updated.length > 0 ? updated[0].id : "");
      }
    } catch (err) {
      console.error("Delete thread failed:", err);
      // Fallback local delete
      const updated = threads.filter(t => t.id !== threadId);
      setThreads(updated);
      if (activeThreadId === threadId) {
        setActiveThreadId(updated.length > 0 ? updated[0].id : "");
      }
    }
  };

  // 1. Fetch User Session Threads from Neon PostgreSQL DB on Mount
  useEffect(() => {
    async function loadDBThreads() {
      try {
        const dbThreads = await fetchThreads();
        if (dbThreads && dbThreads.length > 0) {
          setThreads(dbThreads.map(t => ({
            id: t.id,
            title: t.title,
            time: new Date(t.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
          setActiveThreadId(dbThreads[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadDBThreads();
  }, []);

  // 2. Fetch Messages for Active Thread from Neon DB
  useEffect(() => {
    async function loadMessages() {
      if (!activeThreadId) return;
      try {
        const dbMsgs = await fetchThreadMessages(activeThreadId);
        if (dbMsgs) {
          const formatted: ChatMessage[] = dbMsgs.map(m => ({
            id: m.id,
            sender: m.sender as "user" | "assistant",
            text: m.text,
            agentId: m.agent_id,
            agentWidget: m.agent_widget,
            timestamp: m.timestamp
          }));
          setMessages(prev => ({ ...prev, [activeThreadId]: formatted }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadMessages();
  }, [activeThreadId]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeThreadId, isGenerating, activeTab]);

  const currentMessages = messages[activeThreadId] || [];

  // 3. Send Message, Save in DB & Trigger AWS Bedrock Agent
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput.trim();
    setChatInput("");
    setIsGenerating(true);

    let targetThreadId = activeThreadId;

    // Auto-create thread if none is active
    if (!targetThreadId) {
      try {
        const newThread = await createThread(userText.slice(0, 30), activeAgent.id);
        targetThreadId = newThread.id;
        setActiveThreadId(targetThreadId);
        setThreads(prev => [{ id: newThread.id, title: newThread.title, time: "Just now" }, ...prev]);
      } catch (err) {
        console.error("Auto thread creation failed:", err);
        targetThreadId = `thread-${Date.now()}`;
        setActiveThreadId(targetThreadId);
      }
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Optimistically add User Message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: "user",
      text: userText,
      agentId: activeAgent.id,
      timestamp: nowStr
    };

    setMessages(prev => ({
      ...prev,
      [targetThreadId]: [...(prev[targetThreadId] || []), tempUserMsg]
    }));

    try {
      const resp = await postChatMessage(targetThreadId, userText, activeAgent.id);
      
      if (resp && resp.user_message && resp.assistant_message) {
        const userMsg: ChatMessage = {
          id: resp.user_message.id,
          sender: "user",
          text: resp.user_message.text,
          agentId: resp.user_message.agent_id,
          timestamp: resp.user_message.timestamp
        };
        const assistantMsg: ChatMessage = {
          id: resp.assistant_message.id,
          sender: "assistant",
          text: resp.assistant_message.text,
          agentId: resp.assistant_message.agent_id,
          agentWidget: resp.assistant_message.agent_widget,
          timestamp: resp.assistant_message.timestamp
        };

        setMessages(prev => ({
          ...prev,
          [targetThreadId]: [...(prev[targetThreadId] || []).filter(m => !m.id.startsWith("temp-")), userMsg, assistantMsg]
        }));
      } else {
        const dbMsgs = await fetchThreadMessages(targetThreadId);
        if (dbMsgs && dbMsgs.length > 0) {
          const formatted: ChatMessage[] = dbMsgs.map(m => ({
            id: m.id,
            sender: m.sender as "user" | "assistant",
            text: m.text,
            agentId: m.agent_id,
            agentWidget: m.agent_widget,
            timestamp: m.timestamp
          }));
          setMessages(prev => ({ ...prev, [targetThreadId]: formatted }));
        }
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "❌ Unable to connect to LLM agent server. Please make sure FastAPI backend on http://localhost:8000 is running.",
        timestamp: nowStr
      };
      setMessages(prev => ({
        ...prev,
        [targetThreadId]: [...(prev[targetThreadId] || []), errorMsg]
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAgentForChat = async (agent: AgentModel) => {
    setActiveAgent(agent);
    try {
      const newThread = await createThread(`${agent.name} Session`, agent.id);
      setThreads(prev => [{ id: newThread.id, title: newThread.title, time: "Just now" }, ...prev]);
      setActiveThreadId(newThread.id);
      setMessages(prev => ({ ...prev, [newThread.id]: [] }));
    } catch (err) {
      const fallbackId = `thread-${Date.now()}`;
      setThreads(prev => [{ id: fallbackId, title: `${agent.name} Session`, time: "Just now" }, ...prev]);
      setActiveThreadId(fallbackId);
      setMessages(prev => ({ ...prev, [fallbackId]: [] }));
    }
    setActiveTab("chat");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewThread = async () => {
    try {
      const newThread = await createThread("New Agent Session", activeAgent.id);
      setThreads(prev => [{ id: newThread.id, title: newThread.title, time: "Just now" }, ...prev]);
      setActiveThreadId(newThread.id);
      setMessages(prev => ({ ...prev, [newThread.id]: [] }));
    } catch (err) {
      const fallbackId = `thread-${Date.now()}`;
      setThreads(prev => [{ id: fallbackId, title: "New Agent Session", time: "Just now" }, ...prev]);
      setActiveThreadId(fallbackId);
      setMessages(prev => ({ ...prev, [fallbackId]: [] }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-[#090814] text-[#F5F5F7] flex overflow-hidden font-sans selection:bg-amber-500 selection:text-black">
      
      {/* 1. Left Sidebar (Teleport Theme Matched) */}
      <aside className="w-68 bg-[#110E26]/80 backdrop-blur-2xl border-r border-[#231F42] flex flex-col justify-between p-3.5 shrink-0 hidden md:flex">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 pt-1">
            <Logo size={32} />
          </div>

          {/* View Switcher: Chat vs Agent Usage Dashboard */}
          <div className="p-1 rounded-xl bg-[#1A1638] border border-[#2F2959] flex items-center gap-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "chat" 
                  ? "bg-gradient-to-r from-amber-500 to-red-500 text-black shadow-md font-extrabold" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Agent Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "dashboard" 
                  ? "bg-gradient-to-r from-amber-500 to-red-500 text-black shadow-md font-extrabold" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Agent Hub</span>
            </button>
          </div>

          <button
            onClick={handleNewThread}
            className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#1E1940] to-[#151130] border border-[#352E63] text-white text-xs font-semibold hover:border-amber-500/60 transition-all flex items-center justify-between shadow-lg group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>New Session</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">⌘N</span>
          </button>

          {/* Quick Voice Call Launcher Button */}
          <button
            onClick={() => setIsCallActive(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Launch Neural Voice Call</span>
          </button>

          {/* Threads List */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-2 py-1 font-bold flex items-center justify-between">
              <span>Persistent DB Threads</span>
              <span className="text-amber-400">Synced</span>
            </div>
            <div className="space-y-1 max-h-[44vh] overflow-y-auto scrollbar-none pr-1">
              {threads.map(t => {
                const isActive = t.id === activeThreadId;
                return (
                  <div key={t.id} className="relative group flex items-center">
                    <button
                      onClick={() => {
                        setActiveThreadId(t.id);
                        setActiveTab("chat");
                      }}
                      className={`w-full text-left py-2 px-3 rounded-lg text-xs transition-all flex items-center justify-between ${
                        isActive 
                          ? "bg-[#231D4A] text-white font-semibold border border-amber-500/40 shadow-md" 
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate pr-6">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-400" : "text-gray-500"}`} />
                        <span className="truncate">{t.title}</span>
                      </span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteThread(t.id, e)}
                      className="absolute right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all shrink-0 z-10"
                      title="Delete Chat Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer — User Session Status */}
        <div className="pt-3 border-t border-[#231F42] flex items-center justify-between text-xs text-gray-400">
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

      {/* 2. Main Workspace */}
      <main className="flex-1 flex flex-col justify-between bg-[#090814] relative overflow-hidden">
        
        {/* HEADER BAR */}
        <header className="h-16 border-b border-[#231F42] bg-[#110E26]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#171433] border border-[#302859] text-xs font-bold text-white hover:border-amber-500/60 transition-all shadow-md group"
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
                <div className="absolute top-12 left-0 w-84 sm:w-96 rounded-2xl bg-[#161233] border border-[#352E63] p-3 shadow-2xl z-50 space-y-1.5 max-h-[70vh] overflow-y-auto scrollbar-none animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-2 py-1 font-semibold flex items-center justify-between">
                    <span>Select Active Agent Worker</span>
                    <span className="text-amber-400">10 Agents Online</span>
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
                          ? "bg-[#251E4F] border border-amber-500/50 shadow-md" 
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
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsIncognito(!isIncognito)}
              className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                isIncognito
                  ? "bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse"
                  : "bg-white/5 border-[#302859] text-gray-400 hover:text-white"
              }`}
              title="Private Incognito Mode (Messages won't be saved to DB)"
            >
              <EyeOff className="w-3.5 h-3.5 text-purple-400" />
              <span>{isIncognito ? "Incognito Active" : "Private Mode"}</span>
            </button>

            <button
              onClick={() => setIsCallActive(true)}
              className="py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Voice Call Mode</span>
            </button>
          </div>

        </header>

        {/* 3. TAB CONTENT: CHAT VIEW vs AGENT PLATFORM USAGE DASHBOARD */}
        {activeTab === "chat" ? (
          /* CONVERSATIONAL CHAT VIEW */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl w-full mx-auto scrollbar-none flex flex-col justify-between">
            <div className="space-y-6 flex-1">
              
              {/* Incognito Mode Banner */}
              {isIncognito && (
                <div className="py-2.5 px-4 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-300 text-xs font-mono text-center flex items-center justify-center gap-2 shadow-lg">
                  <ShieldAlert className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>🕵️ Private Incognito Mode Active — Messages are transient and not saved to DB</span>
                </div>
              )}

              {currentMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                  <div className={`p-4 rounded-2xl ${activeAgent.color} shadow-2xl animate-pulse`}>
                    <activeAgent.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{activeAgent.name} Ready</h3>
                    <p className="text-xs text-gray-400 max-w-md mt-1">{activeAgent.tagline}</p>
                  </div>
                </div>
              ) : (
                currentMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex gap-3 sm:gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "assistant" && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-black font-extrabold text-xs shrink-0 shadow-lg mt-0.5" title="Kaiso AI Agent">
                        <Sparkles className="w-4.5 h-4.5 text-black fill-black" />
                      </div>
                    )}

                    <div className={`space-y-2 max-w-[85%] sm:max-w-[78%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                      
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-medium rounded-tr-none"
                          : "bg-[#161233] border border-[#302859] text-gray-100 rounded-tl-none"
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>



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
                      <div className="w-8 h-8 rounded-xl bg-[#251E4F] border border-purple-500/40 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-amber-400" />
                      </div>
                    )}
                  </div>
                ))
              )}

              {isGenerating && (
                <div className="flex gap-3 items-center text-xs text-amber-400 font-mono bg-[#161233] p-3 rounded-xl border border-amber-500/30 w-fit">
                  <Runner color="yellow" />
                  <span>AWS Bedrock Agent reasoning & saving to database...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>
          </div>
        ) : (
          /* AGENT PLATFORM SELECTION & USAGE DASHBOARD */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl w-full mx-auto scrollbar-none">
            <div className="flex items-center justify-between border-b border-[#231F42] pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <span>Agent Hub & Usage Analytics</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Inspect active agent workers, performance metrics & launch custom conversational sessions.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-[#161233] px-3 py-1.5 rounded-xl border border-[#302859] font-mono">
                <PulseDot color="emerald" /> 10 Active Agent Workers Online
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGENT_MODELS.map(agent => (
                <div 
                  key={agent.id}
                  className="rounded-2xl bg-[#14102E] border border-[#2D2654] p-4 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all shadow-xl group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${agent.color} shadow-md`}>
                        <agent.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                        {agent.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {agent.tagline}
                      </p>
                    </div>

                    {/* Live Usage Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#0B091B] border border-[#231F42] text-[10px] font-mono">
                      <div>
                        <div className="text-gray-500 uppercase">Runs</div>
                        <div className="text-white font-bold">{agent.usageMetrics.totalRuns}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 uppercase">Latency</div>
                        <div className="text-amber-400 font-bold">{agent.usageMetrics.avgLatency}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 uppercase">Success</div>
                        <div className="text-emerald-400 font-bold">{agent.usageMetrics.successRate}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectAgentForChat(agent)}
                    className="w-full py-2 px-3 rounded-xl bg-[#211B47] border border-[#3A316B] text-white text-xs font-bold hover:bg-gradient-to-r hover:from-amber-500 hover:to-red-500 hover:text-black transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Launch Chat with Agent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCKED INSTRUCTION COMMAND INPUT (When in Chat View) */}
        {activeTab === "chat" && (
          <footer className="p-4 sm:p-6 bg-[#090814] border-t border-[#231F42] sticky bottom-0">
            <div className="max-w-4xl mx-auto space-y-2.5">
              
              {/* Quick Agent Shortcut Pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs">
                <span className="text-[10px] font-mono text-gray-500 uppercase font-bold shrink-0">Quick Actions:</span>
                <button
                  onClick={() => setChatInput("Pitch CloudSuite workflow automation to an enterprise buyer")}
                  className="px-2.5 py-1 rounded-lg bg-[#161233] border border-[#302859] text-gray-300 hover:text-amber-400 hover:border-amber-500/50 transition-all shrink-0 text-[11px]"
                >
                  🎯 Pitch Product
                </button>
                <button
                  onClick={() => setChatInput("Address objection: 'Why should we trust 99.9% uptime SLA?'")}
                  className="px-2.5 py-1 rounded-lg bg-[#161233] border border-[#302859] text-gray-300 hover:text-amber-400 hover:border-amber-500/50 transition-all shrink-0 text-[11px]"
                >
                  🤝 Handle Objection
                </button>
                <button
                  onClick={() => setIsCallActive(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shrink-0 text-[11px] flex items-center gap-1 font-bold"
                >
                  <PhoneCall className="w-3 h-3 text-emerald-400" />
                  <span>Call Lead</span>
                </button>
                <button
                  onClick={() => setChatInput("Create a 50-node enterprise customer rollout plan")}
                  className="px-2.5 py-1 rounded-lg bg-[#161233] border border-[#302859] text-gray-300 hover:text-amber-400 hover:border-amber-500/50 transition-all shrink-0 text-[11px]"
                >
                  🗺 Rollout Plan
                </button>
              </div>

              {/* Input Form Box */}
              <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
                <div className="relative flex-1">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={1}
                    placeholder={`Ask ${activeAgent.name} to pitch product, handle objections, or automate workflows... (Shift + Enter for new line)`}
                    className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-[#161233] border border-[#302859] text-white text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-amber-500/60 transition-all shadow-inner resize-none min-h-[48px] max-h-36 scrollbar-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isGenerating}
                    className="absolute right-3 bottom-3.5 p-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-black hover:brightness-110 transition-all disabled:opacity-40 disabled:hover:brightness-100 shadow-md"
                    title="Send message (Enter)"
                  >
                    <Send className="w-4 h-4 fill-black text-black" />
                  </button>
                </div>
              </form>
            </div>
          </footer>
        )}

      </main>

      {/* 4. LIVE NEURAL VOICE CALL MODAL INTERFACE */}
      {isCallActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#120E2B] border border-amber-500/40 p-6 shadow-2xl text-center space-y-6 relative overflow-hidden">
            
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Sub-310ms Voice Stream
              </span>
              <span>{formatTime(callDuration)}</span>
            </div>

            <div className="space-y-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-1 shadow-[0_0_40px_rgba(255,138,0,0.4)] animate-pulse">
                <div className="w-full h-full rounded-full bg-[#120E2B] flex items-center justify-center">
                  <PhoneCall className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">Phone Caller Voice Agent</h3>
              <p className="text-xs text-amber-400 font-mono">Jordan // B2B Neural Sales Voice</p>
            </div>

            {/* Visualizer Soundwave Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-12">
              <div className="w-1.5 bg-amber-400 rounded-full h-8 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 bg-orange-400 rounded-full h-12 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 bg-red-500 rounded-full h-6 animate-bounce" style={{ animationDelay: '300ms' }} />
              <div className="w-1.5 bg-amber-400 rounded-full h-10 animate-bounce" style={{ animationDelay: '450ms' }} />
              <div className="w-1.5 bg-orange-400 rounded-full h-7 animate-bounce" style={{ animationDelay: '100ms' }} />
            </div>

            {/* Real-time Voice Transcript Streaming Box */}
            <div className="p-3.5 rounded-2xl bg-[#0A0819] border border-[#231F42] text-left text-xs font-mono text-gray-300 space-y-1.5 max-h-32 overflow-y-auto scrollbar-none">
              <p className="text-amber-400 font-bold">[Agent]: "Hi Sarah, calling from Kaiso Agent OS regarding outbound SDR automation."</p>
              <p className="text-gray-400">[Lead]: "We need automated lead qualification and calendar booking."</p>
              <p className="text-emerald-400 font-bold">[Agent]: "Demo scheduled for Thursday at 2:00 PM EST."</p>
            </div>

            {/* Call Control Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full border transition-all ${
                  isMuted ? "bg-red-500/20 border-red-500 text-red-400" : "bg-[#251E4F] border-[#3B3078] text-white hover:text-amber-400"
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsCallActive(false)}
                className="p-4 rounded-full bg-red-600 text-white hover:bg-red-500 transition-all shadow-xl hover:scale-105"
              >
                <PhoneOff className="w-6 h-6 fill-white" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
