"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const savedDemo = localStorage.getItem('nexus-demo-mode');
    const savedOnboarding = localStorage.getItem('nexus-onboarding-complete');
    
    if (savedDemo === 'true') setIsDemoMode(true);
    if (savedOnboarding === 'true') setHasCompletedOnboarding(true);
    setMounted(true);
  }, []);

  const handleSetDemoMode = (value: boolean) => {
    setIsDemoMode(value);
    localStorage.setItem('nexus-demo-mode', String(value));
  };

  const handleSetOnboarding = (value: boolean) => {
    setHasCompletedOnboarding(value);
    localStorage.setItem('nexus-onboarding-complete', String(value));
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <DemoContext.Provider 
      value={{ 
        isDemoMode, 
        setIsDemoMode: handleSetDemoMode,
        hasCompletedOnboarding,
        setHasCompletedOnboarding: handleSetOnboarding
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoProvider');
  }
  return context;
};
