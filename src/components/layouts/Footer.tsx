"use client";

import { useEffect, useRef, useState } from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { getCommonMessages, type Language } from "@/i18n";
import { useLanguage } from "@/lib/provider/appProviders";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type FooterProps = {
  companyName?: string;
  tagline?: string;
  sections?: FooterSection[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  copyrightText?: string;
};

const defaultSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Integrations", href: "#integrations" },
      { label: "Pricing", href: "#pricing" },
      { label: "API Docs", href: "#api" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" },
      { label: "Press Kit", href: "#press" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "Help Center", href: "#help" },
      { label: "Community", href: "#community" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Webinars", href: "#webinars" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Security", href: "#security" },
      { label: "Compliance", href: "#compliance" },
      { label: "Cookie Policy", href: "#cookies" },
    ],
  },
];

export const Footer = ({
  companyName = "Auralink",
  tagline = "The Intelligence Layer for Modern Communication",
  sections = defaultSections,
  socialLinks = {
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "hello@auralink.com",
  },
  copyrightText,
}: FooterProps) => {
  const { language, setLanguage } = useLanguage();
  const t = getCommonMessages(language);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const languageOptions: { code: Language; label: string; flag: string }[] = [
    { code: "vi", label: "Tieng Viet", flag: "🇻🇳" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];
  const activeLanguage =
    languageOptions.find((option) => option.code === language) ??
    languageOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentYear = new Date().getFullYear();
  const copyright =
    copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`;

  return (
    <footer id="contact" className="w-full bg-background border-t border-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="col-span-2"
          >
            <div className="mb-4">
              <h3
                className="text-2xl font-semibold text-primary mb-2"
                style={{ fontFamily: "Figtree", fontWeight: "500" }}
              >
                {companyName}
              </h3>
              <p
                className="text-sm leading-5 text-primary max-w-xs"
                style={{ fontFamily: "Figtree" }}
              >
                {tagline}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:text-primary-foreground/80 transition-colors duration-150"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:text-primary-foreground/80 transition-colors duration-150"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:text-primary-foreground/80 transition-colors duration-150"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:text-primary-foreground/80 transition-colors duration-150"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="col-span-1"
            >
              <h4
                className="text-sm font-medium text-primary mb-4 uppercase tracking-wide"
                style={{ fontFamily: "Figtree", fontWeight: "500" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
                      style={{ fontFamily: "Figtree" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-sm text-primary"
              style={{ fontFamily: "Figtree" }}
            >
              {copyright}
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#status"
                className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
                style={{ fontFamily: "Figtree" }}
              >
                Status
              </a>
              <a
                href="#sitemap"
                className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
                style={{ fontFamily: "Figtree" }}
              >
                Sitemap
              </a>

              <div className="relative" ref={languageRef}>
                <button
                  type="button"
                  onClick={() => setIsLanguageOpen((prev) => !prev)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors duration-150 rounded-md border border-border px-3 py-1.5"
                  style={{ fontFamily: "Figtree" }}
                  aria-expanded={isLanguageOpen}
                  aria-haspopup="listbox"
                >
                  {activeLanguage.flag} {activeLanguage.label}
                </button>

                {isLanguageOpen ? (
                  <ul
                    className="absolute right-0 bottom-11 z-20 min-w-[150px] rounded-lg border border-border bg-card p-1 shadow-lg"
                    role="listbox"
                  >
                    {languageOptions.map((option) => (
                      <li key={option.code}>
                        <button
                          type="button"
                          className="w-full rounded-md px-3 py-2 text-left text-sm text-primary hover:bg-muted transition-colors"
                          style={{ fontFamily: "Figtree" }}
                          onClick={() => {
                            setLanguage(option.code);
                            setIsLanguageOpen(false);
                          }}
                        >
                          {option.flag} {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
