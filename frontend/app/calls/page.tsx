"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCalls } from "@/lib/api";

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls().then((data) => {
      setCalls(data);
      if (data.length > 0) setSelectedCall(data[0]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
            <span>/</span>
            <span className="text-white font-medium">Neural Voice Call History</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Neural Voice Call History & Transcripts
          </h1>
        </div>

        <Link
          href="/dashboard"
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-500/20"
        >
          📞 Launch Live Voice Call Mode
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 text-sm">Loading Neural Call History...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Call List */}
          <div className="lg:col-span-5 bg-[#121824] border border-gray-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Recent Voice Interactions
            </h2>
            {calls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedCall?.id === call.id
                    ? "bg-[#1A2233] border-cyan-500/80 shadow-lg"
                    : "bg-[#121824] border-gray-800 hover:bg-[#1A2233]/60"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{call.contact_name}</span>
                  <span className="text-xs text-cyan-400 font-mono font-bold">{call.duration}</span>
                </div>
                <p className="text-xs text-gray-300 line-clamp-2">{call.summary}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Agent: <strong className="text-gray-200 uppercase">{call.agent_id}</strong></span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      call.sentiment === "POSITIVE"
                        ? "bg-emerald-950 text-emerald-300"
                        : "bg-amber-950 text-amber-300"
                    }`}
                  >
                    {call.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Transcript & Summary Panel */}
          <div className="lg:col-span-7 bg-[#121824] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
            {selectedCall ? (
              <>
                <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedCall.contact_name}</h2>
                    <span className="text-xs text-gray-400">Call Duration: {selectedCall.duration}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-full">
                    Sentiment: {selectedCall.sentiment}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase">AI Executive Call Summary</span>
                  <p className="p-4 bg-[#1A2233] border border-gray-700 rounded-xl text-xs text-gray-200 leading-relaxed font-medium">
                    {selectedCall.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-300 uppercase">Full Call Transcript</span>
                  <div className="p-4 bg-[#0A0D14] border border-gray-800 rounded-xl text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[350px] overflow-y-auto">
                    {selectedCall.transcript}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-gray-500 text-xs">Select a call to view transcript.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
