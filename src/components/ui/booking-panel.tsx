"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DivProps = HTMLAttributes<HTMLDivElement>;
type HeadingProps = HTMLAttributes<HTMLHeadingElement>;
type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;

export function BookingPanel({ className, ...props }: DivProps) {
  return <div className={cn("booking-muted-panel", className)} {...props} />;
}

export function BookingPanelHeader({ className, ...props }: DivProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function BookingPanelContent({ className, ...props }: DivProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function BookingPanelFooter({ className, ...props }: DivProps) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function BookingPanelTitle({ className, ...props }: HeadingProps) {
  return (
    <h3
      className={cn("text-xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

export function BookingPanelDescription({
  className,
  ...props
}: ParagraphProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}
