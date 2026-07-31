"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check, Sparkles, Download, Cpu, ShieldCheck, Zap, Code2 } from "lucide-react";
import { Button } from "../ui/Button";

export default function CLISection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"npm" | "npx" | "deploy">("npm");

  const commands = [
    {
      id: "npm",
      label: "Global CLI Install",
      code: "npm i -g @millo-ai/cli",
      description: "Install the Millo Agent OS CLI globally via npm package manager."
    },
    {
      id: "npx",
      label: "Add Workforce Pod",
      code: "npx @millo-ai/cli workforce init --template agency-creator",
      description: "Initialize and inject the multi-agent workforce (Caller, Browser, Video, CLI) into your repository."
    },
    {
      id: "deploy",
      label: "Deploy Workforce",
      code: "millo workforce deploy --agents caller,browser,video,cli --env production",
      description: "Deploy active multi-agent mesh to sovereign cloud nodes or local runtime."
    }
  ];

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentCmd = commands.find((c) => c.id === activeTab) || commands[0];

  return (
    <section id="cli" className="py-24 md:py-32 bg-[#0B0B0F] border-t border-[#1C1C26] relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-900/15 via-purple-900/20 to-yellow-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            DEVELOPER CLI & WORKFORCE INJECTOR
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Install Millo CLI & Add <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-purple-400 to-yellow-400">
              Workforce Agents via NPM.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1AA]">
            Deploy autonomous Phone, Video Creation, Browser, and CLI agents directly into your terminal or repository with one command.
          </p>
        </div>

        {/* Interactive CLI Terminal Box */}
        <div className="max-w-4xl mx-auto rounded-[24px] bg-[#141419] border border-[#22222E] p-6 md:p-8 shadow-2xl space-y-6">
          
          {/* Window Top Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#22222E]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-3 text-xs font-mono text-gray-400">terminal // orbital-workforce-installer</span>
            </div>

            {/* Command Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#09090D] border border-[#22222E]">
              {commands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => setActiveTab(cmd.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeTab === cmd.id
                      ? "bg-purple-600 text-white font-semibold shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Code Display Block */}
          <div className="p-6 rounded-2xl bg-[#09090D] border border-emerald-500/30 flex items-center justify-between gap-4 font-mono text-xs sm:text-sm text-emerald-300 relative group shadow-inner">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-purple-400 font-bold select-none">$</span>
              <span className="text-white font-semibold whitespace-nowrap">{currentCmd.code}</span>
            </div>

            <button
              onClick={() => handleCopy(0, currentCmd.code)}
              className="px-3 py-2 rounded-xl bg-[#1A1A24] border border-[#2A2A38] text-gray-300 hover:text-white hover:border-purple-500/50 transition-all flex items-center gap-1.5 text-xs font-sans shrink-0 shadow-md"
            >
              {copiedIndex === 0 ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Command Explanation Description */}
          <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#22222E] flex items-center justify-between gap-4 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>{currentCmd.description}</span>
            </div>
            <span className="text-purple-400 shrink-0 font-bold">Node.js 18+</span>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#09090D] border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Zero-Config Runner
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Launch Phone, Video Creation, Browser, and CLI agents instantly with local environment variables.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#09090D] border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                Custom SDK Hooks
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Inject custom Python or TypeScript agent skills directly into your repository pipeline.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#09090D] border border-white/5 space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Encrypted Vault
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Sovereign API key encryption & local agent guardrails for enterprise agency safety.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
