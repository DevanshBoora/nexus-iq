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
    <div className="h-screen overflow-hidden relative p-4 lg:p-8 bg-background">
      <OnboardingModal />
      
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
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-[#d4ff00] flex items-center justify-center text-[10px] font-bold text-black">
                    3
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
              onClick={() => alert("Pro features are currently in development!")}
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
