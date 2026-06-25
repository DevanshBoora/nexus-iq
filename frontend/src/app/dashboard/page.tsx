"use client";

import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Realistic mock telemetry data
const telemetryData = [
  { time: "10:00", requests: 120, errors: 2, latency: 45 },
  { time: "10:05", requests: 132, errors: 1, latency: 48 },
  { time: "10:10", requests: 145, errors: 3, latency: 50 },
  { time: "10:15", requests: 130, errors: 2, latency: 46 },
  { time: "10:20", requests: 155, errors: 4, latency: 52 },
  { time: "10:25", requests: 140, errors: 1, latency: 44 },
  { time: "10:30", requests: 210, errors: 45, latency: 1200 }, // Incident!
  { time: "10:35", requests: 190, errors: 80, latency: 3500 }, // Incident!
  { time: "10:40", requests: 110, errors: 1, latency: 45 },    // Rolled back
];

const StatCard = ({ title, value, change, icon: Icon, isNegative = false, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel rounded-xl p-6 flex items-start justify-between"
  >
    <div>
      <p className="text-slate-400 font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <div className={`text-sm font-medium flex items-center gap-1 ${isNegative ? 'text-red-400' : 'text-emerald-400'}`}>
        <span>{change}</span>
        <span className="text-slate-500 ml-1">vs last hr</span>
      </div>
    </div>
    <div className={`p-3 rounded-lg ${isNegative ? 'bg-red-500/10 text-red-400' : 'bg-sky-500/10 text-sky-400'}`}>
      <Icon className="h-6 w-6" />
    </div>
  </motion.div>
);

export default function DashboardOverview() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white font-heading mb-2">Workspace Overview</h1>
        <p className="text-slate-400">Real-time engineering telemetry for NexusIQ Demo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="API Requests (1h)" value="1,332" change="+12%" icon={Activity} delay={0.1} />
        <StatCard title="Avg Latency" value="285ms" change="+240ms" icon={Clock} isNegative={true} delay={0.2} />
        <StatCard title="Error Rate" value="4.5%" change="+4.2%" icon={AlertTriangle} isNegative={true} delay={0.3} />
        <StatCard title="System Health" value="Degraded" change="Incident ongoing" icon={CheckCircle} isNegative={true} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-panel rounded-xl p-6"
        >
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Error Rate Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-panel rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Error Volume (5xx)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: "#1e293b", strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
