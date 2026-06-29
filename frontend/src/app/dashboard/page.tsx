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

  const isDegraded = isDemoMode || hasIncident;

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col relative text-slate-900">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="w-10 h-10 rounded-full" />
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="font-bold text-slate-900">Devansh Boora</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 bg-white rounded-full text-sm border-none shadow-sm focus:ring-2 focus:ring-[#d4ff00] outline-none w-64"
            />
          </div>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#d4ff00] rounded-full border border-white"></span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">Workspace Overview</h1>
          <p className="text-slate-500 font-medium">Take control of your system health today!</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 font-medium">12 July, 2024</span>
          <button className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-bold flex items-center gap-2">
            Today <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Trigger for Demo */}
      <div className="mb-6 flex gap-3">
        <button 
          onClick={() => setHasIncident(!hasIncident)}
          className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${hasIncident ? 'bg-red-100 text-red-600' : 'bg-white shadow-sm text-slate-700 hover:bg-slate-50'}`}
        >
          {hasIncident ? 'Resolve Incident' : 'Run Demo Incident'}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column (Tall Card) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 z-10">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Zap className="w-5 h-5" /> System Load
            </div>
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex items-end gap-3 mb-10 z-10">
            <h2 className="text-4xl font-bold">{isDegraded ? '18,5k' : '4,3k'}</h2>
            <div className="bg-[#d4ff00] px-2 py-1 rounded-md text-xs font-bold mb-1">
              {isDegraded ? '+300%' : '+5%'}
            </div>
            <span className="text-slate-400 text-sm font-medium mb-1 ml-1">reqs today</span>
          </div>

          {/* Overlapping Circles Chart */}
          <div className="relative h-48 w-full flex items-center justify-center mb-10 z-10">
            <div className="absolute left-[10%] w-36 h-36 bg-[#a78bfa] rounded-full flex flex-col items-center justify-center text-white shadow-lg z-20">
              <span className="text-2xl font-bold">{isDegraded ? '12k' : '2,6k'}</span>
              <span className="text-xs">API</span>
            </div>
            <div className="absolute right-[10%] w-32 h-32 bg-[#1f2128] rounded-full flex flex-col items-center justify-center text-white shadow-lg z-10">
              <span className="text-xl font-bold">{isDegraded ? '5k' : '1,2k'}</span>
              <span className="text-xs text-slate-400">Workers</span>
            </div>
            <div className="absolute bottom-0 left-[35%] w-24 h-24 bg-[#d4ff00] rounded-full flex flex-col items-center justify-center text-black shadow-lg z-30 ring-4 ring-white">
              <span className="text-lg font-bold">{isDegraded ? '1.5k' : '500'}</span>
              <span className="text-xs">DB</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-6 mt-auto z-10">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-xl">45<span className="text-sm text-slate-400 font-medium ml-1">%</span></span>
                <span className="text-slate-500">API Requests <span className="inline-block w-2 h-2 rounded-full bg-[#a78bfa] ml-1"></span></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#a78bfa] w-[45%] h-full rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-xl">30<span className="text-sm text-slate-400 font-medium ml-1">%</span></span>
                <span className="text-slate-500">Background Tasks <span className="inline-block w-2 h-2 rounded-full bg-black ml-1"></span></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-black w-[30%] h-full rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-xl">25<span className="text-sm text-slate-400 font-medium ml-1">%</span></span>
                <span className="text-slate-500">Database Queries <span className="inline-block w-2 h-2 rounded-full bg-[#d4ff00] ml-1"></span></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#d4ff00] w-[25%] h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6 content-start">
          
          {/* Top Row */}
          <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Clock className="w-5 h-5" /> Avg Latency
              </div>
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-bold flex items-baseline">
                {isDegraded ? '1250' : '62'} <span className="text-sm font-medium text-slate-400 ml-1">ms</span>
              </h2>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Avg</p>
                <p className="text-sm font-bold">78 ms</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm row-span-2 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Activity className="w-5 h-5" /> System Health Index
              </div>
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-4xl font-bold flex items-baseline">
                {isDegraded ? '32' : '78'} <span className="text-sm font-medium text-slate-400 ml-1">%</span>
              </h2>
              <div className={`px-2 py-1 rounded-md text-xs font-bold ${isDegraded ? 'bg-red-100 text-red-600' : 'bg-[#d4ff00] text-black'}`}>
                {isDegraded ? '-46%' : '+10%'}
              </div>
            </div>
            {/* Dot Matrix Mockup */}
            <div className="flex-1 flex items-end justify-between gap-1 opacity-60">
              {[1, 2, 3, 4, 2, 5, 6, 8, 4, 3, 2, 5, 7, 9, 5].map((val, i) => (
                <div key={i} className="flex flex-col gap-1 justify-end h-full">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div 
                      key={j} 
                      className={`w-2.5 h-2.5 rounded-full ${10 - j <= val ? 'bg-[#a78bfa]' : 'bg-slate-100'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Middle Row Left */}
          <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Activity className="w-5 h-5" /> Deployments
              </div>
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex justify-between items-end">
              <h2 className="text-4xl font-bold flex items-baseline">
                5,8 <span className="text-sm font-medium text-slate-400 ml-1">/ wk</span>
              </h2>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Active</p>
                <p className="text-sm font-bold">75 Min</p>
              </div>
            </div>
          </div>

          {/* Bottom Dark Card */}
          <div className="col-span-2 bg-[#21232c] rounded-3xl p-6 text-white shadow-xl flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 font-bold">
                <Search className="w-5 h-5" /> Telemetry Analysis
              </div>
              <button className="bg-[#313440] text-sm px-4 py-1.5 rounded-full flex items-center gap-2 font-medium hover:bg-[#3d4150] transition-colors">
                Monthly <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-12 mb-8">
              <div>
                <h2 className="text-4xl font-bold flex items-baseline text-[#d4ff00]">
                  {isDegraded ? '15' : '85'} <span className="text-sm font-medium text-slate-400 ml-1">%</span>
                </h2>
                <p className="text-sm text-slate-400 font-medium mt-1">Uptime Efficiency</p>
              </div>
              <div>
                <h2 className="text-4xl font-bold flex items-baseline text-[#a78bfa]">
                  {isDegraded ? '45m' : '7h 15m'}
                </h2>
                <p className="text-sm text-slate-400 font-medium mt-1">Time to Resolution</p>
              </div>
            </div>

            <div className="flex-1 h-32 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentTelemetry} barGap={4}>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Bar dataKey="val1" fill="#474b5c" radius={[4, 4, 4, 4]} />
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
