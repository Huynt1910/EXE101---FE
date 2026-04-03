"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStatus = "completed" | "current" | "upcoming";

export type TimelineItem = {
  id: string;
  title: string;
  icon: LucideIcon;
  status?: TimelineStatus;
  badgeLabel?: string;
  meta?: string;
  onClick?: () => void;
  clickable?: boolean;
};

type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

const badgeStyles: Record<TimelineStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  current: "bg-amber-100 text-amber-700",
  upcoming: "bg-slate-100 text-slate-500",
};

const iconStyles: Record<TimelineStatus, string> = {
  completed: "border-[#0f172a] bg-[#0f172a] text-white",
  current:
    "border-primary bg-primary text-primary-foreground shadow-[0_0_0_6px_rgba(18,55,42,0.08)]",
  upcoming: "border-slate-300 bg-slate-100 text-slate-500",
};

const lineStyles: Record<TimelineStatus, string> = {
  completed: "bg-emerald-500",
  current: "bg-primary/40",
  upcoming: "bg-slate-200",
};

const defaultBadgeLabel: Record<TimelineStatus, string> = {
  completed: "Completed",
  current: "In progress",
  upcoming: "Pending",
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:gap-0">
        {items.map((item, index) => {
          const Icon = item.icon;
          const status = item.status ?? "upcoming";
          const isLast = index === items.length - 1;
          const clickable = item.clickable ?? !!item.onClick;

          const Wrapper = clickable ? "button" : "div";

          return (
            <div
              key={item.id}
              className="relative flex w-full md:min-w-0 md:flex-1"
            >
              <Wrapper
                {...(clickable
                  ? {
                      type: "button" as const,
                      onClick: item.onClick,
                    }
                  : {})}
                className={cn(
                  "group flex w-full items-start text-left md:block",
                  clickable && "transition-opacity hover:opacity-90",
                )}
              >
                <div className="flex w-full items-start gap-4 md:block">
                  <div className="relative flex w-10 shrink-0 justify-center md:w-full md:justify-start">
                    <span
                      className={cn(
                        "relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors",
                        iconStyles[status],
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    {!isLast && (
                      <>
                        <div
                          className={cn(
                            "absolute left-1/2 top-10 h-[calc(100%+1rem)] w-0.5 -translate-x-1/2 rounded-full md:hidden",
                            lineStyles[status],
                          )}
                        />
                        <div
                          className={cn(
                            "absolute left-12 right-0 top-1/2 hidden h-0.5 -translate-y-1/2 rounded-full md:block",
                            lineStyles[status],
                          )}
                        />
                      </>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-2 pt-1 md:pr-6 md:pt-4">
                    <p className="text-base font-bold text-slate-800">
                      {item.title}
                    </p>

                    <div className="mt-2 flex flex-col gap-2">
                      <span
                        className={cn(
                          "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium",
                          badgeStyles[status],
                        )}
                      >
                        {item.badgeLabel ?? defaultBadgeLabel[status]}
                      </span>

                      {item.meta && (
                        <p className="text-sm text-slate-400">{item.meta}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Wrapper>
            </div>
          );
        })}
      </div>
    </div>
  );
}
