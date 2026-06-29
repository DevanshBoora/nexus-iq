"use client";

import React from "react";
import { GitPullRequest, GitCommit, Activity, Box, AlertTriangle, ChevronRight, BrainCircuit, Clock } from "lucide-react";
import { Repository, Deployment, Incident, EntityStatus } from "@/lib/mockData";
import { useEntity } from "./EntityContext";

export const StatusBadge = ({ status }: { status: EntityStatus }) => {
  const styles = {
    healthy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
};

export const RepositoryCard = ({ data }: { data: Repository }) => {
  const { openEntity } = useEntity();
  
  return (
    <div 
      onClick={() => openEntity("repo", data.id)}
      className="bg-[#15171e] border border-white/5 hover:border-white/20 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <GitPullRequest className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-bold">{data.name}</h3>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${data.environment === 'Production' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                {data.environment}
              </span>
            </div>
            <p className="text-slate-500 text-xs">{data.language}</p>
          </div>
        </div>
        <StatusBadge status={data.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <span className="text-slate-500 text-xs block mb-1">Health Score</span>
          <span className={`text-xl font-bold ${data.healthScore < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
            {data.healthScore}%
          </span>
        </div>
        <div>
          <span className="text-slate-500 text-xs block mb-1">Risk Score</span>
          <span className={`text-xl font-bold ${data.riskScore > 70 ? 'text-red-400' : data.riskScore > 40 ? 'text-orange-400' : 'text-emerald-400'}`}>
            {data.riskScore}/100
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div className="text-xs text-slate-400">
          <span className="text-white font-bold">{data.todaysDeployments}</span> deployments today
        </div>
        <div className="text-xs text-slate-400">
          <span className="text-white font-bold">{data.contributors}</span> active devs
        </div>
      </div>
      
      {data.recentInsight && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-slate-400 text-xs flex items-center gap-2">
            <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
            <span className="truncate">{data.recentInsight}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export const DeploymentCard = ({ data }: { data: Deployment }) => {
  const { openEntity } = useEntity();
  
  return (
    <div 
      onClick={() => openEntity("deploy", data.id)}
      className="bg-[#15171e] border border-white/5 hover:border-white/20 rounded-2xl p-5 cursor-pointer transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <Box className="w-5 h-5 text-slate-300" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold">{data.version}</h3>
            <StatusBadge status={data.status} />
          </div>
          <p className="text-slate-500 text-xs flex items-center gap-2">
            <Clock className="w-3 h-3" /> {data.time} • Duration: {data.duration}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <span className="text-slate-500 text-xs block mb-1">AI Risk Score</span>
          <span className={`text-sm font-bold ${data.aiRiskScore > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
            {data.aiRiskScore}/100
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export const IncidentCard = ({ data }: { data: Incident }) => {
  const { openEntity } = useEntity();
  
  return (
    <div 
      onClick={() => openEntity("incident", data.id)}
      className="bg-[#15171e] border border-white/5 hover:border-white/20 rounded-2xl p-5 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between group gap-4"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${data.status === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold">{data.title}</h3>
            <StatusBadge status={data.severity} />
          </div>
          <p className="text-slate-500 text-xs">Started: {data.time}</p>
          {data.aiConclusion && (
             <p className="text-slate-400 text-sm mt-3 border-l-2 border-purple-500/30 pl-3 hidden sm:block truncate max-w-lg">
               {data.aiConclusion}
             </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${data.status === 'active' ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-white/5 border-white/10 text-slate-400'}`}>
          {data.status === 'active' ? 'ACTIVE' : 'RESOLVED'}
        </span>
        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};
