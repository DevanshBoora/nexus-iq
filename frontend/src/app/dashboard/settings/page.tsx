"use client";

import React from "react";
import { useDemoMode } from "@/components/DemoContext";

export default function SettingsPage() {
  const { isDemoMode, setIsDemoMode } = useDemoMode();

  return (
    <div className="h-full flex flex-col text-white max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Settings</h1>
        <p className="text-slate-400">Workspace preferences and application toggles.</p>
      </div>
      
      <div className="bg-[#15171e] border border-white/5 rounded-2xl p-6 shadow-xl max-w-xl">
        <h3 className="font-bold text-white mb-4">Application Mode</h3>
        
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
          <div>
            <h4 className="font-bold text-white">Recruiter Demo Mode</h4>
            <p className="text-sm text-slate-400 mt-1">Enables active incident badges and simulation features.</p>
          </div>
          
          <button 
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${isDemoMode ? 'bg-[#d4ff00]' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDemoMode ? 'translate-x-7 bg-black' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
