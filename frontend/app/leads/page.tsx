"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchLeads } from "@/lib/api";

const STAGES = ["NEW", "QUALIFIED", "OBJECTION", "PROPOSAL_SENT", "CLOSED_WON", "CLOSED_LOST"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads().then((data) => {
      setLeads(data);
      setLoading(false);
    });
  }, []);

  const getSourceIcon = (source: string) => {
    if (source === "google_ads") return "🔍 Google Ads";
    if (source === "meta_lead") return "📱 Meta Lead";
    return "🌐 Organic";
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
            <span>/</span>
            <span className="text-white font-medium">Lead Management Kanban</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Outbound & Inbound Sales Pipeline
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#121824] p-1 border border-gray-800 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "kanban" ? "bg-cyan-500 text-black shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              📊 Kanban Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "table" ? "bg-cyan-500 text-black shadow" : "text-gray-400 hover:text-white"
              }`}
            >
              📋 Table View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 text-sm">Loading enterprise leads...</div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="bg-[#121824] border border-gray-800 rounded-2xl p-3 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    {stage.replace("_", " ")}
                  </span>
                  <span className="bg-gray-800 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {stageLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/leads/${lead.id}`}
                      className="block bg-[#1A2233] hover:bg-[#202B40] border border-gray-700/60 hover:border-cyan-500/50 rounded-xl p-3 transition shadow-lg group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
                          {lead.company}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lead.qualification_score >= 80
                              ? "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                              : "bg-amber-950 border border-amber-500/40 text-amber-300"
                          }`}
                        >
                          Score: {lead.qualification_score}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 mb-1">{lead.name}</p>
                      <div className="text-[11px] text-gray-400 flex items-center justify-between mb-2">
                        <span>{getSourceIcon(lead.source)}</span>
                        <span className="text-cyan-400 font-semibold">{lead.budget_confirmed || "TBD"}</span>
                      </div>

                      {lead.needs_objection_handling && (
                        <div className="mt-2 p-1.5 bg-amber-900/40 border border-amber-500/50 rounded-lg text-[10px] text-amber-200 flex items-center gap-1 font-semibold">
                          ⚠️ ObjectionHandler Engaged
                        </div>
                      )}

                      <div className="mt-3 border-t border-gray-800 pt-2 flex items-center justify-between text-[10px] text-gray-500">
                        <span>SLA: <strong className="text-red-400">{lead.sla_countdown}</strong></span>
                        <span className="text-cyan-400 group-hover:underline font-medium">Inspect Lead →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#121824] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1A2233] border-b border-gray-800 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="p-3">Company & Name</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Source</th>
                <th className="p-3">Score</th>
                <th className="p-3">Budget Confirmed</th>
                <th className="p-3">ROI Projection</th>
                <th className="p-3">SLA Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#1A2233]/60 transition">
                  <td className="p-3 font-semibold text-white">
                    {lead.company}
                    <span className="block text-[11px] text-gray-400 font-normal">{lead.name} ({lead.email})</span>
                  </td>
                  <td className="p-3 font-bold text-cyan-400">{lead.stage}</td>
                  <td className="p-3">{getSourceIcon(lead.source)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded-full font-bold">
                      {lead.qualification_score}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-emerald-400">{lead.budget_confirmed || "Unconfirmed"}</td>
                  <td className="p-3">{lead.roi_projection || "Pending ROI Tool"}</td>
                  <td className="p-3 text-red-400 font-mono font-bold">{lead.sla_countdown}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition text-[11px]"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
