"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTeamSettings } from "@/lib/api";

export default function TeamSettingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamSettings().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <div className="min-h-screen bg-[#0A0D14] text-white p-12 text-center">Loading Team Roles & Permissions...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
            <span>/</span>
            <span className="text-white font-medium">Settings / Team & Permissions</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Team Roles, Permissions & MFA Policy
          </h1>
        </div>
      </div>

      {/* Organization Security Settings */}
      <div className="bg-[#121824] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-gray-800 pb-2">
          ⚙️ Workspace Security Policy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#1A2233] border border-gray-700 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Manager/Admin MFA Enforcement</span>
              <span className="text-gray-400 text-[11px]">Requires authenticator code on sign-in</span>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full font-bold">
              ACTIVE
            </span>
          </div>

          <div className="p-4 bg-[#1A2233] border border-gray-700 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Default Incognito / Private Chat Mode</span>
              <span className="text-gray-400 text-[11px]">Transient un-saved chat sessions</span>
            </div>
            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full font-bold">
              DISABLED
            </span>
          </div>
        </div>
      </div>

      {/* Member Roles Table */}
      <div className="bg-[#121824] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-sm font-bold text-white">Team Member Roles & Access Control</h2>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#1A2233] border-b border-gray-800 text-gray-400 uppercase tracking-wider text-[10px]">
              <th className="p-3">User Name</th>
              <th className="p-3">Assigned Role</th>
              <th className="p-3">MFA Status</th>
              <th className="p-3">Permissions Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-gray-300">
            {data.roles?.map((member: any) => (
              <tr key={member.id} className="hover:bg-[#1A2233]/60 transition">
                <td className="p-3 font-semibold text-white">{member.user}</td>
                <td className="p-3">
                  <span className="px-2.5 py-0.5 bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold rounded-full text-[11px]">
                    {member.role}
                  </span>
                </td>
                <td className="p-3 font-bold text-emerald-400">{member.mfa_enabled ? "✓ Verified MFA" : "Standard"}</td>
                <td className="p-3 text-gray-400 text-[11px]">
                  {member.role === "Admin" ? "Full Read/Write across all DB schema & settings" : member.role === "Manager" ? "Read/Write Leads, Campaigns & Analytics" : "Read Copy Tasks & Review Panel"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
