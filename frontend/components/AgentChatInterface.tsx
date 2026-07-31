"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, PhoneCall, Globe, Terminal, Volume2, CheckCircle2, Play, RefreshCw, Zap } from "lucide-react";
import { Button } from "./ui/Button";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  agentType?: "caller" | "browser" | "cli" | "orchestrator";
  actionCard?: {
    type: "call" | "browser" | "cli";
    title: string;
    details: string[];
  };
}

export default function AgentChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "agent",
      text: "Hello! I'm Millo AI, your agent operating system assistant. I can coordinate Phone Callers, Browser Control, and CLI pipelines for Sales Agencies and Content Creators. How can I help you execute today?",
      timestamp: "Just now",
      agentType: "orchestrator"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<"orchestrator" | "caller" | "browser" | "cli">("orchestrator");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetPrompts = [
    {
      label: "🎥 Pitch YouTube Media Kit to Tech Sponsors",
      prompt: "Deploy Browser Agent to scrape 25 tech brand manager emails and auto-submit our Q3 media kit rate card."
    },
    {
      label: "📞 Qualify Inbound Lead via Voice Call",
      prompt: "Initiate Phone Caller Agent to dial inbound lead Sarah Jenkins, qualify her $50k B2B budget, and book Thursday demo."
    },
    {
      label: "⚡ Run Full Multi-Agent Pipeline",
      prompt: "Run Orchestration Mesh: Browser Agent finds leads -> Caller Agent dials & qualifies -> CLI Agent updates HubSpot CRM."
    },
    {
      label: "💻 Generate Automated Sponsor Report",
      prompt: "Deploy CLI Ops Agent to aggregate YouTube analytics, compile sponsor PDF report, and trigger Slack alert."
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Simulate intelligent agent response based on prompt keywords
    setTimeout(() => {
      let agentMsg: ChatMessage;

      if (text.toLowerCase().includes("sponsor") || text.toLowerCase().includes("youtube") || text.toLowerCase().includes("media kit")) {
        agentMsg = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          agentType: "browser",
          text: "Understood. Launching Browser Control Agent for Creator Sponsorship Outreach.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCard: {
            type: "browser",
            title: "Browser Agent // Sponsor Outreach Active",
            details: [
              "Navigated to Brand Partnerships Directory",
              "Extracted 25 verified Brand Manager contacts",
              "Auto-filled & submitted Q3 Media Kit rate card ($15k CPM base)"
            ]
          }
        };
      } else if (text.toLowerCase().includes("call") || text.toLowerCase().includes("dial") || text.toLowerCase().includes("qualify")) {
        agentMsg = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          agentType: "caller",
          text: "Initiating Phone Caller Agent. Dialing prospect with sub-350ms neural voice latency...",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCard: {
            type: "call",
            title: "Phone Agent // Live Call Status: Qualified",
            details: [
              "On Call with Prospect: Sarah Jenkins (SaaSify Inc.)",
              "Objection Handled: Custom SDR workflow vs manual VAs",
              "Outcome: Demo booked for Thursday at 2:00 PM EST"
            ]
          }
        };
      } else if (text.toLowerCase().includes("pipeline") || text.toLowerCase().includes("report") || text.toLowerCase().includes("cli")) {
        agentMsg = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          agentType: "cli",
          text: "Executing CLI / Ops Agent backend script.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCard: {
            type: "cli",
            title: "CLI Ops // Execution Bus Completed",
            details: [
              "Command: orbital-ops sync --source sponsor-crm --dest hubspot",
              "Processed 142 records | Synced to HubSpot & Slack",
              "Total execution duration: 1.18 seconds"
            ]
          }
        };
      } else {
        agentMsg = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          agentType: "orchestrator",
          text: `Executing workflow: "${text}". Dispatching task across Phone, Browser, and CLI multi-agent mesh.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCard: {
            type: "call",
            title: "Orchestration Mesh // Multi-Agent Handoff Active",
            details: [
              "Browser Agent: Discovered & enriched lead contacts",
              "Phone Agent: Qualifies prospect budget over live voice",
              "CLI Agent: Logs call transcript & updates CRM stage"
            ]
          }
        };
      }

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section id="chat-agent" className="py-24 md:py-32 bg-[#0B0B0F] border-t border-[#1C1C26] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-900/20 via-purple-900/20 to-blue-900/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            CONVERSATIONAL AGENT INTERFACE
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Chat with Millo Agent OS <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              in natural language.
            </span>
          </h2>

          <p className="text-base text-[#A1A1AA]">
            Command your Phone, Browser, and CLI agents through a single unified conversational workspace.
          </p>
        </div>

        {/* Preset Prompt Pills */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {presetPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              className="px-3.5 py-2 rounded-full bg-[#141419] border border-[#22222E] text-xs text-gray-300 hover:text-white hover:border-purple-500/50 transition-all font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Conversational Window */}
        <div className="rounded-[24px] bg-[#141419] border border-[#22222E] p-4 sm:p-6 shadow-2xl flex flex-col h-[580px] justify-between relative overflow-hidden">
          
          {/* Chat Window Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#22222E] shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  Millo Intelligence
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">Multi-Agent Mesh Controller</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="hidden sm:inline">Active Mode:</span>
              <span className="text-purple-400 font-semibold bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
                Agencies & Creators
              </span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "agent" && (
                  <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 h-fit shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md"
                        : "bg-[#09090D] border border-[#22222E] text-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Action Card inside Agent Response */}
                  {msg.actionCard && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 rounded-xl bg-[#0E0E14] border border-purple-500/30 space-y-2 font-mono text-xs text-gray-300"
                    >
                      <div className="text-purple-400 font-semibold text-[11px] flex items-center justify-between border-b border-gray-800 pb-1.5">
                        <span>{msg.actionCard.title}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="space-y-1 text-[11px]">
                        {msg.actionCard.details.map((detail, dIdx) => (
                          <div key={dIdx} className="text-gray-300 flex items-center gap-1.5">
                            <span className="text-emerald-400">&gt;</span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div className="text-[10px] font-mono text-gray-500 px-1">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 h-fit shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-purple-400 font-mono p-2"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Millo Agent OS is processing instructions...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-3 border-t border-[#22222E] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell Millo Agent what to execute (e.g. 'Pitch sponsor media kit', 'Call lead Sarah')..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#09090D] border border-[#22222E] text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
            />
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isTyping}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>

        </div>

      </div>
    </section>
  );
}
