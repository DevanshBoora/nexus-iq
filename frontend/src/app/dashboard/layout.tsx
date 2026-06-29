"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { LayoutDashboard, Activity, GitPullRequest, Settings, Terminal, LogOut, ToggleLeft, ToggleRight, BrainCircuit, AlertTriangle, Box, GitCommit, LineChart, Blocks } from "lucide-react";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useDemoMode } from "@/components/DemoContext";
import { useEntity } from "@/components/entities/EntityContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDemoMode, setIsDemoMode } = useDemoMode();
  const { openEntity } = useEntity();
  const [showCmd, setShowCmd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCmd((open) => !open);
      }
      if (showCmd) {
        if (e.key === "Escape") {
          setShowCmd(false);
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [showCmd]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Incidents", href: "/dashboard/incidents", icon: AlertTriangle, count: 1 },
    { name: "Timeline", href: "/dashboard/timeline", icon: GitCommit },
    { name: "Repositories", href: "/dashboard/repos", icon: GitPullRequest },
    { name: "Deployments", href: "/dashboard/deployments", icon: Box },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    { name: "Integrations", href: "/dashboard/integrations", icon: Blocks },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const commands = [
    { id: "c1", name: "Go to Dashboard", icon: LayoutDashboard, action: () => router.push("/dashboard") },
    { id: "c2", name: "Go to Incidents", icon: AlertTriangle, action: () => router.push("/dashboard/incidents") },
    { id: "c3", name: "Go to Repositories", icon: GitPullRequest, action: () => router.push("/dashboard/repos") },
    { id: "c4", name: "Go to Deployments", icon: Box, action: () => router.push("/dashboard/deployments") },
    { id: "c5", name: "Open Latest Incident", icon: BrainCircuit, action: () => openEntity("incident", "inc-1") },
    { id: "c6", name: "Search payments-service", icon: Search, action: () => openEntity("repo", "repo-2") },
  ];

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!showCmd) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          setShowCmd(false);
          setSearchQuery("");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCmd, filteredCommands, selectedIndex]);

  return (
    <div className="h-screen overflow-hidden relative p-4 lg:p-8 bg-background">
      <OnboardingModal />
      
      {/* Command Palette Modal */}
      {showCmd && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/50 backdrop-blur-sm" onClick={() => { setShowCmd(false); setSearchQuery(""); }}>
          <div className="bg-[#15171e] w-full max-w-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center px-4 py-3 border-b border-white/5">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                autoFocus 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search NexusIQ or type a command..." 
                className="w-full bg-transparent border-none text-white outline-none placeholder-slate-500 text-lg"
              />
              <div className="text-xs text-slate-500 font-mono bg-white/5 px-2 py-1 rounded">ESC</div>
            </div>
            <div className="p-2 space-y-1 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Actions</div>
                  {filteredCommands.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    return (
                      <button 
                        key={cmd.id}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => {
                          cmd.action();
                          setShowCmd(false);
                          setSearchQuery("");
                        }}
                        className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${idx === selectedIndex ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-300'}`}
                      >
                        <Icon className="w-4 h-4 text-slate-400" /> {cmd.name}
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="px-3 py-6 text-center text-slate-500 text-sm">No commands found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-full w-full flex flex-col md:flex-row bg-[#15171e] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/5 border border-white/5">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 p-6 flex flex-col relative shrink-0">
          <div className="flex items-center gap-3 mb-10 pl-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4ff00] text-black">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="font-heading font-bold text-xl text-white">NexusIQ</span>
          </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-5 py-3.5 rounded-full transition-all ${
                  isActive 
                    ? "bg-[#1e2029] text-white shadow-md font-bold border border-white/5" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.count && (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDemoMode && item.name === 'Incidents' ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10 text-white'
                  }`}>
                    {item.count}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8 mb-4">
          <div className="bg-[#d4ff00] rounded-3xl p-6 text-black relative overflow-hidden">
            <h4 className="font-bold text-lg mb-1 relative z-10">Upgrade to Pro</h4>
            <p className="text-sm font-medium opacity-80 mb-6 relative z-10">Unlock premium AI analytics.</p>
            <button 
              className="w-full bg-[#15171e] text-white font-bold py-3 rounded-2xl relative z-10 hover:bg-black transition-colors"
            >
              Upgrade Now
            </button>
            {/* Decorative background shapes */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl" />
            <div className="absolute top-0 left-0 w-16 h-16 bg-white/30 rounded-full blur-xl" />
          </div>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-4 mt-2">
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`w-full flex items-center justify-between px-5 py-3 rounded-full transition-all ${
              isDemoMode 
                ? "text-[#d4ff00]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-4">
               {isDemoMode ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
              <span className="font-medium">Demo Mode</span>
            </div>
          </button>
          <Link
            href="/login"
            className="flex items-center gap-4 px-5 py-3 rounded-full text-slate-400 hover:text-red-400 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#0f111a] rounded-[2rem] m-2 overflow-auto p-8 relative shadow-inner border border-white/5">
        {children}
      </main>
      
      </div>
    </div>
  );
}
