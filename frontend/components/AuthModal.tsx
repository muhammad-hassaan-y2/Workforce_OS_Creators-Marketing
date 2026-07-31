"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, ArrowRight, ShieldCheck, Video, Briefcase, TrendingUp } from "lucide-react";
import { Button } from "./ui/Button";
import Logo from "./Logo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "signup" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [selectedRole, setSelectedRole] = useState<"agency" | "creator" | "sales">("creator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div 
        className="relative w-full max-w-md bg-[#141419] border border-[#262633] rounded-[24px] shadow-2xl overflow-hidden text-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Background Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center">
            <Logo size={38} showWordmark={false} />
          </div>

          <h3 className="text-2xl font-bold text-white tracking-tight">
            {mode === "signup" ? "Deploy Your AI Workforce" : "Welcome Back to Orbital"}
          </h3>

          <p className="text-xs text-gray-400">
            {mode === "signup"
              ? "Join sales teams, marketing agencies & content creators running autonomous agents."
              : "Sign in to manage your Phone, Browser, and CLI agents."}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[#09090D] border border-[#22222E] mb-6">
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">
              {mode === "signup" ? "Account Created!" : "Authenticated!"}
            </h4>
            <p className="text-xs text-gray-400">Launching your Orbital Agent Workspace...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selection (For Signup) */}
            {mode === "signup" && (
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider font-semibold block">
                  Select Primary Focus:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("creator")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedRole === "creator"
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "bg-[#09090D] border-[#22222E] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <Video className="w-4 h-4 text-purple-400 mb-1" />
                    <div className="text-[11px] font-bold">Creator</div>
                    <div className="text-[9px] text-gray-500">Sponsors & DMs</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("agency")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedRole === "agency"
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "bg-[#09090D] border-[#22222E] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-blue-400 mb-1" />
                    <div className="text-[11px] font-bold">Agency</div>
                    <div className="text-[9px] text-gray-500">Client Retainers</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("sales")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedRole === "sales"
                        ? "bg-purple-600/20 border-purple-500 text-white"
                        : "bg-[#09090D] border-[#22222E] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />
                    <div className="text-[11px] font-bold">Sales & RevOps</div>
                    <div className="text-[9px] text-gray-500">Outbound Leads</div>
                  </button>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium">Work or Creator Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#09090D] border border-[#22222E] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#09090D] border border-[#22222E] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {/* Submit Button */}
            <Button variant="primary" size="lg" type="submit" className="w-full justify-center mt-2" icon={<ArrowRight className="w-4 h-4" />}>
              {mode === "signup" ? "Start 14-Day Free Sandbox" : "Sign In to Workspace"}
            </Button>

            {/* Micro Guarantee */}
            <div className="text-[10px] text-center text-gray-500 pt-2 font-mono flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SOC2 Type II Compliant — No Credit Card Required</span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
