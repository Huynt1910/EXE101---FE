"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type SubscriptionTone = {
  badgeClassName: string;
  frameClassName: string;
};

function getSubscriptionTone(
  packageName?: string | null,
): SubscriptionTone | null {
  switch (packageName?.trim().toLowerCase()) {
    case "founder":
      return {
        badgeClassName:
          "border-amber-300 bg-amber-50 text-amber-700 shadow-amber-200/80",
        frameClassName: "bg-amber-400 shadow-amber-200/80",
      };
    case "pro":
      return {
        badgeClassName:
          "border-red-300 bg-red-50 text-red-700 shadow-red-200/80",
        frameClassName: "bg-red-400 shadow-red-200/80",
      };
    case "starter":
      return {
        badgeClassName:
          "border-orange-300 bg-sky-50 text-sky-700 shadow-sky-200/80",
        frameClassName: "bg-sky-400 shadow-sky-200/80",
      };
    default:
      return null;
  }
}

export function BuddySubscriptionAvatar({
  profilePicture,
  fullName,
  initials,
  packageName,
  className,
  avatarClassName,
  fallbackClassName,
}: Readonly<{
  profilePicture?: string | null;
  fullName: string;
  initials: string;
  packageName?: string | null;
  className?: string;
  avatarClassName?: string;
  fallbackClassName?: string;
}>) {
  const tone = React.useMemo(
    () => getSubscriptionTone(packageName),
    [packageName],
  );
  const normalizedPackageName = packageName?.trim();

  const avatarNode = (
    <Avatar className={cn("bg-white", avatarClassName)}>
      <AvatarImage
        src={profilePicture ?? undefined}
        alt={fullName}
        className="object-cover"
      />
      <AvatarFallback className={fallbackClassName}>{initials}</AvatarFallback>
    </Avatar>
  );

  if (!tone || !normalizedPackageName) {
    return <div className={cn("inline-flex", className)}>{avatarNode}</div>;
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "absolute left-0 top-0 z-20 -translate-x-1/4 -translate-y-1/3 rounded-full border px-1.5 py-0.5 text-[0.45rem] font-semibold uppercase leading-none tracking-[0.08em] shadow-sm",
          tone.badgeClassName,
        )}
      >
        {normalizedPackageName}
      </div>
      <div
        className={cn(
          "rounded-full p-[3px] ring-1 ring-black/5 shadow-lg",
          tone.frameClassName,
        )}
      >
        {avatarNode}
      </div>
    </div>
  );
}
