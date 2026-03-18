'use client';

import React, { createContext, useContext, ReactNode, Suspense } from 'react';
import { useNavigationProgressEnhanced } from '@/hooks/useNavigationProgress';
import { NavigationProgressAdvanced } from '@/components/ui/navigation-progress';

interface NavigationProgressContextType {
  isNavigating: boolean;
  progress: number;
  startNavigation: () => void;
  completeNavigation: () => void;
}

const NavigationProgressContext = createContext<NavigationProgressContextType | undefined>(
  undefined
);

export function useNavigationProgressContext() {
  const context = useContext(NavigationProgressContext);
  if (context === undefined) {
    throw new Error(
      'useNavigationProgressContext must be used within a NavigationProgressProvider'
    );
  }
  return context;
}

interface NavigationProgressProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function NavigationProgressProvider({
  children,
  enabled = true,
}: NavigationProgressProviderProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={null}>
      <NavigationProgressProviderContent>{children}</NavigationProgressProviderContent>
    </Suspense>
  );
}

function NavigationProgressProviderContent({ children }: { children: ReactNode }) {
  const navigationState = useNavigationProgressEnhanced();

  return (
    <NavigationProgressContext.Provider value={navigationState}>
      <NavigationProgressAdvanced
        isNavigating={navigationState.isNavigating}
        progress={navigationState.progress}
      />
      {children}
    </NavigationProgressContext.Provider>
  );
}

// Standalone component for manual usage
export function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressBarContent />
    </Suspense>
  );
}

function NavigationProgressBarContent() {
  const { isNavigating, progress } = useNavigationProgressEnhanced();

  return <NavigationProgressAdvanced isNavigating={isNavigating} progress={progress} />;
}
