"use client";

import React from "react";
import { DeploymentCard } from "@/components/entities/EntityCards";
import { MOCK_DEPLOYS } from "@/lib/mockData";

export default function DeploymentsPage() {
  return (
    <div className="h-full flex flex-col text-white max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Deployments</h1>
        <p className="text-slate-400">Monitor release health and AI risk scores.</p>
      </div>
      
      <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-8 pr-2">
        {MOCK_DEPLOYS.map((dep) => (
          <DeploymentCard key={dep.id} data={dep} />
        ))}
      </div>
    </div>
  );
}
