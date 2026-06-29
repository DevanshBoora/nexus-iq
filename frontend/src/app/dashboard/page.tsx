"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { Activity, Clock, Zap, Search, Bell, MoreVertical, ChevronDown } from "lucide-react";
import { useDemoMode } from "@/components/DemoContext";

const incidentTelemetry = [
  { time: "Jun", val1: 40, val2: 20 },
  { time: "Jul", val1: 30, val2: 25 },
  { time: "Aug", val1: 20, val2: 40 },
  { time: "Sept", val1: 85, val2: 60 },
  { time: "Oct", val1: 30, val2: 20 },
  { time: "Nov", val1: 25, val2: 30 },
  { time: "Dec", val1: 20, val2: 25 },
];

export default function DashboardOverview() {
  const { isDemoMode } = useDemoMode();
  const [hasIncident, setHasIncident] = useState(false);
  const [timeRange, setTimeRange] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");

  const isDegraded = isDemoMode || hasIncident;

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col relative text-white">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="w-10 h-10 rounded-full ring-2 ring-[#d4ff00]" />
          <div 
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => alert("Profile settings coming soon!")}
          >
            <span className="font-bold text-white">Devansh Boora</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search workspaces..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-9 pr-4 py-2 bg-[#1e2029] rounded-full text-sm border border-white/10 shadow-sm focus:ring-1 focus:ring-[#d4ff00] focus:border-[#d4ff00] outline-none w-64 text-white placeholder-slate-500 transition-all"
            />
          </div>
          <button 
            onClick={() => alert("No new notifications.")}
            className="w-10 h-10 bg-[#1e2029] rounded-full flex items-center justify-center border border-white/10 hover:border-[#d4ff00]/50 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#d4ff00] rounded-full border border-[#1e2029]"></span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Workspace Overview</h1>
          <p className="text-slate-400 font-medium">Take control of your system health today!</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400 font-medium">12 July, 2024</span>
          <button 
            onClick={() => setTimeRange(timeRange === "Today" ? "This Week" : "Today")}
            className="px-4 py-2 bg-[#1e2029] border border-white/10 rounded-full shadow-sm text-sm font-bold flex items-center gap-2 hover:bg-[#262833] transition-colors"
          >
            {timeRange} <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Trigger for Demo */}
      <div className="mb-6 flex gap-3 shrink-0">
        <button 
          onClick={() => setHasIncident(!hasIncident)}
          className={`px-4 py-2 text-sm font-bold rounded-full transition-all border ${
            hasIncident 
              ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30' 
              : 'bg-[#1e2029] text-white border-white/10 hover:border-[#d4ff00]/50'
          }`}
        >
          {hasIncident ? 'Resolve Incident' : 'Run Demo Incident'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 flex-1 pb-4">
        
        {/* Left Column (Tall Card) */}
        <div className="bg-[#1e2029] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col relative overflow-hidden h-full">
          <div className="flex justify-between items-start mb-6 z-10 shrink-0">
            <div className="flex items-center gap-2 font-bold text-white">
              <Zap className="w-5 h-5 text-[#d4ff00]" /> System Load
            </div>
            <button onClick={() => alert("More options...")} className="hover:text-white text-slate-500">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-end gap-3 mb-8 z-10 shrink-0">
            <h2 className="text-4xl font-bold text-white">{isDegraded ? '18.5k' : '4.3k'}</h2>
            <div className={`px-2 py-1 rounded-md text-xs font-bold mb-1 ${isDegraded ? 'bg-red-500/20 text-red-400' : 'bg-[#d4ff00] text-black'}`}>
              {isDegraded ? '+300%' : '+5%'}
            </div>
            <span className="text-slate-400 text-sm font-medium mb-1 ml-1">reqs {timeRange.toLowerCase()}</span>
          </div>

          {/* Overlapping Circles Chart */}
          <div className="relative flex-1 min-h-[160px] w-full flex items-center justify-center mb-8 z-10">
            <div className="absolute left-[10%] w-32 xl:w-36 h-32 xl:h-36 bg-[#a78bfa] rounded-full flex flex-col items-center justify-center text-white shadow-lg z-20 ring-4 ring-[#1e2029]">
              <span className="text-2xl font-bold">{isDegraded ? '12k' : '2.6k'}</span>
              <span className="text-xs font-medium">API</span>
            </div>
            <div className="absolute right-[10%] w-28 xl:w-32 h-28 xl:h-32 bg-[#2d3142] rounded-full flex flex-col items-center justify-center text-white shadow-lg z-10 ring-4 ring-[#1e2029]">
              <span className="text-xl font-bold">{isDegraded ? '5k' : '1.2k'}</span>
              <span className="text-xs text-slate-400 font-medium">Workers</span>
            </div>
            <div className="absolute bottom-0 left-[35%] w-20 xl:w-24 h-20 xl:h-24 bg-[#d4ff00] rounded-full flex flex-col items-center justify-center text-black shadow-lg z-30 ring-4 ring-[#1e2029]">
              <span className="text-lg font-bold">{isDegraded ? '1.5k' : '500'}</span>
              <span className="text-xs font-bold">DB</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4 mt-auto z-10 shrink-0">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-xl">45<span className="text-sm text-slate-500 font-medium ml-1">%</span></span>
                <span className="text-slate-400">API Requests <span className="inline-block w-2 h-2 rounded-full bg-[#a78bfa] ml-1"></span></span>
              </div>
              <div className="w-full bg-[#2d3142] h-2 rounded-full overflow-hidden">
                <div className="bg-[#a78bfa] w-[45%] h-full rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-xl">30<span className="text-sm text-slate-500 font-medium ml-1">%</span></span>
                <span className="text-slate-400">Background Tasks <span className="inline-block w-2 h-2 rounded-full bg-slate-500 ml-1"></span></span>
              </div>
              <div className="w-full bg-[#2d3142] h-2 rounded-full overflow-hidden">
                <div className="bg-slate-500 w-[30%] h-full rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-xl">25<span className="text-sm text-slate-500 font-medium ml-1">%</span></span>
                <span className="text-slate-400">Database Queries <span className="inline-block w-2 h-2 rounded-full bg-[#d4ff00] ml-1"></span></span>
              </div>
              <div className="w-full bg-[#2d3142] h-2 rounded-full overflow-hidden">
                <div className="bg-[#d4ff00] w-[25%] h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6 h-full content-between">
          
          {/* Top Row */}
          <div className="bg-[#1e2029] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full min-h-[160px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 font-bold text-white">
                <Clock className="w-5 h-5 text-sky-400" /> Avg Latency
              </div>
              <button onClick={() => alert("Latency options")} className="text-slate-500 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-bold flex items-baseline text-white">
                {isDegraded ? '1250' : '62'} <span className="text-sm font-medium text-slate-500 ml-1">ms</span>
              </h2>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Avg</p>
                <p className="text-sm font-bold text-white">78 ms</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1e2029] border border-white/5 rounded-3xl p-6 shadow-xl row-span-2 flex flex-col relative overflow-hidden h-full">
            <div className="flex justify-between items-start mb-6 shrink-0">
              <div className="flex items-center gap-2 font-bold text-white">
                <Activity className="w-5 h-5 text-emerald-400" /> Health Index
              </div>
              <button onClick={() => alert("Health options")} className="text-slate-500 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <h2 className="text-4xl font-bold flex items-baseline text-white">
                {isDegraded ? '32' : '78'} <span className="text-sm font-medium text-slate-500 ml-1">%</span>
              </h2>
              <div className={`px-2 py-1 rounded-md text-xs font-bold ${isDegraded ? 'bg-red-500/20 text-red-400' : 'bg-[#d4ff00] text-black'}`}>
                {isDegraded ? '-46%' : '+10%'}
              </div>
            </div>
            {/* Dot Matrix Mockup */}
            <div className="flex-1 flex items-end justify-between gap-1 opacity-80 min-h-[100px]">
              {[1, 2, 3, 4, 2, 5, 6, 8, 4, 3, 2, 5, 7, 9, 5].map((val, i) => (
                <div key={i} className="flex flex-col gap-1 justify-end h-full">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div 
                      key={j} 
                      className={`w-2.5 h-2.5 rounded-full ${10 - j <= (isDegraded ? Math.max(1, val - 4) : val) ? 'bg-[#a78bfa]' : 'bg-[#2d3142]'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Middle Row Left */}
          <div className="bg-[#1e2029] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full min-h-[160px]">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 font-bold text-white">
                <Activity className="w-5 h-5 text-orange-400" /> Deployments
              </div>
              <button onClick={() => alert("Deployment options")} className="text-slate-500 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-bold flex items-baseline text-white">
                5.8 <span className="text-sm font-medium text-slate-500 ml-1">/ wk</span>
              </h2>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Active</p>
                <p className="text-sm font-bold text-white">75 Min</p>
              </div>
            </div>
          </div>

          {/* Bottom Dark Card */}
          <div className="col-span-2 bg-gradient-to-br from-[#12141c] to-[#0f111a] border border-white/5 rounded-3xl p-6 text-white shadow-2xl flex flex-col h-full min-h-[220px]">
            <div className="flex justify-between items-start mb-4 shrink-0">
              <div className="flex items-center gap-2 font-bold text-white">
                <Search className="w-5 h-5 text-purple-400" /> Incident Analysis
              </div>
              <button 
                onClick={() => alert("Changing timeframe...")}
                className="bg-[#1e2029] border border-white/10 text-sm px-4 py-1.5 rounded-full flex items-center gap-2 font-medium hover:bg-[#2d3142] transition-colors text-slate-300"
              >
                Monthly <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-12 mb-4 shrink-0">
              <div>
                <h2 className="text-4xl font-bold flex items-baseline text-[#d4ff00]">
                  {isDegraded ? '15' : '85'} <span className="text-sm font-medium text-[#d4ff00]/50 ml-1">%</span>
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Uptime Efficiency</p>
              </div>
              <div>
                <h2 className="text-4xl font-bold flex items-baseline text-[#a78bfa]">
                  {isDegraded ? '45m' : '7h 15m'}
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Time to Resolution</p>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentTelemetry} barGap={4}>
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Bar dataKey="val1" fill="#2d3142" radius={[4, 4, 4, 4]} />
                  <Bar dataKey="val2" fill="#d4ff00" radius={[4, 4, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
