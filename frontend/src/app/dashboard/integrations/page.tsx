"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, GitBranch, Database, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoMode } from "@/components/DemoContext";

export default function IntegrationsPage() {
  const { isDemoMode, setIsDemoMode } = useDemoMode();
  const [githubConnected, setGithubConnected] = useState(isDemoMode);
  const [showModal, setShowModal] = useState(false);
  const [connectStep, setConnectStep] = useState(0); // 0: start, 1: loading oauth, 2: select repos, 3: importing, 4: success

  // Reset if demo mode toggled
  useEffect(() => {
    setGithubConnected(isDemoMode);
  }, [isDemoMode]);

  const handleConnect = () => {
    setConnectStep(0);
    setShowModal(true);
  };

  const simulateConnect = () => {
    setConnectStep(1);
    setTimeout(() => setConnectStep(2), 1500);
  };

  const simulateImport = () => {
    setConnectStep(3);
    setTimeout(() => {
      setConnectStep(4);
      setGithubConnected(true);
      // Auto enable demo mode after connecting to show data
      setTimeout(() => {
        setShowModal(false);
        setIsDemoMode(true);
      }, 1500);
    }, 2000);
  };
  return (
    <div className="h-full flex flex-col text-white max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Integrations</h1>
        <p className="text-slate-400">Manage connected services and webhooks.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-8 pr-2">
        
        {/* GitHub Card */}
        <div className="bg-[#15171e] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-white">GitHub</h3>
              <p className="text-xs text-slate-500">Source Code & Pull Requests</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-auto pt-4 border-t border-white/5">
            {githubConnected ? (
              <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
              </span>
            ) : (
              <button 
                onClick={handleConnect}
                className="bg-white text-black px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        {/* PostgreSQL Card */}
        <div className="bg-[#15171e] border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Database className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-white">PostgreSQL</h3>
              <p className="text-xs text-slate-500">Telemetry DB</p>
            </div>
          </div>
          <div className="flex justify-end mt-auto pt-4 border-t border-white/5">
            <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> CONNECTED
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#15171e] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#12141c]">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <GitBranch className="w-5 h-5" /> Connect GitHub
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
              </div>

              <div className="p-6 flex-1 min-h-[250px] flex flex-col justify-center relative">
                {connectStep === 0 && (
                  <div className="text-center">
                    <p className="text-slate-400 text-sm mb-6">
                      NexusIQ needs access to your repositories to analyze pull requests, commits, and deployments.
                    </p>
                    <button 
                      onClick={simulateConnect}
                      className="bg-[#2da44e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2c974b] transition-colors flex items-center gap-2 mx-auto w-full justify-center"
                    >
                      <GitBranch className="w-5 h-5" /> Authorize NexusIQ
                    </button>
                  </div>
                )}

                {connectStep === 1 && (
                  <div className="flex flex-col items-center text-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
                    <p className="text-slate-300 font-bold">Authenticating with GitHub...</p>
                  </div>
                )}

                {connectStep === 2 && (
                  <div>
                    <h3 className="text-white font-bold mb-4">Select Repositories</h3>
                    <div className="space-y-2 mb-6 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg">
                        <span className="text-sm text-slate-300">payments-service</span>
                        <div className="w-4 h-4 rounded bg-[#d4ff00] flex items-center justify-center text-black">✓</div>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg">
                        <span className="text-sm text-slate-300">auth-service-go</span>
                        <div className="w-4 h-4 rounded bg-[#d4ff00] flex items-center justify-center text-black">✓</div>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg">
                        <span className="text-sm text-slate-300">web-client</span>
                        <div className="w-4 h-4 rounded bg-[#d4ff00] flex items-center justify-center text-black">✓</div>
                      </div>
                    </div>
                    <button 
                      onClick={simulateImport}
                      className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors w-full"
                    >
                      Import 3 Repositories
                    </button>
                  </div>
                )}

                {connectStep === 3 && (
                  <div className="flex flex-col items-center text-center">
                    <Loader2 className="w-8 h-8 text-[#d4ff00] animate-spin mb-4" />
                    <p className="text-white font-bold mb-1">Importing Data</p>
                    <p className="text-slate-400 text-sm">Syncing commits and PRs...</p>
                  </div>
                )}

                {connectStep === 4 && (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-white font-bold text-lg mb-1">GitHub Connected!</p>
                    <p className="text-slate-400 text-sm">Navigating back...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
