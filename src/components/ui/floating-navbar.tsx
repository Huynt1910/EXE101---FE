"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type FloatingNavItem = {
  name: string;
  link: string;
  icon: ReactNode;
};

export function FloatingNav({
  navItems,
  className,
}: {
  navItems: FloatingNavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const direction = current - previous;

    if (current < 24) {
      setVisible(true);
      return;
    }

    if (direction < 0) {
      setVisible(true);
      return;
    }

    setVisible(false);
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -32 }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -32,
        }}
        transition={{ duration: 0.22 }}
        className={cn(
          "fixed inset-x-0 top-4 z-50 mx-auto w-[calc(100%-1rem)] max-w-5xl sm:w-[calc(100%-2rem)]",
          className,
        )}
      >
        <div className="rounded-full border border-border/60 bg-white/88 px-2 py-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <nav className="flex flex-wrap items-center justify-center gap-2 sm:flex-nowrap sm:justify-between">
            {navItems.map((item) => {
              const isActive =
                pathname === item.link ||
                (item.link !== "/" && pathname.startsWith(item.link));

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className={cn(
                    "flex min-w-[56px] items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:min-w-0 sm:px-4",
                    isActive
                      ? "bg-[#12372a] text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
