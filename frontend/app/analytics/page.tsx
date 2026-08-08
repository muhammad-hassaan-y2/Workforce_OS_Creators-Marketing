"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAnalytics } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <div className="min-h-screen bg-[#0A0D14] text-white p-12 text-center">Loading Executive Analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
            <span>/</span>
            <span className="text-white font-medium">Manager Analytics</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Executive Analytics & Deal Health Dashboard
          </h1>
        </div>
        <span className="text-xs bg-amber-950 border border-amber-500/50 text-amber-300 font-bold px-3 py-1 rounded-full">
          🔒 Manager / Admin Access Only
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total Pipeline Value</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{data.pipeline_value}</p>
        </div>
        <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase">Avg Response-Time SLA</span>
          <p className="text-3xl font-extrabold text-cyan-400 mt-2">{data.avg_response_time_sec}</p>
        </div>
        <div className="bg-[#121824] border border-gray-800 rounded-2xl p-5 shadow-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase">Lead Conversion Rate</span>
          <p className="text-3xl font-extrabold text-indigo-400 mt-2">{data.conversion_rate}</p>
        </div>
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel Stage Breakdown */}
        <div className="lg:col-span-7 bg-[#121824] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-gray-800 pb-2">
            📈 Sales Funnel Pipeline Stage Distribution
          </h2>
          <div className="space-y-3 text-xs">
            {data.funnel_stages?.map((stage: any) => (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="font-bold">{stage.stage}</span>
                  <span>{stage.count} Leads ({stage.value})</span>
                </div>
                <div className="w-full bg-[#1A2233] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-600 h-full rounded-full"
                    style={{ width: `${(stage.count / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objection Breakdown */}
        <div className="lg:col-span-5 bg-[#121824] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-gray-800 pb-2">
            🛡️ Objection-Type Categorization (Comprehend)
          </h2>
          <div className="space-y-3 text-xs">
            {data.objection_breakdown?.map((obj: any) => (
              <div key={obj.type} className="flex items-center justify-between p-3 bg-[#1A2233] rounded-xl border border-gray-800">
                <span className="font-semibold text-gray-200">{obj.type}</span>
                <span className="font-bold text-amber-300 text-sm">{obj.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deal Health Risk List */}
      <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-gray-800 pb-2 flex items-center justify-between">
          <span>⚠️ Deal-Health Risk Warning List</span>
          <span className="text-xs text-red-400 font-normal">Escalated to Human Managers</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.deal_health_risks?.map((risk: any) => (
            <div key={risk.lead_id} className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{risk.company} ({risk.lead_id})</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-900 text-red-200 rounded-full">{risk.severity}</span>
              </div>
              <p className="text-xs text-red-200">{risk.risk}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
