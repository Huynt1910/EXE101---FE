"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { buildAuthUrl } from "@/lib/auth/callback-url";

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // ===== Callback URL (chuẩn App Router) =====
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  // ===== Lock scroll + focus management =====
  useEffect(() => {
    const body = document.body;

    if (open) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      body.style.paddingRight = `${scrollbarWidth}px`;
      body.style.overflow = "hidden";

      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else {
      body.style.overflow = "";
      body.style.paddingRight = "";
    }

    return () => {
      body.style.overflow = "";
      body.style.paddingRight = "";
    };
  }, [open]);

  // ===== ESC close =====
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="font-bold text-primary text-3xl">
          Bonddy
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/explore" className="hover:text-primary font-medium">
            Explore
          </Link>
          <Link
            href="/host-dashboard"
            className="hover:text-primary font-medium"
          >
            Become a Host
          </Link>
          <Link href="/about" className="hover:text-primary font-medium">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary font-medium">
            Contact
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={buildAuthUrl("/login", currentPath)}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Log in
          </Link>

          <Link href={buildAuthUrl("/signup", currentPath)}>
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-primary hover:text-white transition-colors"
            >
              Sign up
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 w-full h-full bg-black/40"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Mobile drawer */}
      <aside
        id="mobile-menu"
        className={`fixed right-0 top-0 z-[60] md:hidden h-dvh w-[90vw] max-w-sm
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        onClick={(e) => e.stopPropagation()}
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        <div className="h-dvh bg-background text-foreground border-l border-border shadow-xl flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="px-4 py-4 flex items-center justify-between border-b border-border">
            <Link
              href="/"
              className="font-bold text-primary text-2xl"
              onClick={() => setOpen(false)}
            >
              Bonddy
            </Link>
            <Button
              ref={closeBtnRef}
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Links */}
          <div className="p-4 space-y-1">
            <Link
              href="/explore"
              className="block px-3 py-3 rounded-lg hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/host-dashboard"
              className="block px-3 py-3 rounded-lg hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Become a Host
            </Link>
            <Link
              href="/about"
              className="block px-3 py-3 rounded-lg hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-3 rounded-lg hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className="px-4">
            <hr className="border-border" />
          </div>

          {/* Auth actions (Mobile) */}
          <div className="p-4 flex flex-col gap-3">
            <Link
              href={buildAuthUrl("/login", currentPath)}
              onClick={() => setOpen(false)}
              className="text-center text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Log in
            </Link>

            <Link
              href={buildAuthUrl("/signup", currentPath)}
              onClick={() => setOpen(false)}
            >
              <Button className="w-full bg-white text-primary hover:bg-primary hover:text-white transition-colors">
                Sign up
              </Button>
            </Link>
          </div>

          <div className="mt-auto p-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bonddy. All rights reserved.
          </div>
        </div>
      </aside>
    </nav>
  );
}
