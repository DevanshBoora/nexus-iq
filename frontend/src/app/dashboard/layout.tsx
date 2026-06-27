"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, GitPullRequest, Settings, Terminal, LogOut, ToggleLeft, ToggleRight } from "lucide-react";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useDemoMode } from "@/components/DemoContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDemoMode, setIsDemoMode } = useDemoMode();
  
  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Engineering Feed", href: "/dashboard/feed", icon: Activity },
    { name: "Repositories", href: "/dashboard/repos", icon: GitPullRequest },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background relative">
      <OnboardingModal />
      {/* Sidebar */}
      <aside className="glass-panel w-64 border-r border-white/5 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-sky-500/20 ring-1 ring-white/10">
            <Terminal className="h-5 w-5 text-sky-400" />
          </div>
          <span className="font-heading font-bold text-xl heading-gradient">NexusIQ</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
              isDemoMode 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {isDemoMode ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
              <span className="font-medium text-sm">Demo Mode</span>
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${isDemoMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {isDemoMode ? 'ON' : 'OFF'}
            </span>
          </button>

          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 transition-all hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        {/* Glow effect in background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {children}
      </main>
    </div>
  );
}
