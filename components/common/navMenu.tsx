"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Khoá scroll nền khi mở menu mobile + focus vào Close + bù scrollbar
  useEffect(() => {
    const body = document.body;

    if (open) {
      // Tính bề rộng scrollbar hiện tại
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Bù phần scrollbar để không bị "nhảy" layout
      body.style.paddingRight = `${scrollbarWidth}px`;
      body.style.overflow = "hidden";

      // Đưa focus vào nút Close cho accessibility
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else {
      // Khôi phục
      body.style.overflow = "";
      body.style.paddingRight = "";
    }

    // Cleanup khi unmount
    return () => {
      body.style.overflow = "";
      body.style.paddingRight = "";
    };
  }, [open]);

  // Đóng bằng Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        <div className="hidden md:flex items-center gap-3">
          <Link href="/inbox">
            <Button variant="outline" size="sm">
              Inbox
            </Button>
          </Link>
          <Link href="/buddy-dashboard">
            <Button variant="outline" size="sm">
              Find Trips
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="sm">Dashboard</Button>
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

      {/* Mobile off-canvas menu */}
      {/* Overlay (click để đóng) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Dùng button ở lớp nền để nhận click, tránh race khi chuyển trạng thái */}
        <button
          type="button"
          className="absolute inset-0 w-full h-full bg-black/40"
          aria-label="Close menu overlay"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* Panel (drawer) */}
      <aside
        id="mobile-menu"
        className={`fixed inset-0 z-[60] md:hidden transition-transform duration-300 ease-out
    ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        onClick={(e) => e.stopPropagation()}
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        {/* Drawer content: trượt từ phải vào */}
        <div className="ml-auto h-dvh w-[90vw] max-w-sm bg-background text-foreground border-l border-border shadow-xl flex flex-col overflow-y-auto">
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

          {/* Nav Links */}
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

          {/* Actions */}
          <div className="p-4 flex flex-col gap-3">
            <Link href="/inbox" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                Inbox
              </Button>
            </Link>
            <Link href="/buddy-dashboard" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                Find Trips
              </Button>
            </Link>
            <Link href="/admin" onClick={() => setOpen(false)}>
              <Button className="w-full">Dashboard</Button>
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
