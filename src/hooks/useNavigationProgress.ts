'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationProgressState {
  isNavigating: boolean;
  progress: number;
  startNavigation: () => void;
  completeNavigation: () => void;
}

export function useNavigationProgress(): NavigationProgressState {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  // Detect route changes
  useEffect(() => {
    if (isNavigating) {
      // Route changed, complete the navigation
      completeNavigation();
    }
  }, [pathname]);

  // Detect navigation start from link clicks
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && shouldTrackNavigation(link)) {
        startNavigation();
      }
    };

    const handleBeforeUnload = () => {
      if (isNavigating) {
        completeNavigation();
      }
    };

    // Listen for link clicks
    document.addEventListener('click', handleLinkClick);

    // Listen for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isNavigating]);

  // Detect programmatic navigation
  useEffect(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      if (isNavigating) {
        completeNavigation();
      }
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      if (isNavigating) {
        completeNavigation();
      }
    };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isNavigating]);

  const shouldTrackNavigation = useCallback(
    (link: HTMLAnchorElement): boolean => {
      const href = link.getAttribute('href');
      if (!href) return false;

      // Don't track external links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
      }

      // Don't track same-page anchors
      if (href.startsWith('#')) {
        return false;
      }

      // Don't track if it's the same page
      if (href === pathname) {
        return false;
      }

      // Don't track if target is _blank
      if (link.getAttribute('target') === '_blank') {
        return false;
      }

      return true;
    },
    [pathname]
  );

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);

    // Simulate realistic progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10 + 5; // Random increment between 5-15
      });
    }, 100);

    // Store interval ID to clear it later
    (window as any).__navigationProgressInterval = interval;
  }, []);

  const completeNavigation = useCallback(() => {
    // Clear the progress interval
    if ((window as any).__navigationProgressInterval) {
      clearInterval((window as any).__navigationProgressInterval);
      (window as any).__navigationProgressInterval = null;
    }

    // Complete the progress
    setProgress(100);

    // Hide after a short delay
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 300);
  }, []);

  return {
    isNavigating,
    progress,
    startNavigation,
    completeNavigation,
  };
}

// Enhanced version with more sophisticated tracking
export function useNavigationProgressEnhanced(): NavigationProgressState {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [navigationStartTime, setNavigationStartTime] = useState<number | null>(null);
  const pathname = usePathname();

  // Detect route changes
  useEffect(() => {
    if (isNavigating && navigationStartTime) {
      const elapsed = Date.now() - navigationStartTime;

      // If navigation takes too long, show progress anyway
      if (elapsed > 5000) {
        completeNavigation();
      } else {
        // Normal completion
        completeNavigation();
      }
    }
  }, [pathname, isNavigating, navigationStartTime]);

  // Enhanced link click detection
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && shouldTrackNavigation(link)) {
        // Add a small delay to ensure the click is processed
        setTimeout(() => {
          startNavigation();
        }, 10);
      }
    };

    const handleBeforeUnload = () => {
      if (isNavigating) {
        completeNavigation();
      }
    };

    // Listen for link clicks with passive option for better performance
    document.addEventListener('click', handleLinkClick, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isNavigating]);

  const shouldTrackNavigation = useCallback(
    (link: HTMLAnchorElement): boolean => {
      const href = link.getAttribute('href');
      if (!href) return false;

      // Don't track external links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
      }

      // Don't track same-page anchors
      if (href.startsWith('#')) {
        return false;
      }

      // Don't track if it's the same page
      if (href === pathname) {
        return false;
      }

      // Don't track if target is _blank
      if (link.getAttribute('target') === '_blank') {
        return false;
      }

      // Don't track if it's a download link
      if (link.getAttribute('download')) {
        return false;
      }

      return true;
    },
    [pathname]
  );

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);
    setNavigationStartTime(Date.now());

    // More sophisticated progress simulation
    let step = 0;
    const interval = setInterval(() => {
      step++;

      // Different progress patterns based on step
      let increment: number;
      if (step < 3) {
        increment = 15 + Math.random() * 10; // Fast initial progress
      } else if (step < 8) {
        increment = 5 + Math.random() * 8; // Medium progress
      } else {
        increment = 2 + Math.random() * 3; // Slow progress
      }

      setProgress(prev => {
        const newProgress = prev + increment;
        return newProgress >= 90 ? 90 : newProgress; // Cap at 90%
      });
    }, 150);

    // Store interval ID
    (window as any).__navigationProgressInterval = interval;
  }, []);

  const completeNavigation = useCallback(() => {
    // Clear the progress interval
    if ((window as any).__navigationProgressInterval) {
      clearInterval((window as any).__navigationProgressInterval);
      (window as any).__navigationProgressInterval = null;
    }

    // Complete the progress
    setProgress(100);
    setNavigationStartTime(null);

    // Hide after completion animation
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 400);
  }, []);

  return {
    isNavigating,
    progress,
    startNavigation,
    completeNavigation,
  };
}
