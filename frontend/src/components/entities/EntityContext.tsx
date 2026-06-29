"use client";

import React, { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, GitPullRequest, Box, AlertTriangle, GitCommit, BrainCircuit, Activity } from "lucide-react";
import { getRepo, getDeploy, getIncident, getPR, Repository, Deployment, Incident, PullRequest } from "@/lib/mockData";

type EntityType = "repo" | "deploy" | "incident" | "pr" | null;

interface EntityContextType {
  openEntity: (type: EntityType, id: string) => void;
  closeDrawer: () => void;
}

const EntityContext = createContext<EntityContextType>({
  openEntity: () => {},
  closeDrawer: () => {},
});

export const useEntity = () => useContext(EntityContext);

export const EntityProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeType, setActiveType] = useState<EntityType>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const openEntity = (type: EntityType, id: string) => {
    setActiveType(type);
    setActiveId(id);
  };

  const closeDrawer = () => {
    setActiveType(null);
    setActiveId(null);
  };

  return (
    <EntityContext.Provider value={{ openEntity, closeDrawer }}>
      {children}
      <AnimatePresence>
        {activeType && activeId && (
          <EntityDrawer type={activeType} id={activeId} onClose={closeDrawer} />
        )}
      </AnimatePresence>
    </EntityContext.Provider>
  );
};

function EntityDrawer({ type, id, onClose }: { type: NonNullable<EntityType>, id: string, onClose: () => void }) {
  const { openEntity } = useEntity();
  
  let data: any = null;
  let title = "";
  let icon = Activity;

  if (type === "repo") {
    data = getRepo(id);
    title = data?.name || "Repository";
    icon = GitPullRequest;
  } else if (type === "deploy") {
    data = getDeploy(id);
    title = `Deployment ${data?.version}`;
    icon = Box;
  } else if (type === "incident") {
    data = getIncident(id);
    title = data?.title || "Incident";
    icon = AlertTriangle;
  } else if (type === "pr") {
    data = getPR(id);
    title = `PR #${data?.number}`;
    icon = GitCommit;
  }

  if (!data) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#12141c] border-l border-white/10 z-50 shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#15171e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              {React.createElement(icon, { className: "w-5 h-5" })}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
              <p className="text-slate-500 text-sm">{type.toUpperCase()} • ID: {id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-white">
          
          {/* Universal Status Header */}
          <div className="flex gap-4">
            <div className="flex-1 bg-[#1a1c23] border border-white/5 rounded-xl p-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Status</span>
              <span className={`text-lg font-bold ${data.status === 'critical' ? 'text-red-400' : data.status === 'warning' ? 'text-orange-400' : 'text-emerald-400'}`}>
                {data.status.toUpperCase()}
              </span>
            </div>
            {data.healthScore && (
              <div className="flex-1 bg-[#1a1c23] border border-white/5 rounded-xl p-4">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Health</span>
                <span className={`text-lg font-bold ${data.healthScore < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {data.healthScore}%
                </span>
              </div>
            )}
          </div>

          {/* Type Specific Fields */}
          {type === "deploy" && (
            <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-5 space-y-4">
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">AI Risk Score</span>
                <span className="text-white font-bold">{data.aiRiskScore}/100</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Duration</span>
                <span className="text-white">{data.duration}</span>
              </div>
              <button 
                onClick={() => openEntity("repo", data.repoId)}
                className="w-full py-2 bg-white/5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                View Repository Context
              </button>
            </div>
          )}

          {type === "repo" && (
            <div className="bg-[#1a1c23] border border-white/5 rounded-xl p-5 space-y-4">
              <div>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-1">Recent AI Insight</span>
                <span className="text-slate-300 text-sm leading-relaxed">{data.recentInsight}</span>
              </div>
              {data.activeIncidentId && (
                <button 
                  onClick={() => openEntity("incident", data.activeIncidentId)}
                  className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors"
                >
                  View Active Incident
                </button>
              )}
            </div>
          )}

          {type === "incident" && (
            <div className="bg-[#1a1c23] border border-purple-500/20 rounded-xl p-5 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="w-16 h-16" />
              </div>
              <div className="relative z-10">
                <span className="text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                  <BrainCircuit className="w-4 h-4" /> AI Conclusion
                </span>
                <span className="text-slate-200 text-sm leading-relaxed block">{data.aiConclusion}</span>
              </div>
              <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
                 <button onClick={() => openEntity("deploy", data.deployId)} className="py-2 bg-white/5 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors border border-white/5">
                   Inspect Deployment
                 </button>
                 <button onClick={() => openEntity("repo", data.repoId)} className="py-2 bg-white/5 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors border border-white/5">
                   Inspect Repository
                 </button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </>
  );
}
