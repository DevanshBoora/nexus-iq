"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { Activity, AlertTriangle, CheckCircle, Clock, Terminal, ChevronDown, ChevronUp, BrainCircuit, GitCommit, GitPullRequest, Search, Zap } from "lucide-react";
import { useDemoMode } from "@/components/DemoContext";
import { EmptyState } from "@/components/EmptyState";

// Realistic mock telemetry data
const initialTelemetry = [
  { time: "10:00", requests: 120, errors: 2, latency: 45 },
  { time: "10:05", requests: 132, errors: 1, latency: 48 },
  { time: "10:10", requests: 145, errors: 3, latency: 50 },
  { time: "10:15", requests: 130, errors: 2, latency: 46 },
  { time: "10:20", requests: 155, errors: 4, latency: 52 },
  { time: "10:25", requests: 140, errors: 1, latency: 44 },
];

const incidentTelemetry = [
  ...initialTelemetry,
  { time: "10:30", requests: 210, errors: 45, latency: 1200 },
  { time: "10:35", requests: 190, errors: 80, latency: 3500 },
  { time: "10:40", requests: 110, errors: 1, latency: 45 },
];

const StatCard = ({ title, value, change, icon: Icon, isNegative = false, delay = 0, alert = false }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`glass-panel rounded-xl p-6 flex items-start justify-between ${alert ? 'ring-1 ring-red-500/50 bg-red-500/5' : ''}`}
  >
    <div>
      <p className="text-slate-400 font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <div className={`text-sm font-medium flex items-center gap-1 ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
        <span>{change}</span>
        <span className="text-slate-500 ml-1">vs last hr</span>
      </div>
    </div>
    <div className={`p-3 rounded-lg ${isNegative ? 'bg-red-500/10 text-red-400' : 'bg-sky-500/10 text-sky-400'} ${alert ? 'animate-pulse' : ''}`}>
      <Icon className="h-6 w-6" />
    </div>
  </motion.div>
);

export default function DashboardOverview() {
  const { isDemoMode } = useDemoMode();
  
  // Interactive Learning State
  const [hasIncident, setHasIncident] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [showRawTelemetry, setShowRawTelemetry] = useState(false);

  const telemetryData = isDemoMode || hasIncident ? incidentTelemetry : initialTelemetry;
  const isDegraded = isDemoMode || hasIncident;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      {/* Header with Interactive Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading mb-2">Workspace Overview</h1>
          <p className="text-slate-400">Real-time engineering intelligence for your distributed systems.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setHasIncident(!hasIncident)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            <Zap className={`w-4 h-4 ${hasIncident ? 'text-red-400' : 'text-amber-400'}`} />
            {hasIncident ? 'Resolve Incident' : 'Run Demo Incident'}
          </button>
          
          <button 
            onClick={() => setHasAnalyzed(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <BrainCircuit className="w-4 h-4" />
            Analyze Repository
          </button>
        </div>
      </div>

      {/* Q1: Is my system healthy? */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-400" />
          Is my system healthy?
        </h2>
        
        {!isDemoMode && !hasIncident ? (
          <EmptyState 
            icon={Activity}
            title="Waiting for Telemetry"
            description="Send a POST request to /api/v1/telemetry to see your system's real-time health metrics appear here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="API Requests (1h)" value={isDegraded ? "1,332" : "842"} change={isDegraded ? "+12%" : "+2%"} icon={Activity} delay={0.1} />
            <StatCard title="Avg Latency" value={isDegraded ? "285ms" : "48ms"} change={isDegraded ? "+240ms" : "-2ms"} icon={Clock} isNegative={isDegraded} alert={isDegraded} delay={0.2} />
            <StatCard title="Error Rate" value={isDegraded ? "4.5%" : "0.1%"} change={isDegraded ? "+4.2%" : "-0.1%"} icon={AlertTriangle} isNegative={isDegraded} alert={isDegraded} delay={0.3} />
            <StatCard title="System Health" value={isDegraded ? "Degraded" : "Healthy"} change={isDegraded ? "Incident ongoing" : "All systems normal"} icon={CheckCircle} isNegative={isDegraded} alert={isDegraded} delay={0.4} />
          </div>
        )}
      </section>

      {/* Q2: What changed recently? */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-purple-400" />
          What changed recently?
        </h2>
        
        {!isDemoMode && !hasAnalyzed ? (
          <EmptyState 
            icon={GitPullRequest}
            title="No Recent Changes"
            description="Connect a GitHub repository via Webhooks to track pull requests, commits, and deployments automatically."
          />
        ) : (
          <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
            <div className="absolute left-9 top-8 bottom-8 w-px bg-slate-800" />
            <div className="space-y-6 relative">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center shrink-0 z-10 mt-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Latency Spike Detected</h4>
                  <p className="text-sm text-slate-400">P99 Latency crossed 3000ms threshold.</p>
                  <span className="text-xs text-slate-500 mt-1 block">10:35 AM</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0 z-10 mt-1">
                  <GitPullRequest className="w-3 h-3 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">PR Merged: "Refactor Database Queries"</h4>
                  <p className="text-sm text-slate-400">Merged by DevanshBoora into main branch.</p>
                  <span className="text-xs text-slate-500 mt-1 block">10:28 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Q4: What is the AI recommending? */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-emerald-400" />
          What is the AI recommending?
        </h2>
        
        {!isDemoMode && !hasAnalyzed ? (
          <EmptyState 
            icon={BrainCircuit}
            title="Waiting for Analysis"
            description="Click 'Analyze Repository' above or trigger a GitHub webhook to generate your first AI insight."
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/20 rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white font-heading">Missing Index on Highly Queried Column</h3>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">
                98% Confidence
              </span>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              The recent PR "Refactor Database Queries" introduced a new lookup on the <code>user_id</code> column in the <code>Telemetry</code> table. Because this table has millions of rows and lacks an index on <code>user_id</code>, it is causing full table scans, resulting in the massive latency spike observed at 10:35 AM.
            </p>
            <div className="bg-slate-950/50 rounded-lg p-4 border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Actionable Steps</h4>
              <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                <li>Rollback PR #42 temporarily to restore system health.</li>
                <li>Create a database migration adding <code>CREATE INDEX idx_telemetry_user_id ON telemetry(user_id);</code></li>
                <li>Verify query execution plan before re-merging.</li>
              </ul>
            </div>
          </motion.div>
        )}
      </section>

      {/* Q3: What should I investigate? (Raw Telemetry) */}
      <section>
        <button 
          onClick={() => setShowRawTelemetry(!showRawTelemetry)}
          className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
        >
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            Investigation: View Raw Telemetry Data
          </h2>
          {showRawTelemetry ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        <AnimatePresence>
          {showRawTelemetry && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">P99 Latency (ms)</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetryData}>
                        <defs>
                          <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                        <Area type="monotone" dataKey="latency" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-panel rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Error Volume (5xx)</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={telemetryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                        <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
