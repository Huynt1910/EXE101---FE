"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/provider/appProviders";
import { getHomepageContent } from "@/i18n";

export function BuddiesFormSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const t = getHomepageContent(language).buddiesForm;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="become-a-buddy"
      className="py-24 lg:py-32 px-6"
    >
      <div className="relative max-w-7xl mx-auto rounded-[48px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/buddies-form-bg.png"
            alt={t.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[2px]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[8px] opacity-60" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[20px] opacity-30" />
        </div>

        <div className="relative px-6 lg:px-8 py-16 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="reveal opacity-0 order-2 lg:order-1" />

            <div className="order-1 lg:order-2">
              <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
                {t.eyebrow}
              </p>

              <h2 className="reveal opacity-0 animation-delay-200 font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-secondary text-balance mb-6">
                {t.title}
              </h2>

              <div className="reveal opacity-0 animation-delay-400 space-y-5 text-secondary/90 leading-relaxed">
                <p>{t.paragraph1}</p>
                <p>{t.paragraph2}</p>

                <p className="text-sm text-secondary/80">{t.meta}</p>
              </div>

              <div className="reveal opacity-0 animation-delay-600 mt-10 flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 group"
                  asChild
                >
                  <Link href={t.primaryHref}>
                    {t.primaryCta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-background/30 hover:bg-background/10 text-primary-foreground bg-transparent backdrop-blur-sm"
                  asChild
                >
                  <Link href={t.secondaryHref}>{t.secondaryCta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

