"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedText } from "@/components/animations/animated-text";
import { useLanguage } from "@/components/common/AppProviders";
import { getHomepageContent } from "@/i18n";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { language } = useLanguage();
  const t = getHomepageContent(language).hero;

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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const scrollY = window.scrollY;
      const sectionHeight = sectionRef.current.offsetHeight;
      const progress = Math.min(scrollY / (sectionHeight * 0.5), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = 1 - scrollProgress * 0.05;
  const borderRadius = scrollProgress * 24;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center overflow-hidden pt-20"
    >
      <div
        ref={imageContainerRef}
        className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-100"
        style={{
          transform: `scale(${scale})`,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <img
          src="/hero.png"
          alt={t.imageAlt}
          className="w-full h-full object-cover animate-zoom-in"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="max-w-2xl">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-primary-foreground font-medium mb-6">
            {t.eyebrow}
          </p>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] text-primary-foreground text-balance mb-8">
            <AnimatedText text={t.titleLine1} delay={0.2} />
            <br />
            <span className="text-accent">
              <AnimatedText text={t.titleLine2} delay={0.6} />
            </span>
            <br />
          </h1>

          <p className="reveal opacity-0 animation-delay-400 text-lg text-primary-foreground/90 leading-relaxed mb-10 md:text-base">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-accent text-primary-foreground cursor-pointer hover:bg-accent/90 rounded-full px-8 py-6 text-base group"
            >
              <Link href="/trip-request">
                {t.primaryCta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full cursor-pointer px-8 py-6 text-primary-foreground border-background/30 hover:bg-background/10 bg-transparent backdrop-blur-sm"
            >
              {t.secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
