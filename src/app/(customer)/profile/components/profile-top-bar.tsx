"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authStore } from "@/lib/store/authStore";

export function ProfileTopBar() {
  const router = useRouter();

  return (
    <header className="rounded-[1.75rem] bg-card/90 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="type-h2 font-semibold text-foreground">Profile</h1>

        <div className="flex items-center gap-2">
          <Button
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-secondary hover:text-secondary-foreground"
            variant="destructive"
            onClick={() => {
              authStore.logout();
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
