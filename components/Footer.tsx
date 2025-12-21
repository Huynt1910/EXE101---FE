"use client";

import { Facebook, Instagram, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

type Section = {
  title: string;
  description?: string;
  links?: { label: string; href: string }[];
};

const sections: Section[] = [
  {
    title: "LocalHost",
    description:
      "Connect with local buddies and experience authentic adventures.",
    links: [
      { label: "Luxury Vietnam Tours", href: "#" },
      { label: "Best North Vietnam Tours", href: "#" },
      { label: "Vietnam Family Holidays", href: "#" },
      { label: "Vietnam Highlights", href: "#" },
    ],
  },
  {
    title: "Multi-day Tours",
    links: [
      { label: "7 Days in Vietnam", href: "#" },
      { label: "8 & 9 Days in Vietnam", href: "#" },
      { label: "10 Days in Vietnam", href: "#" },
      { label: "2 Weeks in Vietnam", href: "#" },
    ],
  },
  {
    title: "Experiences",
    links: [
      { label: "All Halong Cruises", href: "#" },
      { label: "Halong Bay Cruises", href: "#" },
      { label: "Mekong River Cruises", href: "#" },
      { label: "Cat Ba Island Cruises", href: "#" },
    ],
  },
  {
    title: "Travel Guide",
    links: [
      { label: "Best Time to Visit Vietnam", href: "#" },
      { label: "Vietnam Visa Requirements", href: "#" },
      { label: "Top Things to Do", href: "#" },
      { label: "Hanoi Travel Guide", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Accordion sections */}
        <div className="md:hidden space-y-3 mb-10">
          {sections.map((sec, idx) => (
            <details
              key={sec.title}
              className="rounded-lg border border-background/20 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                <span className="font-bold">{sec.title}</span>
                <span aria-hidden className="ml-2 text-sm opacity-80">
                  ▾
                </span>
              </summary>

              <div className="px-4 pb-4">
                {sec.description && (
                  <p className="text-sm opacity-80 mb-3">{sec.description}</p>
                )}
                {sec.links && (
                  <ul className="space-y-2 text-sm opacity-90">
                    {sec.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="hover:text-orange-300 underline-offset-4 hover:underline"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>

        {/* Desktop: 5 columns grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {sections.map((sec) => (
            <div key={sec.title}>
              <h3 className="font-bold text-lg mb-4">{sec.title}</h3>
              {sec.description && (
                <p className="text-sm opacity-80 mb-3">{sec.description}</p>
              )}
              {sec.links && (
                <ul className="space-y-2 text-sm opacity-80">
                  {sec.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="hover:text-orange-300 underline-offset-4 hover:underline"
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

        {/* Contact + Social */}
        <div className="border-t border-background/20 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div>
            <h4 className="font-bold text-lg mb-3">
              Your Local Expert for Vietnam & Asia Tours
            </h4>
            <p className="text-sm opacity-80 mb-4">
              LocalHost is your trusted partner for authentic local experiences
              across Vietnam and Asia.
            </p>
            <div className="space-y-2 text-sm opacity-80">
              <p>
                <span className="mr-2" aria-hidden>
                  📧
                </span>
                <a
                  href="mailto:info@localhost.com"
                  className="hover:text-orange-300 underline-offset-4 hover:underline"
                >
                  info@localhost.com
                </a>
              </p>
              <p>
                <span className="mr-2" aria-hidden>
                  📱
                </span>
                <a
                  href="tel:+84123456789"
                  className="hover:text-orange-300 underline-offset-4 hover:underline"
                >
                  +84 123 456 789
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end justify-between">
            <div className="flex gap-4 mb-4">
              <a href="#" aria-label="Facebook">
                <Facebook className="w-6 h-6 hover:text-orange-300 transition-colors" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="w-6 h-6 hover:text-orange-300 transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="w-6 h-6 hover:text-orange-300 transition-colors" />
              </a>
              <a href="#" aria-label="Messenger">
                <MessageCircle className="w-6 h-6 hover:text-orange-300 transition-colors" />
              </a>
            </div>
            <p className="text-sm opacity-80">
              © {new Date().getFullYear()} Townie. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
