"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authStore } from "@/lib/store/authStore";

type ProfileTopBarProps = {
  title?: string;
  description?: string;
};

export function ProfileTopBar({
  title = "Profile",
  description = "Manage your account, upcoming plans, and travel activity.",
}: Readonly<ProfileTopBarProps>) {
  return (
    <header className="rounded-[1.75rem] border border-border/60 bg-background p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="type-h2 font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-secondary hover:text-secondary-foreground"
            variant="destructive"
            onClick={() => {
              authStore.logout();
              window.location.replace("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
