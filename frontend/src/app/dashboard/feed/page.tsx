"use client";

import { motion } from "framer-motion";
import { AlertTriangle, GitPullRequest, GitCommit, Zap, CheckCircle2 } from "lucide-react";

const feedItems = [
  {
    id: 1,
    type: "INCIDENT",
    title: "Authentication Service Outage Correlated to Redis Migration",
    timestamp: "10 mins ago",
    confidence: 0.98,
    summary: "The sudden 100% error rate and 3500ms P99 latency on `/api/v1/auth` directly aligns with the 'Database Caching Migration' PR. The authentication service likely relies on Redis for token validation, which was disrupted.",
    actionable: [
      "Rollback the Redis migration PR immediately.",
      "Verify PostgreSQL connection pools in the auth service."
    ],
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20"
  },
  {
    id: 2,
    type: "OPTIMIZATION",
    title: "Database Caching Migration",
    timestamp: "1 hour ago",
    confidence: 0.95,
    summary: "Migrating from Redis to PostgreSQL for caching is a strong optimization for free-tier deployments, ensuring memory limits aren't exceeded while persisting long-term AI insights.",
    actionable: [
      "Ensure database indexes exist on the cache lookup keys.",
      "Monitor Postgres connection limits."
    ],
    icon: GitPullRequest,
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20"
  },
  {
    id: 3,
    type: "SUMMARY",
    title: "Recent Deployment: Authentication Overhaul",
    timestamp: "2 hours ago",
    confidence: 0.88,
    summary: "2 commits pushed to main. Implemented JWT refresh token strategy and resolved an N+1 query issue in the dashboard.",
    actionable: [],
    icon: GitCommit,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20"
  }
];

export default function EngineeringFeed() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading mb-2">Engineering Feed</h1>
          <p className="text-slate-400">AI-generated insights from your codebase and telemetry</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">AI Engine Active</span>
        </div>
      </div>

      <div className="space-y-6">
        {feedItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`glass-panel border-l-4 rounded-xl p-6 ${item.bg.split(' ')[1].replace('border', 'border-l')}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold tracking-wider px-2 py-1 rounded-md ${item.bg} ${item.color}`}>
                      {item.type}
                    </span>
                    <span className="text-sm text-slate-500">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <span>Confidence:</span>
                    <span className="font-medium text-white">{Math.round(item.confidence * 100)}%</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">{item.summary}</p>
                
                {item.actionable.length > 0 && (
                  <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      Recommended Actions
                    </h4>
                    <ul className="space-y-2">
                      {item.actionable.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-slate-500 mt-0.5">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
