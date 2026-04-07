"use client";

import * as React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function SegmentedTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      className={cn(
        "h-auto w-fit flex-wrap rounded-2xl border border-border/70 bg-background p-1",
        className,
      )}
      {...props}
    />
  );
}

function SegmentedTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        "min-h-10 rounded-xl border-transparent px-5 py-2 text-sm font-semibold text-foreground/80 data-[state=active]:border-primary/10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { SegmentedTabsList, SegmentedTabsTrigger };
