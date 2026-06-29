export type EntityStatus = "healthy" | "warning" | "critical" | "info" | "success" | "failed";

export interface Repository {
  id: string;
  name: string;
  healthScore: number;
  status: EntityStatus;
  lastDeployId: string;
  activeIncidentId: string | null;
  contributors: number;
  recentInsight: string;
  language: string;
}

export interface Deployment {
  id: string;
  version: string;
  repoId: string;
  status: EntityStatus;
  duration: string;
  prId: string;
  aiRiskScore: number;
  time: string;
  rollbackRecommended: boolean;
}

export interface Incident {
  id: string;
  title: string;
  status: "active" | "resolved";
  severity: EntityStatus;
  deployId: string;
  repoId: string;
  time: string;
  aiConclusion: string;
}

export interface PullRequest {
  id: string;
  number: number;
  repoId: string;
  title: string;
  author: string;
  diffSummary: string;
}

// The unified datastore
export const MOCK_REPOS: Repository[] = [
  {
    id: "repo-1",
    name: "nexus-api-gateway",
    healthScore: 32,
    status: "critical",
    lastDeployId: "dep-1",
    activeIncidentId: "inc-1",
    contributors: 12,
    recentInsight: "Critical latency degradation detected post-deployment.",
    language: "TypeScript",
  },
  {
    id: "repo-2",
    name: "auth-service-go",
    healthScore: 98,
    status: "healthy",
    lastDeployId: "dep-2",
    activeIncidentId: null,
    contributors: 5,
    recentInsight: "Token verification extremely stable.",
    language: "Go",
  },
  {
    id: "repo-3",
    name: "web-client",
    healthScore: 85,
    status: "warning",
    lastDeployId: "dep-3",
    activeIncidentId: null,
    contributors: 24,
    recentInsight: "Bundle size increased by 4% in last release.",
    language: "React",
  }
];

export const MOCK_DEPLOYS: Deployment[] = [
  {
    id: "dep-1",
    version: "v1.4.2",
    repoId: "repo-1",
    status: "success",
    duration: "4m 12s",
    prId: "pr-1",
    aiRiskScore: 91,
    time: "09:46 AM",
    rollbackRecommended: true
  },
  {
    id: "dep-2",
    version: "v2.1.0",
    repoId: "repo-2",
    status: "success",
    duration: "1m 45s",
    prId: "pr-2",
    aiRiskScore: 12,
    time: "Yesterday",
    rollbackRecommended: false
  },
  {
    id: "dep-3",
    version: "v5.0.4",
    repoId: "repo-3",
    status: "failed",
    duration: "8m 30s",
    prId: "pr-3",
    aiRiskScore: 78,
    time: "2 Days Ago",
    rollbackRecommended: false
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc-1",
    title: "API Gateway P99 Latency Spike",
    status: "active",
    severity: "critical",
    deployId: "dep-1",
    repoId: "repo-1",
    time: "09:50 AM",
    aiConclusion: "Checkout latency increased 3200ms after Deployment v1.4.2. This is directly caused by PR #184 introducing an inefficient N+1 database query."
  },
  {
    id: "inc-2",
    title: "Redis Cache Miss Ratio Elevated",
    status: "resolved",
    severity: "warning",
    deployId: "dep-2",
    repoId: "repo-1",
    time: "Yesterday",
    aiConclusion: "Cache eviction policy misconfigured during scale-up event."
  }
];

export const MOCK_PRS: PullRequest[] = [
  {
    id: "pr-1",
    number: 184,
    repoId: "repo-1",
    title: "feat: remove limit on telemetry export",
    author: "d.boora",
    diffSummary: "Removed `LIMIT 100` from telemetry aggregation query causing full table scan on 4M rows."
  }
];

// Helper functions for entity resolution
export const getRepo = (id: string) => MOCK_REPOS.find(r => r.id === id);
export const getDeploy = (id: string) => MOCK_DEPLOYS.find(d => d.id === id);
export const getIncident = (id: string) => MOCK_INCIDENTS.find(i => i.id === id);
export const getPR = (id: string) => MOCK_PRS.find(p => p.id === id);
