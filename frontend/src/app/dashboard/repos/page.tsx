"use client";

import React from "react";
import { RepositoryCard } from "@/components/entities/EntityCards";
import { MOCK_REPOS } from "@/lib/mockData";

export default function RepositoriesPage() {
  return (
    <div className="h-full flex flex-col text-white max-w-7xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading">Repositories</h1>
          <p className="text-slate-400">Manage connected codebase telemetry and health scores.</p>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-lg text-sm transition-colors">
          Connect Repository
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-8 pr-2">
        {MOCK_REPOS.map((repo) => (
          <RepositoryCard key={repo.id} data={repo} />
        ))}
      </div>
    </div>
  );
}
