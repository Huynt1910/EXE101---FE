"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function getPanelTone(packageName?: string | null) {
  switch (packageName?.trim().toLowerCase()) {
    case "founder":
      return {
        frame:
          "bg-[linear-gradient(135deg,rgba(251,191,36,0.96)_0%,rgba(253,224,71,0.84)_34%,rgba(255,255,255,0.97)_58%,rgba(245,158,11,0.92)_100%)]",
        glow: "bg-amber-300/45",
        highlight:
          "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.18),transparent_48%)]",
        surface:
          "bg-[linear-gradient(180deg,rgba(255,251,235,0.94)_0%,rgba(255,255,255,0.96)_38%,rgba(255,247,214,0.92)_100%)]",
      };
    case "pro":
      return {
        frame:
          "bg-[linear-gradient(135deg,rgba(248,113,113,0.95)_0%,rgba(252,165,165,0.82)_34%,rgba(255,255,255,0.97)_58%,rgba(220,38,38,0.9)_100%)]",
        glow: "bg-red-300/45",
        highlight:
          "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.16),transparent_48%)]",
        surface:
          "bg-[linear-gradient(180deg,rgba(254,242,242,0.94)_0%,rgba(255,255,255,0.96)_38%,rgba(254,226,226,0.92)_100%)]",
      };
    case "starter":
      return {
        frame:
          "bg-[linear-gradient(135deg,rgba(56,189,248,0.95)_0%,rgba(125,211,252,0.82)_34%,rgba(255,255,255,0.97)_58%,rgba(14,165,233,0.88)_100%)]",
        glow: "bg-sky-300/45",
        highlight:
          "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_48%)]",
        surface:
          "bg-[linear-gradient(180deg,rgba(240,249,255,0.94)_0%,rgba(255,255,255,0.96)_38%,rgba(224,242,254,0.92)_100%)]",
      };
    default:
      return null;
  }
}

export function BuddySubscriptionPanelFrame({
  packageName,
  className,
  children,
}: Readonly<{
  packageName?: string | null;
  className?: string;
  children: ReactNode;
}>) {
  const tone = getPanelTone(packageName);

  if (!tone) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("relative rounded-[34px]", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-[-10px] rounded-[42px] blur-2xl opacity-80",
          tone.glow,
        )}
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-[34px] p-[2px] shadow-[0_14px_36px_rgba(15,23,42,0.08)]",
          tone.frame,
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-[2px] rounded-[32px]",
            tone.highlight,
          )}
        />
        <div className={cn("relative rounded-[32px]", tone.surface)}>{children}</div>
      </div>
    </div>
  );
}
