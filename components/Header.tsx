"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/AppProviders";
import { useMessages } from "@/lib/i18n/useMessages";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { language, setLanguage } = useLanguage();
  const t = useMessages().nav;

  useEffect(() => {
    if (open) {
      // Chỉ prevent scroll trên mobile, không adjust padding để tránh layout shift
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="relative z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl md:text-3xl font-bold text-primary">
          {t.brand}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
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

          {/* Auth Buttons */}
          <Link href="/login">
            <Button
              variant="ghost"
              className="font-semibold text-foreground hover:bg-transparent hover:text-primary"
            >
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="ghost"
              className="font-semibold text-primary hover:bg-primary hover:text-white bg-white"
            >
              Sign up
            </Button>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <Button
              variant="menuIcon"
              size="icon"
              aria-label="Menu"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-4 w-56 rounded-lg border border-border bg-background shadow-lg">
                <div className="p-2">
                  {/* Traveller Section */}
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-primary">
                      Profile
                    </p>
                  </div>
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Sign up
                  </Link>

                  <div className="my-2 border-t border-border" />

                  {/* Partner Section */}
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-primary">
                      Supports
                    </p>
                  </div>
                  <Link
                    href="/host-dashboard"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Become a guide
                  </Link>
                  <div className="my-2 border-t border-border" />

                  {/* Help */}
                  <Link
                    href="/help"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Help
                  </Link>

                  {/* Currency */}
                  <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted cursor-pointer">
                    <span>Currency: USD</span>
                    <span className="text-muted-foreground">›</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/signup">
            <Button
              variant="ghost"
              size="sm"
              className="font-semibold text-primary hover:bg-primary hover:text-white bg-white  px-4"
            >
              Sign up
            </Button>
          </Link>
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
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        style={{ willChange: open ? "opacity" : "auto" }}
      >
        <button
          type="button"
          className="absolute inset-0 h-full w-full bg-black/40 backdrop-blur-sm"
          aria-label={t.closeOverlay}
          onClick={() => setOpen(false)}
        />
      </div>

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
        style={{ 
          willChange: open ? "transform" : "auto",
          transform: `translate3d(${open ? "0" : "100%"}, 0, 0)`
        }}
      >
        <div className="flex h-dvh w-full flex-col overflow-y-auto border-l border-border bg-background text-foreground shadow-xl">
          <div className="space-y-1 p-4">
            {/* Traveller Section */}
            <div className="flex items-center justify-between px-2">
              <p className="text-sm font-semibold text-primary">Traveller</p>
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
            <Link
              href="/login"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Sign up
            </Link>

            <div className="px-4">
              <hr className="border-border" />
            </div>

            {/* Partner Section */}
            <div className="px-2 py-2">
              <p className="text-sm font-semibold text-primary">Partner</p>
            </div>
            <Link
              href="/login"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Log in (Partner)
            </Link>
            <Link
              href="/host-dashboard"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Become a guide
            </Link>
            <Link
              href="/buddy-dashboard"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Become an agency
            </Link>

            <div className="px-4">
              <hr className="border-border" />
            </div>

            {/* Help */}
            <Link
              href="/help"
              className="block rounded-lg px-3 py-3 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Help
            </Link>

            {/* Currency */}
            <div className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-muted cursor-pointer">
              <span>Currency: USD</span>
              <span className="text-muted-foreground">›</span>
            </div>
          </div>

          <div className="mt-auto p-4 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bonddy. All rights reserved.
          </div>
        </div>
      </aside>
    </nav>
  );
}
