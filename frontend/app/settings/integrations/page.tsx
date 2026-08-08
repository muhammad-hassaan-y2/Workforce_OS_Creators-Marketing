"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchIntegrations } from "@/lib/api";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations().then((data) => {
      setIntegrations(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
            <span>/</span>
            <span className="text-white font-medium">Settings / Integrations</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            OAuth Integrations & Source of Truth Sync
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 text-sm">Loading OAuth Integration Hub...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((item) => (
            <div key={item.id} className="bg-[#121824] border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{item.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === "CONNECTED"
                      ? "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <span>Last Sync: <strong className="text-gray-200">{item.last_sync}</strong></span>
              </div>

              <button
                className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                  item.status === "CONNECTED"
                    ? "bg-[#1A2233] border border-gray-700 hover:bg-gray-800 text-gray-300"
                    : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
                }`}
              >
                {item.status === "CONNECTED" ? "⚙️ Re-authenticate OAuth" : "🔗 Connect OAuth"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
