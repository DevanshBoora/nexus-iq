"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoMode } from './DemoContext';
import { BrainCircuit, LineChart, GitPullRequest, Activity, ChevronRight, GitBranch } from 'lucide-react';

export const OnboardingModal = () => {
  const { hasCompletedOnboarding, setHasCompletedOnboarding, setIsDemoMode } = useDemoMode();
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<'demo' | 'github'>('demo');

  if (hasCompletedOnboarding) return null;

  const handleComplete = () => {
    if (selectedSource === 'demo') {
      setIsDemoMode(true);
    } else {
      setIsDemoMode(false);
    }
    setHasCompletedOnboarding(true);
  };

  const nextStep = () => {
    if (step === 3) {
      handleComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        layout
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-10 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <BrainCircuit className="w-10 h-10 text-emerald-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4 font-heading">Welcome to NexusIQ</h1>
                <p className="text-xl text-slate-400 max-w-lg mx-auto">
                  An AI-powered engineering intelligence platform that automatically analyzes your telemetry and code changes to prevent incidents.
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <h2 className="text-3xl font-bold text-white mb-2 text-center font-heading">Where does the data come from?</h2>
                <p className="text-slate-400 text-center mb-8">Choose how you want to experience the platform.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSelectedSource('demo')}
                    className={`p-6 rounded-xl border text-left transition-all ${
                      selectedSource === 'demo' 
                        ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/50' 
                        : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${selectedSource === 'demo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Demo Workspace</h3>
                        <span className="text-xs text-emerald-400 font-medium">Recommended for tours</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">Instantly populates the dashboard with realistic, seeded engineering data and incidents to explore.</p>
                  </button>

                  <button 
                    onClick={() => setSelectedSource('github')}
                    className={`p-6 rounded-xl border text-left transition-all ${
                      selectedSource === 'github' 
                        ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/50' 
                        : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${selectedSource === 'github' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                        <GitBranch className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Connect GitHub</h3>
                        <span className="text-xs text-slate-500 font-medium">For live production</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">Start with an empty dashboard and wire up your own Webhooks and Telemetry APIs.</p>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <h2 className="text-3xl font-bold text-white mb-2 text-center font-heading">What can NexusIQ do?</h2>
                <p className="text-slate-400 text-center mb-8">The platform groups insights into four main pillars.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-start gap-3">
                    <BrainCircuit className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white text-sm mb-1">AI Root Cause Analysis</h4>
                      <p className="text-xs text-slate-400">Gemini automatically analyzes code changes for risk factors.</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-start gap-3">
                    <GitPullRequest className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white text-sm mb-1">Repository Insights</h4>
                      <p className="text-xs text-slate-400">Track and link PRs across your entire GitHub organization.</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-start gap-3">
                    <Activity className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white text-sm mb-1">Engineering Timeline</h4>
                      <p className="text-xs text-slate-400">See exactly when code was merged versus when errors spiked.</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-start gap-3">
                    <LineChart className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white text-sm mb-1">Telemetry Analytics</h4>
                      <p className="text-xs text-slate-400">Real-time ingestion of server metrics and health checks.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-slate-700'}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              {step === 3 ? 'Explore Dashboard' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
