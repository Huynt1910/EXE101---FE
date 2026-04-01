"use client";

import { FacebookIcon, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { footerContent } from "@/content/site-content";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: readonly FooterLink[];
};

type FooterProps = {
  companyName?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  sections?: readonly FooterSection[];
  socialLinks?: {
    facebook?: string;
    email?: string;
    phone?: string;
  };
  copyrightText?: string;
};

const defaultSections: FooterSection[] = [...footerContent.sections];

export const Footer = ({
  companyName = footerContent.companyName,
  tagline = footerContent.tagline,
  description = footerContent.description,
  email = footerContent.email,
  phone = footerContent.phone,
  sections = defaultSections,
  socialLinks = {
    facebook: "https://www.facebook.com/bonddy.nova",
    email: "bonddy.contact@gmail.com",
    phone: "098 986 12 70",
  },
  copyrightText,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const copyright =
    copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`;

  return (
    <footer
      id="contact"
      className="w-full border-t border-secondary-foreground bg-background"
    >
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="col-span-2"
          >
            <div className="mb-4">
              <h3
                className="mb-2 text-2xl font-semibold text-primary"
                style={{ fontFamily: "Figtree", fontWeight: "500" }}
              >
                {companyName}
              </h3>
              <p
                className="max-w-xs text-sm leading-5 text-primary"
                style={{ fontFamily: "Figtree" }}
              >
                {tagline}
              </p>
              <p
                className="mt-3 max-w-sm text-sm leading-6 text-primary/80"
                style={{ fontFamily: "Figtree" }}
              >
                {description}
              </p>
            </div>

            <div
              className="space-y-1 text-sm text-primary/80"
              style={{ fontFamily: "Figtree" }}
            >
              <p>{email}</p>
              <p>{phone}</p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors duration-150 hover:text-primary-foreground/80"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors duration-150 hover:text-primary-foreground/80"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {socialLinks.phone && (
                <a
                  href={`tel:${socialLinks.phone.replace(/\s+/g, "")}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors duration-150 hover:text-primary-foreground/80"
                  aria-label="Phone"
                >
                  <Phone className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>

          {sections.map((section, index) => (
            <motion.div
              key={section.title}
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
                className="mb-4 text-sm font-medium uppercase tracking-wide text-primary"
                style={{ fontFamily: "Figtree", fontWeight: "500" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-primary transition-colors duration-150 hover:text-primary/80"
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
          className="border-t border-border pt-8"
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p
              className="text-sm text-primary"
              style={{ fontFamily: "Figtree" }}
            >
              {copyright}
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#status"
                className="text-sm text-primary transition-colors duration-150 hover:text-primary/80"
                style={{ fontFamily: "Figtree" }}
              >
                Status
              </a>
              <a
                href="#sitemap"
                className="text-sm text-primary transition-colors duration-150 hover:text-primary/80"
                style={{ fontFamily: "Figtree" }}
              >
                Sitemap
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
