"use client";

import Link from "next/link";
import { useState } from "react";
import { List, PanelLeftClose, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MENU_ITEMS } from "./profile-data";

type ProfileSidebarProps = {
  mobile?: boolean;
};

export function ProfileSidebar({ mobile = false }: ProfileSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const isItemActive = (href: string, itemSection?: string) => {
    if (itemSection) {
      return pathname === "/profile" && section === itemSection;
    }

    if (href === "/profile") {
      return pathname === "/profile" && !section;
    }

    return pathname === href;
  };

  const menuItems = (
    <nav className="mt-8 space-y-2">
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isItemActive(item.href, item.section);

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => {
              if (mobile) setIsMobileOpen(false);
            }}
            className={cn(
              "group relative flex w-full items-center rounded-2xl px-3 py-2.5 text-left transition",
              isCollapsed ? "justify-center" : "gap-3",
              active
                ? "bg-background text-primary shadow-sm"
                : "text-primary-foreground/90 hover:bg-primary-foreground/10",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />

            {!isCollapsed ? (
              <span className="type-body-sm">{item.label}</span>
            ) : (
              <span className="pointer-events-none absolute left-full z-20 ml-2 whitespace-nowrap rounded-md bg-card px-2 py-1 text-xs text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            )}

            {typeof item.badge === "number" && !isCollapsed ? (
              <span
                className={[
                  "ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-primary-foreground/20 text-primary-foreground",
                ].join(" ")}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  if (mobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg xl:hidden"
          aria-label="Open sidebar"
        >
          <List className="h-5 w-5" />
        </button>

        <div
          className={cn(
            "fixed inset-0 z-50 xl:hidden",
            isMobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "absolute inset-0 bg-black/40 transition-opacity",
              isMobileOpen ? "opacity-100" : "opacity-0",
            )}
            aria-label="Close sidebar overlay"
          />

          <aside
            className={cn(
              "relative h-full w-[280px] bg-primary p-5 text-primary-foreground shadow-xl transition-transform duration-300",
              isMobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="type-h3 font-semibold cursor-pointer"
                onClick={() => setIsMobileOpen(false)}
              >
                Bonddy
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground/90 transition hover:bg-primary-foreground/10"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {menuItems}
          </aside>
        </div>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "h-full rounded-br-4xl rounded-tr-4xl bg-primary text-primary-foreground shadow-sm transition-all duration-300",
        isCollapsed ? "w-20 p-3" : "w-[250px] p-6",
      )}
    >
      <div
        className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link
          href="/"
          className="type-h3 font-semibold cursor-pointer text-accent"
        >
          {isCollapsed ? null : "Bonddy"}
        </Link>

        {!isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground/90 transition hover:bg-primary-foreground/10"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {isCollapsed ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground/90 transition hover:bg-primary-foreground/10"
            aria-label="Expand sidebar"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {menuItems}
    </aside>
  );
}
