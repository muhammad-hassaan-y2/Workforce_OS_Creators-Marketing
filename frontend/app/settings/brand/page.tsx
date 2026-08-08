"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBrandGuidelines } from "@/lib/api";

export default function BrandSettingsPage() {
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrandGuidelines().then((data) => {
      setGuidelines(data);
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
            <span className="text-white font-medium">Settings / Brand Guidelines</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Archive's Brand Guidelines & RAG Document Store
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 text-sm">Loading Brand Guidelines...</div>
      ) : (
        <div className="space-y-6">
          {guidelines.map((bg) => (
            <div key={bg.id} className="bg-[#121824] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h2 className="text-lg font-bold text-white">{bg.title}</h2>
                <span className="text-xs bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-full font-bold">
                  {bg.category}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Core Brand Tone & Positioning</span>
                <p className="p-4 bg-[#1A2233] border border-gray-700 rounded-xl text-xs text-gray-200 leading-relaxed font-medium">
                  {bg.content}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase">Prohibited Words & Claims Rule List</span>
                <div className="flex flex-wrap gap-2">
                  {bg.prohibited_words?.map((word: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-red-950 border border-red-500/50 text-red-200 text-xs font-mono font-bold rounded-lg">
                      🚫 {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
