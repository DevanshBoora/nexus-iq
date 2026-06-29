"use client";

import React from "react";
import { CheckCircle2, GitBranch, Database } from "lucide-react";
import { useDemoMode } from "@/components/DemoContext";
import { EmptyState } from "@/components/EmptyState";

export default function IntegrationsPage() {
  const { isDemoMode } = useDemoMode();

  if (!isDemoMode) {
    return <EmptyState />;
  }

  return (
    <div className="h-full flex flex-col text-white max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Integrations</h1>
        <p className="text-slate-400">Manage connected services and webhooks.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-8 pr-2">
        
        <div className="bg-[#15171e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-white">GitHub</h3>
              <p className="text-xs text-slate-500">Synced 2 mins ago</p>
            </div>
          </div>
          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> CONNECTED
          </span>
        </div>

        <div className="bg-[#15171e] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Database className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-white">PostgreSQL</h3>
              <p className="text-xs text-slate-500">Telemetry DB • Connected</p>
            </div>
          </div>
          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> CONNECTED
          </span>
        </div>

      </div>
    </div>
  );
}
