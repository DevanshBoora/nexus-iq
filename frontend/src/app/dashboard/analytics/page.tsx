"use client";

import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDemoMode } from "@/components/DemoContext";
import { EmptyState } from "@/components/EmptyState";

const performanceData = [
  { day: "Mon", latency: 45, errors: 2 },
  { day: "Tue", latency: 50, errors: 5 },
  { day: "Wed", latency: 42, errors: 1 },
  { day: "Thu", latency: 85, errors: 12 },
  { day: "Fri", latency: 120, errors: 45 }, // The incident
  { day: "Sat", latency: 40, errors: 0 },
  { day: "Sun", latency: 38, errors: 0 },
];

export default function AnalyticsPage() {
  const { isDemoMode } = useDemoMode();

  if (!isDemoMode) {
    return <EmptyState />;
  }

  return (
    <div className="h-full flex flex-col text-white max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">System Analytics</h1>
        <p className="text-slate-400">High-level reliability and performance trends.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pb-8 pr-2">
        
        <div className="bg-[#15171e] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-80">
          <h3 className="text-white font-bold mb-6">P99 Latency Trend (7 Days)</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="latency" fill="#8b5cf6" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#15171e] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-80">
          <h3 className="text-white font-bold mb-6">Error Volume (7 Days)</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="errors" fill="#ef4444" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
