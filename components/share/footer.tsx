"use client";

import { Facebook, Instagram, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useMessages } from "@/lib/i18n/useMessages";

type Section = {
  title: string;
  description?: string;
  links?: ReadonlyArray<{ label: string; href: string }>;
};

export default function Footer() {
  const t = useMessages().footer;

  return (
    <footer className="bg-foreground py-14 text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {t.sections.map((sec: Section) => (
            <div key={sec.title}>
              <h3 className="mb-3 text-lg font-bold">{sec.title}</h3>
              {sec.description && (
                <p className="mb-4 text-sm opacity-80">{sec.description}</p>
              )}
              {sec.links && (
                <ul className="space-y-2 text-sm opacity-80">
                  {sec.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="underline-offset-4 hover:text-orange-300 hover:underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border-t border-background/20 pt-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-lg font-bold">{t.contactTitle}</h4>
            <p className="mb-4 text-sm opacity-80">{t.contactDesc}</p>
            <div className="space-y-2 text-sm opacity-80">
              <p>
                <a
                  href={`mailto:${t.email}`}
                  className="underline-offset-4 hover:text-orange-300 hover:underline"
                >
                  {t.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${t.phone}`}
                  className="underline-offset-4 hover:text-orange-300 hover:underline"
                >
                  {t.phone}
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between md:items-end">
            <div className="mb-4 flex gap-4">
              <a href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 transition-colors hover:text-orange-300" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 transition-colors hover:text-orange-300" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 transition-colors hover:text-orange-300" />
              </a>
              <a href="#" aria-label="Messenger">
                <MessageCircle className="h-6 w-6 transition-colors hover:text-orange-300" />
              </a>
            </div>
            <p className="text-sm opacity-80">
              {t.copyright} {new Date().getFullYear()} Bonddy. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
