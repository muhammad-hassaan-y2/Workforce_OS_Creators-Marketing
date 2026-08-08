"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { fetchLeadDetails, updateLead, postChatMessage } from "@/lib/api";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;

  const [lead, setLead] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [editingBudget, setEditingBudget] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadDetails(leadId).then((data) => {
      setLead(data.lead);
      setEditingBudget(data.lead.budget_confirmed || "$65,000");
      setTimeline(data.timeline || []);
      setChatMessages([
        { sender: "assistant", agent: "Jordan", text: `Hi! I am Jordan. I qualified ${data.lead.name} from ${data.lead.company} regarding outbound SDR automation.` },
        { sender: "user", text: "They mentioned pricing is 30% higher than expected." },
        { sender: "assistant", agent: "ObjectionHandler", text: "ObjectionHandler engaged — price objection ($499 floor verified). Validating budget expectations and reframing ROI savings of $185,000." }
      ]);
      setLoading(false);
    });
  }, [leadId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);

    try {
      const res = await postChatMessage(`thread-lead-${leadId}`, userMsg, "sales");
      if (res && res.assistant_message) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            agent: res.assistant_message.agent_id || "Jordan",
            text: res.assistant_message.text
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHumanBudgetSave = async () => {
    try {
      const updated = await updateLead(leadId, { budget_confirmed: editingBudget });
      setLead(updated);
      setTimeline((prev) => [
        { id: `log-${Date.now()}`, type: "human_edit", user: "Manager (Hassaan)", action: `Updated Budget Confirmed to ${editingBudget}`, timestamp: "Just now" },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !lead) {
    return <div className="min-h-screen bg-[#0A0D14] text-white p-12 text-center">Loading Lead File #{leadId}...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 space-y-6">
      {/* Header Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
            <span>/</span>
            <Link href="/leads" className="hover:text-cyan-400">Leads</Link>
            <span>/</span>
            <span className="text-white font-medium">{lead.company} ({lead.name})</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {lead.company}
            <span className="text-xs bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold px-3 py-1 rounded-full uppercase">
              Stage: {lead.stage}
            </span>
          </h1>
        </div>

        <Link href="/leads" className="px-4 py-2 bg-[#121824] border border-gray-700 hover:bg-gray-800 rounded-xl text-xs font-semibold">
          ← Back to Lead Kanban
        </Link>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Interactive Agent Chat & Objection Tracking */}
        <div className="lg:col-span-7 bg-[#121824] border border-gray-800 rounded-2xl p-4 flex flex-col h-[700px] shadow-2xl">
          <div className="border-b border-gray-800 pb-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-bold text-white">Live Deal Room Chat</span>
            </div>
            {lead.needs_objection_handling && (
              <span className="text-[11px] font-bold bg-amber-950 border border-amber-500/60 text-amber-300 px-3 py-1 rounded-full flex items-center gap-1">
                ⚠️ ObjectionHandler Engaged — Price Objection ($499 Floor Verified)
              </span>
            )}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none"
                    : msg.agent === "ObjectionHandler"
                    ? "bg-amber-950/60 border border-amber-500/40 text-amber-100 rounded-bl-none"
                    : "bg-[#1A2233] border border-gray-700 text-gray-200 rounded-bl-none"
                }`}
              >
                {msg.sender === "assistant" && (
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-[10px] uppercase tracking-wider ${msg.agent === "ObjectionHandler" ? "text-amber-300" : "text-cyan-400"}`}>
                      🤖 {msg.agent || "Jordan"}
                    </span>
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Send message to Jordan or ObjectionHandler..."
              className="flex-1 bg-[#1A2233] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2.5 rounded-xl text-xs transition">
              Send
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Structured Lead Info & Activity Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Structured Panel */}
          <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-cyan-400 border-b border-gray-800 pb-2">
              📊 Structured Lead Qualification Panel
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#1A2233] p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 block">Contact Name</span>
                <span className="font-bold text-white">{lead.name}</span>
              </div>
              <div className="bg-[#1A2233] p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 block">Qualification Score</span>
                <span className="font-bold text-emerald-400 text-sm">{lead.qualification_score} / 100</span>
              </div>
            </div>

            <div className="bg-[#1A2233] p-3 rounded-xl border border-gray-800 space-y-2">
              <label className="text-[10px] text-gray-400 block font-semibold">
                Budget Confirmed (Human Edit vs AI Action)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingBudget}
                  onChange={(e) => setEditingBudget(e.target.value)}
                  className="flex-1 bg-[#0A0D14] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-bold"
                />
                <button
                  onClick={handleHumanBudgetSave}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition"
                >
                  Save Edit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#1A2233] p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 block">Target Timeline</span>
                <span className="font-semibold text-white">{lead.timeline || "Q3 2026"}</span>
              </div>
              <div className="bg-[#1A2233] p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 block">Lead Source</span>
                <span className="font-semibold text-cyan-400">{lead.source}</span>
              </div>
            </div>

            <div className="bg-[#1A2233] p-3 rounded-xl border border-gray-800">
              <span className="text-[10px] text-gray-400 block mb-1">Jordan ROI Tool Projection</span>
              <p className="text-xs font-bold text-emerald-400">{lead.roi_projection || "340% ROI ($185,000 annual savings)"}</p>
            </div>
          </div>

          {/* Full Activity Timeline */}
          <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-sm font-bold text-white border-b border-gray-800 pb-2 mb-4 flex items-center justify-between">
              <span>🕒 Activity & Audit Timeline</span>
              <span className="text-[10px] text-gray-400 font-normal">Human Edits vs AI Actions</span>
            </h2>

            <div className="space-y-3 text-xs">
              {timeline.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border ${
                    log.type === "human_edit"
                      ? "bg-indigo-950/50 border-indigo-500/40 text-indigo-200"
                      : "bg-[#1A2233] border-gray-800 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-cyan-400">
                      {log.type === "human_edit" ? `👤 ${log.user}` : `🤖 ${log.agent}`}
                    </span>
                    <span className="text-[10px] text-gray-500">{log.timestamp}</span>
                  </div>
                  <p className="font-medium">{log.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
