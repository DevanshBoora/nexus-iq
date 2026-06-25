"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Simulate demo authentication
      localStorage.setItem("nexus_auth_token", "demo-token");
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel w-full max-w-md rounded-2xl p-8"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-sky-500/20 ring-1 ring-white/10">
            <Terminal className="h-8 w-8 text-sky-400" />
          </div>
          <h1 className="font-heading heading-gradient mb-2 text-3xl font-bold">
            NexusIQ
          </h1>
          <p className="text-slate-400">Engineering Intelligence Platform</p>
        </div>

        <form onSubmit={handleDemoLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="demo@nexusiq.dev"
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
              required
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              defaultValue="demo123!"
              className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-sky-600 p-3 font-semibold text-white transition hover:from-purple-500 hover:to-sky-500 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Sign in to Workspace
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Demo accounts are pre-configured with realistic GitHub telemetry and AI insights.</p>
        </div>
      </motion.div>
    </div>
  );
}
