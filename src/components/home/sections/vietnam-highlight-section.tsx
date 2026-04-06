"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollBlurText } from "@/components/animations/scroll-blur-text";
import { homePageContent } from "@/content/site-content";

type Highlight = {
  name: string;
  image: string;
};

export function VietnamHighlightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const t = homePageContent.vietnamHighlights;

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
    let topAnimationId = 0;
    let bottomAnimationId = 0;
    let topPosition = 0;
    let bottomPosition = 0;

    const animateTopRow = () => {
      const el = topRowRef.current;
      if (el) {
        topPosition -= 0.4;
        if (Math.abs(topPosition) >= el.scrollWidth / 2) topPosition = 0;
        el.style.transform = `translateX(${topPosition}px)`;
      }
      topAnimationId = requestAnimationFrame(animateTopRow);
    };

    const animateBottomRow = () => {
      const el = bottomRowRef.current;
      if (el) {
        bottomPosition -= 0.55;
        if (Math.abs(bottomPosition) >= el.scrollWidth / 2) bottomPosition = 0;
        el.style.transform = `translateX(${bottomPosition}px)`;
      }
      bottomAnimationId = requestAnimationFrame(animateBottomRow);
    };

    topAnimationId = requestAnimationFrame(animateTopRow);
    bottomAnimationId = requestAnimationFrame(animateBottomRow);

    return () => {
      cancelAnimationFrame(topAnimationId);
      cancelAnimationFrame(bottomAnimationId);
    };
  }, []);

  const HighlightCard = ({ highlight }: { highlight: Highlight }) => {
    return (
      <div className="group h-40 w-64 shrink-0 overflow-hidden rounded-[2rem] shadow-lg">
        <img
          src={highlight.image}
          alt={highlight.name}
          className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="vietnam-highlights"
      className="py-24 lg:py-32 bg-muted/30"
    >
      <div className="text-center mb-16 lg:mb-20">
        <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-orange-600 font-medium mb-4">
          {t.eyebrow}
        </p>

        <ScrollBlurText
          text={t.title}
          className="font-serif text-3xl text-foreground text-balance mb-6 md:text-7xl font-light"
        />

        <p className="reveal opacity-0 animation-delay-400 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>

        <motion.a
          href={t.buttonHref}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="inline-block mt-6 px-12 py-3 rounded-full text-secondary-foreground border-1 border-primary/10 hover:border-primary transition"
        >
          {t.buttonText}
        </motion.a>
      </div>

      <div className="relative h-[380px] overflow-hidden">
        <div
          ref={topRowRef}
          className="absolute top-4 flex gap-6 whitespace-nowrap"
        >
          {[...t.topRowHighlights, ...t.topRowHighlights].map(
            (highlight, i) => (
              <HighlightCard key={`top-${i}`} highlight={highlight} />
            ),
          )}
        </div>

        <div
          ref={bottomRowRef}
          className="absolute top-[204px] flex gap-6 whitespace-nowrap"
        >
          {[...t.bottomRowHighlights, ...t.bottomRowHighlights].map(
            (highlight, i) => (
              <HighlightCard key={`bot-${i}`} highlight={highlight} />
            ),
          )}
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
