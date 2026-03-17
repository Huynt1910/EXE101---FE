'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface NavigationProgressProps {
  isNavigating: boolean;
  progress: number;
  className?: string;
}

export function NavigationProgress({ isNavigating, progress, className }: NavigationProgressProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isNavigating) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow for smooth completion animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-gradient-to-r from-[#0d3b66] via-[#0d3b66] to-[#0d3b66] transition-all duration-300 ease-out',
        className
      )}
      style={{
        transform: `translateX(${isNavigating ? 0 : '-100%'})`,
        width: `${isNavigating ? progress : 100}%`,
      }}
    >
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
    </div>
  );
}

// Alternative version with more sophisticated animation
export function NavigationProgressAdvanced({
  isNavigating,
  //   progress,
  className,
}: NavigationProgressProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [internalProgress, setInternalProgress] = React.useState(0);

  React.useEffect(() => {
    if (isNavigating) {
      setIsVisible(true);
      setInternalProgress(0);

      // Simulate realistic progress
      const interval = setInterval(() => {
        setInternalProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setInternalProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setInternalProgress(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  if (!isVisible) return null;

  const displayProgress = isNavigating ? Math.min(internalProgress, 90) : 100;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-[#0d3b66] via-[#0d3b66] to-[#0d3b66] transition-all duration-300 ease-out relative overflow-hidden"
        style={{
          width: `${displayProgress}%`,
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />

        {/* Glow effect */}
        <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-[#0d3b66] to-transparent" />
      </div>
    </div>
  );
}
