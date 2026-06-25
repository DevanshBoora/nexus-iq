"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Brain, Activity, Shield, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="glass-panel sticky top-0 z-50 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-sky-500/20 ring-1 ring-white/10">
              <Terminal className="h-4 w-4 text-sky-400" />
            </div>
            <span className="font-heading text-xl font-bold heading-gradient">NexusIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Sign In
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Live Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl px-6"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              AI Engine is Live
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Engineering Intelligence <br />
              <span className="heading-gradient">Automated.</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 mb-10">
              Connect your GitHub repositories and APIs. NexusIQ correlates deployments, pulls requests, and telemetry anomalies using AI.
            </p>
            
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-sky-600 px-8 py-4 text-lg font-semibold text-white transition hover:from-purple-500 hover:to-sky-500 active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]"
            >
              Experience the Demo
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-2xl"
              >
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/20">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Telemetry Ingestion</h3>
                <p className="text-slate-400 leading-relaxed">
                  Real-time aggregation of API traffic, P99 latency, and error rates using Pandas and Celery background workers.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-8 rounded-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="h-12 w-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-6 border border-sky-500/20">
                  <Brain className="h-6 w-6 text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Incident Correlation</h3>
                <p className="text-slate-400 leading-relaxed">
                  NexusIQ detects anomalies and uses LLMs to automatically correlate them with recent GitHub pull requests.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="glass-panel p-8 rounded-2xl"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Shield className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Enterprise Architecture</h3>
                <p className="text-slate-400 leading-relaxed">
                  Built on FastAPI, SQLAlchemy, Redis, and Next.js. Features a robust Dead Letter Queue and background task processing.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          <p>Developed as a robust portfolio project. Built with Next.js, FastAPI, and Postgres.</p>
        </div>
      </footer>
    </div>
  );
}
