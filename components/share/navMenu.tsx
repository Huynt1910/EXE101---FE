"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/share/AppProviders";
import { useMessages } from "@/lib/i18n/useMessages";

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const { language, setLanguage } = useLanguage();
  const t = useMessages().nav;

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-3xl font-bold text-primary">
          {t.brand}
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/70 p-1">
            <button
              type="button"
              onClick={() => setLanguage("vi")}
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
                language === "vi"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🇻🇳</span>
              VI
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
                language === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>🇺🇸</span>
              EN
            </button>
          </div>
        </div>

        {/* <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div> */}
      </div>

      {/* <div
        className={`fixed inset-0 z-50 transition-opacity md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute inset-0 h-full w-full bg-black/40"
          aria-label={t.closeOverlay}
          onClick={() => setOpen(false)}
        />
      </div> */}
      {/* 
      <aside
        id="mobile-menu"
        className={`fixed inset-y-0 right-0 z-[60] w-[90vw] max-w-sm transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        onClick={(e) => e.stopPropagation()}
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        <div className="flex h-dvh w-full flex-col overflow-y-auto border-l border-border bg-background text-foreground shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <Link
              href="/"
              className="text-2xl font-bold text-primary"
              onClick={() => setOpen(false)}
            >
              {t.brand}
            </Link>
            <Button
              ref={closeBtnRef}
              variant="ghost"
              size="icon"
              aria-label={t.closeMenu}
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-1 p-4">
            <Link
              href="/explore"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {t.explore}
            </Link>
            <Link
              href="/host-dashboard"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {t.host}
            </Link>
            <Link
              href="/about"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {t.about}
            </Link>
            <Link
              href="/contact"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              {t.contact}
            </Link>
          </div>

          <div className="px-4">
            <hr className="border-border" />
          </div>

          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-background/70 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t.languageLabel}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("vi")}
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    language === "vi"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  🇻🇳 VI
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    language === "en"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>
            <Link href="/inbox" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                {t.inbox}
              </Button>
            </Link>
            <Link href="/buddy-dashboard" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                {t.findTrips}
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setOpen(false)}>
              <Button className="w-full">{t.dashboard}</Button>
            </Link>
          </div>

          <div className="mt-auto p-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bonddy. All rights reserved.
          </div>
        </div>
      </aside> */}
    </nav>
  );
}
