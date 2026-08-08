"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [requireMfa, setRequireMfa] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (email.includes("admin") || email.includes("manager") || email.includes("hassaan")) {
        if (!requireMfa) {
          setRequireMfa(true);
          setLoading(false);
          return;
        }
        if (mfaCode !== "123456" && mfaCode.length < 6) {
          throw new Error("Invalid MFA Verification Code. Enter 123456 for demo.");
        }
      }

      await loginUser(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSSO = () => {
    localStorage.setItem("kaiso_access_token", "mock_google_sso_token");
    localStorage.setItem(
      "kaiso_user",
      JSON.stringify({ full_name: "Google Workspace User", role: "manager" })
    );
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121824] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xl">
            K
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Kaiso OS
          </span>
        </div>

        <h1 className="text-xl font-bold text-center mb-2">Cognito Secure Sign-In</h1>
        <p className="text-xs text-gray-400 text-center mb-6">
          Enterprise SSO & Multi-Agent Workspace Access
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-xl text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@agency.com"
              className="w-full bg-[#1A2233] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#1A2233] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {requireMfa && (
            <div className="p-4 bg-indigo-950/50 border border-indigo-500/40 rounded-xl">
              <label className="block text-xs font-semibold text-indigo-300 mb-1">
                🔒 Manager/Admin Required MFA Code (Authenticator)
              </label>
              <input
                type="text"
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-[#1A2233] border border-indigo-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Demo Code: <code className="text-cyan-400">123456</code>
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-semibold py-2.5 rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? "Verifying Credentials..." : requireMfa ? "Verify MFA & Sign In" : "Sign In to Kaiso"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#121824] px-3 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSSO}
          className="w-full bg-[#1A2233] border border-gray-700 hover:bg-gray-800 font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
            />
          </svg>
          Google Workspace SSO
        </button>
      </div>
    </div>
  );
}
