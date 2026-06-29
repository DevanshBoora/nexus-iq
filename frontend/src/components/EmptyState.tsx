"use client";

import React, { useRef } from "react";
import { UploadCloud, Database, Link as LinkIcon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export const EmptyState = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert(`File "${e.target.files[0].name}" selected. Data ingestion pipeline is currently in development for this demo.`);
    }
  };
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-[#1a1c23] border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative">
        <UploadCloud className="w-10 h-10 text-slate-400" />
        <div className="absolute -top-2 -right-2 bg-[#d4ff00] text-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-3 font-heading tracking-tight">Connect Your Infrastructure</h2>
      <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
        NexusIQ requires telemetry and repository data to perform AI root cause analysis. Connect your services to begin.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <button 
          onClick={() => router.push("/dashboard/integrations")}
          className="flex-1 bg-[#d4ff00] text-black px-6 py-4 rounded-xl font-bold hover:bg-[#bce600] transition-colors flex items-center justify-center gap-3 text-sm shadow-[0_0_20px_rgba(212,255,0,0.15)]"
        >
          <LinkIcon className="w-4 h-4" /> Connect Integrations
        </button>
        <button 
          onClick={handleUploadClick}
          className="flex-1 bg-[#1a1c23] border border-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-3 text-sm"
        >
          <Database className="w-4 h-4" /> Upload CSV Data
        </button>
        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
      
      <div className="mt-12 text-slate-500 text-sm">
        Just looking around? Turn on <strong className="text-white">Demo Mode</strong> in the sidebar.
      </div>
    </div>
  );
};
