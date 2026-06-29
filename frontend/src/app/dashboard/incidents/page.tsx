"use client";

import React from "react";
import { IncidentCard } from "@/components/entities/EntityCards";
import { MOCK_INCIDENTS } from "@/lib/mockData";
import { useDemoMode } from "@/components/DemoContext";
import { EmptyState } from "@/components/EmptyState";

export default function IncidentsPage() {
  const { isDemoMode } = useDemoMode();

  if (!isDemoMode) {
    return <EmptyState />;
  }

  return (
    <div className="h-full flex flex-col text-white max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Incidents</h1>
        <p className="text-slate-400">Track, manage, and investigate system outages.</p>
      </div>
      
      <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-8 pr-2">
        {MOCK_INCIDENTS.map((inc) => (
          <IncidentCard key={inc.id} data={inc} />
        ))}
      </div>
    </div>
  );
}
