"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCampaigns } from "@/lib/api";

const PHASES = ["Phase 1: Setup", "Phase 2: Execution", "Phase 3: Review"];

export default function CampaignsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns().then((data) => {
      setCampaigns(data.campaigns || []);
      setTasks(data.tasks || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
            <span>/</span>
            <span className="text-white font-medium">Atlas's PM Board</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Atlas's PM Board & Phase Plan
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Triggered on: <strong className="text-emerald-400">lead.status = CLOSED_WON</strong></span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 text-sm">Loading Atlas PM Campaign Tasks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PHASES.map((phase) => {
            const phaseTasks = tasks.filter((t) => t.phase === phase);
            return (
              <div key={phase} className="bg-[#121824] border border-gray-800 rounded-2xl p-4 flex flex-col min-h-[550px] shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
                  <h2 className="text-sm font-bold text-cyan-400">{phase}</h2>
                  <span className="bg-gray-800 text-cyan-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {phaseTasks.length} Tasks
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  {phaseTasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/campaigns/camp-001/tasks/${task.id}`}
                      className="block bg-[#1A2233] hover:bg-[#202B40] border border-gray-700/60 hover:border-cyan-500/50 rounded-xl p-4 transition shadow-lg group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition">
                          {task.description}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-800/80">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{task.owner_avatar}</span>
                          <span className="text-gray-300 font-medium">{task.owner}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            task.status === "REVIEW"
                              ? "bg-amber-950 border border-amber-500/50 text-amber-300"
                              : task.status === "APPROVED"
                              ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      {task.type === "copy" && (
                        <div className="mt-3 p-2 bg-indigo-950/40 border border-indigo-500/40 rounded-lg text-[10px] text-indigo-300 flex items-center justify-between">
                          <span>✨ Archive Brand Panel Embedded</span>
                          <span className="font-bold underline">Review Copy →</span>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
