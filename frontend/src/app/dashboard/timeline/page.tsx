"use client";

import React from "react";
import { GitPullRequest, GitCommit, Activity, Box, AlertTriangle, BrainCircuit } from "lucide-react";
import { useEntity } from "@/components/entities/EntityContext";

const TIMELINE_EVENTS = [
  { id: "e1", time: "Today, 09:52 AM", title: "AI RCA Generated", type: "incident", entityId: "inc-1", icon: BrainCircuit, color: "purple" },
  { id: "e2", time: "Today, 09:50 AM", title: "Error Rate Critical (14.5%)", type: "incident", entityId: "inc-1", icon: AlertTriangle, color: "red" },
  { id: "e3", time: "Today, 09:48 AM", title: "P99 Latency Spike (3.2s)", type: "incident", entityId: "inc-1", icon: Activity, color: "orange" },
  { id: "e4", time: "Today, 09:46 AM", title: "Deployment v1.4.2 Completed", type: "deploy", entityId: "dep-1", icon: Box, color: "blue" },
  { id: "e5", time: "Today, 09:42 AM", title: "PR #184 Merged by d.boora", type: "pr", entityId: "pr-1", icon: GitPullRequest, color: "emerald" },
  { id: "e6", time: "Yesterday, 04:15 PM", title: "Deployment v2.1.0 Completed", type: "deploy", entityId: "dep-2", icon: Box, color: "blue" },
];

export default function TimelinePage() {
  const { openEntity } = useEntity();

  const colorMap: any = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className="h-full flex flex-col text-white max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Engineering Timeline</h1>
        <p className="text-slate-400">Chronological feed of all events across connected repositories.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-8 pr-4">
        <div className="relative pl-6 border-l border-white/10 space-y-10">
          {TIMELINE_EVENTS.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative group">
                <div className={`absolute -left-[37px] w-8 h-8 rounded-full border flex items-center justify-center bg-[#0f111a] z-10 ${colorMap[event.color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col -mt-1.5 cursor-pointer" onClick={() => openEntity(event.type as any, event.entityId)}>
                  <span className="text-xs font-mono text-slate-500 mb-1">{event.time}</span>
                  <div className="bg-[#15171e] border border-white/5 hover:border-white/20 p-4 rounded-xl transition-all hover:-translate-y-1">
                     <h4 className="text-white font-bold">{event.title}</h4>
                     <p className="text-slate-400 text-sm mt-1">Click to view associated {event.type} context.</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
