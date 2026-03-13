"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ResizableNavItem = {
  name: string;
  link: string;
};

export function Navbar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 top-4 z-50 mx-auto w-[calc(100%-1rem)] max-w-6xl sm:w-[calc(100%-2rem)]">
      <div className="rounded-[28px] border border-border/60 bg-white/88 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

export function NavBody({ children }: { children: ReactNode }) {
  return (
    <div className="hidden items-center justify-between gap-6 px-4 py-3 md:flex lg:px-6">
      {children}
    </div>
  );
}

export function NavItems({ items }: { items: ResizableNavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {items.map((item) => {
        const isActive =
          pathname === item.link ||
          (item.link !== "/" && pathname.startsWith(item.link));

        return (
          <Link
            key={item.link}
            href={item.link}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#12372a] text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export function NavbarLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="rounded-full bg-[#12372a] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
        B
      </span>
      <span className="text-lg font-semibold text-slate-900">Bonddy</span>
    </Link>
  );
}

export function NavbarButton({
  children,
  className,
  variant = "primary",
  href,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: () => void;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
    variant === "primary"
      ? "bg-[#12372a] text-white hover:bg-[#0f2f24]"
      : "border border-border bg-white text-slate-700 hover:bg-slate-100",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function MobileNav({ children }: { children: ReactNode }) {
  return <div className="md:hidden">{children}</div>;
}

export function MobileNavHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      {children}
    </div>
  );
}

export function MobileNavToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Toggle navigation menu"
      onClick={onClick}
      className="rounded-full border border-border bg-white p-2 text-slate-700"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}

export function MobileNavMenu({
  children,
  isOpen,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border/60 px-4 pb-4 pt-3"
        >
          <div
            className="flex flex-col gap-3"
            onClick={(event) => {
              const target = event.target as HTMLElement;
              if (target.closest("a,button")) onClose();
            }}
          >
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
