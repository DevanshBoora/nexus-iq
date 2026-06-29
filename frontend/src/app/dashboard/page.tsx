"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { Activity, Clock, Zap, BrainCircuit, GitCommit, Box, AlertTriangle, ChevronRight, CheckCircle2, GitPullRequest, Code2 } from "lucide-react";
import { useDemoMode } from "@/components/DemoContext";
import { EmptyState } from "@/components/EmptyState";

const normalTelemetry = [
  { time: "09:40", latency: 45, errors: 0 },
  { time: "09:42", latency: 42, errors: 0 },
  { time: "09:44", latency: 48, errors: 0 },
  { time: "09:46", latency: 45, errors: 0 },
  { time: "09:48", latency: 50, errors: 0 },
  { time: "09:50", latency: 46, errors: 0 },
];

const incidentTelemetry = [
  { time: "09:40", latency: 45, errors: 0 },
  { time: "09:42", latency: 42, errors: 0 },
  { time: "09:44", latency: 48, errors: 0 },
  { time: "09:46", latency: 120, errors: 0 }, // deploy finishes
  { time: "09:48", latency: 850, errors: 12 },
  { time: "09:50", latency: 3200, errors: 145 },
];

export default function DashboardOverview() {
  const { isDemoMode } = useDemoMode();
  
  // Cinematic State Machine
  // 0: Normal
  // 1: Deployment Notification
  // 2: Latency climbing
  // 3: Errors spiking & Health dropping
  // 4: AI Thinking
  // 5: AI Typing Conclusion
  // 6: Complete & Interactive
  const [phase, setPhase] = useState(0);
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);

  useEffect(() => {
    if (phase === 0) return;
    
    let timer: NodeJS.Timeout;
    if (phase === 1) timer = setTimeout(() => setPhase(2), 2000);
    else if (phase === 2) timer = setTimeout(() => setPhase(3), 2000);
    else if (phase === 3) timer = setTimeout(() => setPhase(4), 2000);
    else if (phase === 4) timer = setTimeout(() => setPhase(5), 4000);
    else if (phase === 5) timer = setTimeout(() => setPhase(6), 4000);

    return () => clearTimeout(timer);
  }, [phase]);

  const triggerSimulation = () => {
    if (phase > 0) {
      setPhase(0);
      setExpandedEvidence(null);
    } else {
      setPhase(1);
    }
  };

  const chartData = phase >= 2 ? incidentTelemetry : normalTelemetry;
  const healthScore = phase >= 3 ? 32 : 98;
  const isRed = phase >= 3;

  if (!isDemoMode) {
    return <EmptyState />;
  }

  return (
    <div className="h-full flex flex-col relative text-white">
      
      {/* Top Header & Simulation Trigger */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight font-heading">Engineering Copilot</h1>
          <p className="text-slate-400 text-sm font-medium">Real-time system health and root cause analysis.</p>
        </div>
        <button 
          onClick={triggerSimulation}
          className={`px-5 py-2 text-sm font-bold rounded-full transition-all border ${
            phase > 0 
              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
              : 'bg-[#d4ff00] text-black border-[#d4ff00] hover:bg-[#bce600] shadow-[0_0_15px_rgba(212,255,0,0.2)]'
          }`}
        >
          {phase > 0 ? 'Resolve Incident' : 'Simulate Outage'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6 pb-8">
        
        {/* AI Hero Card (Centerpiece) */}
        <AnimatePresence mode="wait">
          {phase >= 4 && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              className="bg-[#120a1f] border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)] shrink-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
                  <BrainCircuit className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-bold text-white">AI Root Cause Analysis</h2>
                {phase === 6 && (
                  <span className="ml-auto px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
                    91% Confidence
                  </span>
                )}
              </div>

              {phase === 4 && (
                <div className="space-y-2 pl-11">
                  <ThinkingStep text="Reading telemetry streams..." delay={0} />
                  <ThinkingStep text="Comparing recent deployments..." delay={1} />
                  <ThinkingStep text="Inspecting pull request #184..." delay={2} />
                  <ThinkingStep text="Synthesizing incident timeline..." delay={3} />
                </div>
              )}

              {phase >= 5 && (
                <div className="pl-11">
                  <Typewriter text="Checkout latency increased 3200ms after Deployment v1.4.2. This is directly caused by PR #184 introducing an inefficient N+1 database query on the telemetry table. Recommended action: Rollback deployment v1.4.2 immediately." />
                  
                  {phase === 6 && (
                    <motion.div 
                      initial={{ opacity: 0, marginTop: 0 }} animate={{ opacity: 1, marginTop: 16 }} transition={{ delay: 0.5 }}
                      className="flex gap-3"
                    >
                      <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg">
                        Execute Rollback
                      </button>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition-colors">
                        View Query Plan
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Left Column: Timeline & Evidence */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-[#15171e] border border-white/5 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Event Timeline
              </h3>
              
              <div className="relative flex-1 pl-4 border-l border-white/10 space-y-8">
                <TimelineItem time="09:42" title="PR #184 Merged" icon={GitPullRequest} color="emerald" active={phase >= 0} />
                <TimelineItem time="09:46" title="Deployment v1.4.2" icon={Box} color="blue" active={phase >= 1} />
                <TimelineItem time="09:48" title="Latency Spike" icon={Activity} color="orange" active={phase >= 2} />
                <TimelineItem time="09:50" title="Error Rate Critical" icon={AlertTriangle} color="red" active={phase >= 3} />
                <TimelineItem time="09:52" title="AI RCA Generated" icon={BrainCircuit} color="purple" active={phase >= 5} />
                
                <AnimatePresence>
                  {phase >= 6 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="mt-6 bg-[#1a1c23] border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                      </div>
                      <div className="flex items-center gap-2 mb-1 relative z-10">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-white font-bold text-sm tracking-wide">Incident Resolved</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 text-xs relative z-10">
                        <div className="text-slate-400">Detection Time:</div>
                        <div className="text-white font-mono text-right">14 sec</div>
                        
                        <div className="text-slate-400">Root Cause Confidence:</div>
                        <div className="text-emerald-400 font-mono font-bold text-right">98%</div>
                        
                        <div className="text-slate-400">Estimated Saved:</div>
                        <div className="text-white font-mono text-right">$48,000</div>
                        
                        <div className="text-slate-400">Time to Resolution:</div>
                        <div className="text-white font-mono text-right">2m 11s</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry & Correlation */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Health Pulse Row */}
            <div className="grid grid-cols-3 gap-4 shrink-0">
              <div className={`rounded-2xl p-5 border transition-colors duration-500 ${isRed ? 'bg-red-500/10 border-red-500/20' : 'bg-[#15171e] border-white/5'}`}>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Health Score</p>
                <div className="flex items-end gap-2">
                  <span className={`text-3xl font-bold ${isRed ? 'text-red-400' : 'text-emerald-400'}`}>{healthScore}%</span>
                </div>
              </div>
              <div className={`rounded-2xl p-5 border transition-colors duration-500 ${phase >= 2 ? 'bg-orange-500/10 border-orange-500/20' : 'bg-[#15171e] border-white/5'}`}>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">P99 Latency</p>
                <div className="flex items-end gap-2">
                  <span className={`text-3xl font-bold ${phase >= 2 ? 'text-orange-400' : 'text-white'}`}>
                    {phase >= 2 ? '3.2s' : '45ms'}
                  </span>
                </div>
              </div>
              <div className={`rounded-2xl p-5 border transition-colors duration-500 ${isRed ? 'bg-red-500/10 border-red-500/20' : 'bg-[#15171e] border-white/5'}`}>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Error Rate</p>
                <div className="flex items-end gap-2">
                  <span className={`text-3xl font-bold ${isRed ? 'text-red-400' : 'text-white'}`}>
                    {isRed ? '14.5%' : '0.01%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Correlation Chart */}
            <div className="bg-[#15171e] border border-white/5 rounded-2xl p-6 shadow-xl flex-1 min-h-[250px] flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" /> Checkout Endpoint Telemetry
                </h3>
              </div>
              
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isRed ? "#ef4444" : "#8b5cf6"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isRed ? "#ef4444" : "#8b5cf6"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
                    />
                    <Area type="monotone" dataKey="latency" stroke={isRed ? "#ef4444" : "#8b5cf6"} strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                  </AreaChart>
                </ResponsiveContainer>

                {/* The Interactive "Correlation Marker" */}
                <AnimatePresence>
                  {phase >= 1 && (
                    <motion.div 
                      initial={{ opacity: 0, top: -20 }}
                      animate={{ opacity: 1, top: 0 }}
                      className="absolute left-[65%] top-0 bottom-0 w-px bg-blue-500/50 flex flex-col items-center"
                    >
                      <div className="absolute top-4 bg-blue-500/20 text-blue-400 border border-blue-500/50 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap cursor-pointer hover:bg-blue-500/40 transition-colors"
                           onClick={() => setExpandedEvidence('deploy')}
                      >
                        Deploy v1.4.2
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Evidence Explorer (Expands on click) */}
            <AnimatePresence>
              {expandedEvidence === 'deploy' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#12141c] border border-white/10 rounded-2xl p-5 overflow-hidden shrink-0"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-400" /> Evidence: PR #184 Diff
                    </h4>
                    <button onClick={() => setExpandedEvidence(null)} className="text-slate-500 hover:text-white text-xs">Close</button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 bg-black/50 p-4 rounded-lg overflow-x-auto border border-white/5">
                    <div className="text-red-400">- const users = await db.query("SELECT * FROM telemetry LIMIT 100");</div>
                    <div className="text-emerald-400">+ const users = await db.query("SELECT * FROM telemetry"); // Removed limit for export</div>
                    <div className="text-slate-500 mt-2">// AI Note: This query performs a full table scan on 4M rows.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
      
      {/* Global CSS adjustments for strict layout */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}

// Subcomponents for the Cinematic UI

const ThinkingStep = ({ text, delay }: { text: string, delay: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.8 }}
      className="flex items-center gap-2 text-sm text-slate-400"
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
      {text}
    </motion.div>
  );
}

const Typewriter = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20); // typing speed
    return () => clearInterval(interval);
  }, [text]);

  return <p className="text-slate-200 text-sm leading-relaxed border-l-2 border-purple-500/50 pl-4">{displayed}</p>;
}

const TimelineItem = ({ time, title, icon: Icon, color, active }: any) => {
  const colorMap: any = {
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 ring-emerald-500/20",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/50 ring-blue-500/20",
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/50 ring-orange-500/20",
    red: "bg-red-500/20 text-red-400 border-red-500/50 ring-red-500/20",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/50 ring-purple-500/20",
  };

  return (
    <div className={`relative transition-all duration-500 ${active ? 'opacity-100' : 'opacity-20 grayscale'}`}>
      <div className={`absolute -left-[25px] w-6 h-6 rounded-full border flex items-center justify-center bg-[#15171e] z-10 ${active ? colorMap[color] : 'border-white/10 text-slate-500'}`}>
        <Icon className="w-3 h-3" />
      </div>
      <div className="flex flex-col -mt-1">
        <span className="text-xs font-mono text-slate-500 mb-0.5">{time}</span>
        <span className={`text-sm font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{title}</span>
      </div>
    </div>
  );
}
