"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedText } from "@/components/animations/animated-text";
// import Link from "next/link"; // nếu muốn link thật

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add("animate-fade-up");
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
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
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
          alt="Travel in Vietnam with a local buddy"
          className="w-full h-full object-cover animate-zoom-in"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="max-w-2xl">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-background font-medium mb-6">
            Travel with a local in Vietnam
          </p>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] text-background text-balance mb-8">
            <AnimatedText text="Meet your" delay={0.2} />
            <br />
            <span className="text-accent">
              <AnimatedText text="local buddy." delay={0.6} />
            </span>
            <br />
          </h1>

          <p className="reveal opacity-0 animation-delay-400 text-lg text-background/90 leading-relaxed mb-10 md:text-base">
            Tell us your interests and schedule. A verified local buddy crafts a
            personalized itinerary, recommends real experiences, and supports
            you in real time—right in chat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 rounded-full px-8 py-6 text-base group"
              // asChild
            >
              {/* <Link href="/trip-request"> */}
              Start your journey
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              {/* </Link> */}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full cursor-pointer px-8 py-6 text-base border-background/30 hover:bg-background/10 text-background bg-transparent backdrop-blur-sm"
              // asChild
            >
              {/* <Link href="/#how-it-works"> */}
              How it works
              {/* </Link> */}
            </Button>

            {/* Optional: CTA cho Buddy (nếu landing chung) */}
            {/* <Button
              size="lg"
              variant="ghost"
              className="rounded-full px-6 py-6 text-base text-background hover:bg-background/10"
              asChild
            >
              <Link href="/buddy/apply">Become a buddy</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
