'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useNavigationProgressContext } from '@/lib/provider/navigationProgressProvider';

interface NavigationLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  className?: string;
  showProgress?: boolean;
  progressDelay?: number;
}

export function NavigationLink({
  children,
  className,
  showProgress = true,
  progressDelay = 0,
  onClick,
  ...props
}: NavigationLinkProps) {
  const { startNavigation } = useNavigationProgressContext();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (showProgress) {
      // Add delay if specified
      if (progressDelay > 0) {
        setTimeout(() => {
          startNavigation();
        }, progressDelay);
      } else {
        startNavigation();
      }
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Link {...props} className={cn(className)} onClick={handleClick}>
      {children}
    </Link>
  );
}

// Enhanced version with more options
interface EnhancedNavigationLinkProps extends NavigationLinkProps {
  onNavigationStart?: () => void;
  onNavigationComplete?: () => void;
  progressType?: 'immediate' | 'delayed' | 'on-hover';
}

export function EnhancedNavigationLink({
  children,
  className,
  showProgress = true,
  progressDelay = 0,
  onNavigationStart,
  //   onNavigationComplete,
  progressType = 'immediate',
  onClick,
  onMouseEnter,
  ...props
}: EnhancedNavigationLinkProps) {
  const { startNavigation } = useNavigationProgressContext();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (showProgress && progressType !== 'on-hover') {
      onNavigationStart?.();

      if (progressDelay > 0) {
        setTimeout(() => {
          startNavigation();
        }, progressDelay);
      } else {
        startNavigation();
      }
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(event);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (showProgress && progressType === 'on-hover') {
      onNavigationStart?.();
      startNavigation();
    }

    // Call original onMouseEnter if provided
    if (onMouseEnter) {
      onMouseEnter(event);
    }
  };

  return (
    <Link
      {...props}
      className={cn(className)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </Link>
  );
}

// Button version for programmatic navigation
interface NavigationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  showProgress?: boolean;
  progressDelay?: number;
  onNavigationStart?: () => void;
}

export function NavigationButton({
  children,
  className,
  showProgress = true,
  progressDelay = 0,
  onNavigationStart,
  onClick,
  ...props
}: NavigationButtonProps) {
  const { startNavigation } = useNavigationProgressContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (showProgress) {
      onNavigationStart?.();

      if (progressDelay > 0) {
        setTimeout(() => {
          startNavigation();
        }, progressDelay);
      } else {
        startNavigation();
      }
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button {...props} className={cn(className)} onClick={handleClick}>
      {children}
    </button>
  );
}
