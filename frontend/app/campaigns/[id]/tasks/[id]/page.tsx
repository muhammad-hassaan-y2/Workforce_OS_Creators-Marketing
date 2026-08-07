"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { fetchCopyReview, postCopyAction } from "@/lib/api";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string; taskId: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.taskId || "task-001";

  const [review, setReview] = useState<any>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCopyReview(taskId).then((data) => {
      setReview(data);
      setLoading(false);
    });
  }, [taskId]);

  const handleAction = async (action: "approve" | "request_changes") => {
    try {
      const updated = await postCopyAction(taskId, action, note);
      setReview(updated.review);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0A0D14] text-white p-12 text-center">Loading Copy Review Task...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
            <span>/</span>
            <Link href="/campaigns" className="hover:text-cyan-400">Campaigns</Link>
            <span>/</span>
            <span className="text-white font-medium">Task #{taskId}</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Task Detail & Archive Brand Review Panel
          </h1>
        </div>

        <Link href="/campaigns" className="px-4 py-2 bg-[#121824] border border-gray-700 hover:bg-gray-800 rounded-xl text-xs font-semibold">
          ← Back to Atlas Board
        </Link>
      </div>

      {/* Task & Archive Review Panel */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <span className="text-xs text-cyan-400 font-bold uppercase">Task Description</span>
              <h2 className="text-lg font-bold text-white mt-1">Generate 3 high-converting LinkedIn ad concepts</h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                review?.status === "APPROVED"
                  ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300"
                  : "bg-amber-950 border border-amber-500/50 text-amber-300"
              }`}
            >
              Archive Status: {review?.status || "FLAGGED"}
            </span>
          </div>

          {/* Draft Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-300">
              ✍️ Copywriter / AI Draft Text
            </label>
            <div className="p-4 bg-[#1A2233] border border-gray-700 rounded-xl text-sm text-gray-200 font-mono leading-relaxed">
              {review?.draft_text || "Kaiso is the guaranteed best #1 cheap AI sales bot for high volume email blast."}
            </div>
          </div>

          {/* Archive Flagged Issues Panel */}
          <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-amber-300 flex items-center gap-2">
              ✨ Archive Brand Guardian — Flagged Compliance Issues
            </h3>
            <ul className="space-y-1 text-xs text-amber-200 list-disc list-inside">
              {review?.flagged_issues?.map((issue: string, idx: number) => (
                <li key={idx}>{issue}</li>
              )) || (
                <>
                  <li>Prohibited word 'cheap' detected per client guidelines</li>
                  <li>Superlative claim 'guaranteed best #1' flagged</li>
                </>
              )}
            </ul>
          </div>

          {/* Action Box */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-gray-400">
              Reviewer / Brand Guardian Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note for copywriter..."
              className="w-full bg-[#1A2233] border border-gray-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              rows={2}
            />

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => handleAction("approve")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
              >
                ✓ Approve Copy
              </button>
              <button
                onClick={() => handleAction("request_changes")}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
              >
                ⚠️ Request Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
