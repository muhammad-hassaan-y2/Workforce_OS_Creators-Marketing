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
  LogOut, 
  ChevronDown, 
  Paperclip, 
  Mic,
  Zap,
  ShieldCheck,
  Code2,
  Copy,
  Check
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  agentWidget?: {
    type: "phone" | "video" | "browser" | "cli";
    title: string;
    details: any;
  };
}

export default function DashboardPage() {
  const [selectedModel, setSelectedModel] = useState("Orbital-4o Multi-Agent Mesh");
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

  // Active Conversations per thread
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "thread-1": [
      {
        id: "1",
        sender: "assistant",
        text: "Hello! I am Orbital Agentic OS, running your synchronized multi-agent mesh. All 4 core agents (Phone Voice Caller, AI Video Creation, Browser Control, and CLI Backend Ops) are online and ready.",
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
        text: "Understood. I have dispatched parallel tasks across the Browser Control Agent and AI Video Creation Engine.",
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
        text: "AI Video Creation Agent has completed scriptwriting and is currently rendering the 4K MP4 video asset.",
        timestamp: "09:16 AM",
        agentWidget: {
          type: "video",
          title: "AI Content & Video Creation // Render Engine",
          details: {
            script: "'Stop losing 60% of your day to SDR busywork. Orbital deploys AI agents that place calls and scale deals...'",
            progress: 88,
            resolution: "4K UHD (3840x2160)",
            target: "YouTube Shorts & Reels"
          }
        }
      }
    ],
    "thread-2": [
      {
        id: "101",
        sender: "assistant",
        text: "Inbound call session initialized for lead Sarah Jenkins (SaaSify Inc.). Phone Caller Agent active with sub-310ms neural voice latency.",
        timestamp: "07:30 AM",
        agentWidget: {
          type: "phone",
          title: "Phone Caller Agent // Live Call Connected",
          details: {
            lead: "Sarah Jenkins (VP Sales, SaaSify Inc.)",
            duration: "02:45",
            transcript: [
              "Agent: Hi Sarah, I saw SaaSify expanded its SDR team. Are you currently handling lead enrichment manually?",
              "Sarah: We are. Reps spend 2 hours a day copying LinkedIn data.",
              "Agent: Orbital browser agents handle that 24/7. Should we pencil in a 10-min demo for Thursday at 2 PM?",
              "Sarah: Thursday at 2 PM works great. Send over the invite."
            ]
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
      const lower = text.toLowerCase();

      if (lower.includes("video") || lower.includes("render")) {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: "I have initialized the AI Video & Content Creation Agent. Rendering 4K video short & media kit preview.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "video",
            title: "AI Video Creation // 4K Render Engine",
            details: {
              script: "'Deploy autonomous agents that create video, place calls, and close sponsorships...'",
              progress: 92,
              resolution: "4K UHD 60FPS",
              target: "YouTube & Instagram Reels"
            }
          }
        };
      } else if (lower.includes("call") || lower.includes("dial")) {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: "Initiating Phone Caller Agent. Dialing prospect with sub-350ms neural speech engine...",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "phone",
            title: "Phone Caller Agent // Active Call Session",
            details: {
              lead: "Outbound Sales Prospect",
              duration: "01:20",
              transcript: [
                "Agent: Hi, calling from Orbital Agent OS to qualify your inbound request.",
                "Lead: Yes, we need automated lead enrichment and call qualification.",
                "Agent: Perfect. Calendar invitation dispatched for Thursday."
              ]
            }
          }
        };
      } else if (lower.includes("cli") || lower.includes("script")) {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: "Executing CLI / Ops Agent backend bash execution bus...",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "cli",
            title: "CLI Ops // Execution Bus Output",
            details: {
              command: "orbital-cli sync --dest hubspot-crm --webhook active",
              logs: [
                "[09:18:02] Synced 142 records to HubSpot CRM pipeline",
                "[09:18:05] Dispatched Slack notification to #agent-alerts",
                "[09:18:08] Execution cycle completed in 1.12s"
              ]
            }
          }
        };
      } else {
        replyMsg = {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: `Executing instruction: "${text}". Dispatching across Phone, Video Creation, Browser, and CLI agents.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentWidget: {
            type: "browser",
            title: "Browser Control Agent // Web Session",
            details: {
              url: "https://orbital-agent-os.internal/mesh",
              extractedCount: 25,
              status: "Auto-submitted task payload to target web portals."
            }
          }
        };
      }

      setMessages((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || []), replyMsg]
      }));
      setIsGenerating(false);
    }, 1100);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewThread = () => {
    const newId = `thread-${Date.now()}`;
    const newThread = {
      id: newId,
      title: "New Agentic Conversation",
      time: "Just now"
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newId);
    setMessages({
      ...messages,
      [newId]: [
        {
          id: Date.now().toString(),
          sender: "assistant",
          text: "New workspace initialized. Command your Phone, Video Creation, Browser, or CLI agents below.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    });
  };

  return (
    <div className="h-screen bg-[#0B0B0F] text-[#F5F5F7] flex overflow-hidden font-sans selection:bg-purple-600 selection:text-white">
      
      {/* 1. ChatGPT / Claude Style Left Sidebar */}
      <aside className="w-64 bg-[#111116] border-r border-[#22222E] flex flex-col justify-between p-3.5 shrink-0 hidden md:flex">
        
        <div className="space-y-4">
          {/* Header Logo & Back to Landing */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Logo size={28} />
            <Link href="/" className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-xs flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing</span>
            </Link>
          </div>

          {/* New Chat Button (ChatGPT style) */}
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

          {/* Conversations History List */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider px-2 font-semibold">
              Recent Agent Workspaces
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

        {/* Sidebar Footer User Profile */}
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

      {/* 2. Main Central ChatGPT / Claude Conversation Canvas */}
      <main className="flex-1 flex flex-col justify-between bg-[#0B0B0F] relative overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-14 border-b border-[#1C1C26] bg-[#0E0E14]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          
          {/* Model Selector Dropdown (ChatGPT 4o / Claude 3.5 style) */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141419] border border-[#22222E] text-xs font-semibold text-white hover:border-purple-500/50 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{selectedModel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              4 AGENTS WORKING LIVE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono hidden md:inline">Latency: <span className="text-emerald-400">12ms</span></span>
            <Link href="/" className="md:hidden text-xs text-gray-400 hover:text-white">Landing</Link>
          </div>
        </header>

        {/* Central Chat Thread Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto w-full">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-3 max-w-[88%] sm:max-w-[80%]`}>
                
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1C1C28] text-white rounded-br-none border border-purple-500/30 shadow-md font-medium"
                      : "bg-[#141419] text-gray-200 rounded-bl-none border border-[#22222E]"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Inline Agentic Widget Inside Message (Phone / Video / Browser / CLI) */}
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

                    {/* Phone Call Widget */}
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

                    {/* Video Creation Render Widget */}
                    {msg.agentWidget.type === "video" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-300">
                          <span>Progress: {msg.agentWidget.details.progress}%</span>
                          <span className="text-indigo-400">{msg.agentWidget.details.resolution}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-400" style={{ width: `${msg.agentWidget.details.progress}%` }} />
                        </div>
                        <div className="text-gray-400 italic text-[11px]">"{msg.agentWidget.details.script}"</div>
                      </div>
                    )}

                    {/* Browser Control Widget */}
                    {msg.agentWidget.type === "browser" && (
                      <div className="space-y-1 text-gray-300">
                        <div className="text-blue-400">URL: {msg.agentWidget.details.url}</div>
                        <div className="text-emerald-400">&gt; {msg.agentWidget.details.status}</div>
                      </div>
                    )}

                    {/* CLI Ops Widget */}
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

                {/* Message Actions Bar */}
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
              <span>Orbital-4o Multi-Agent Mesh is generating response...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 3. Floating ChatGPT / Claude Prompt Input Dock */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F] to-transparent sticky bottom-0 z-30">
          <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Quick Agent Prompt Chips */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { label: "🎥 Render 4K Video Script", prompt: "Generate 4K video script & render MP4 short for YouTube" },
                { label: "📞 Dial Lead & Qualify", prompt: "Initiate Phone Caller Agent to dial lead Sarah and qualify budget" },
                { label: "🌐 Scrape Brand Sponsors", prompt: "Deploy Browser Agent to scrape brand emails & submit media kit" },
                { label: "💻 Sync CLI Database", prompt: "Execute CLI Ops Agent to sync HubSpot CRM & trigger Slack alerts" },
              ].map((chip, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleSendMessage(chip.prompt)}
                  className="px-3 py-1.5 rounded-full bg-[#141419] border border-[#22222E] text-[11px] text-gray-300 hover:text-white hover:border-purple-500/50 whitespace-nowrap transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* ChatGPT Floating Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center rounded-3xl bg-[#141419] border border-[#22222E] shadow-2xl focus-within:border-purple-500/60 transition-all p-2"
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
                placeholder="Ask Orbital-4o or command active Phone, Video, Browser, CLI agents (Enter to send)..."
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

            <div className="text-[10px] text-center text-gray-500 font-mono">
              Orbital-4o Multi-Agent Operating System &bull; Auto-Guardrails Active
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
