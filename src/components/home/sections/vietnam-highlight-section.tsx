"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollBlurText } from "@/components/animations/scroll-blur-text";

type Highlight = {
  name: string;
  image: string;
};

type VietnamHighlightSectionProps = {
  buttonText?: string;
  buttonHref?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  topRowHighlights?: Highlight[];
  bottomRowHighlights?: Highlight[];
};

const defaultTopRowHighlights: Highlight[] = [
  { name: "Bến Thành", image: "/places/ben-thanh.png" },
  { name: "Landmark 81", image: "/places/landmark-81.png" },
  { name: "Đà Nẵng", image: "/places/da-nang.png" },
  { name: "Vịnh Hạ Long", image: "/places/vinh-ha-long.png" },
  { name: "Đà Lạt", image: "/places/da-lat.png" },
  { name: "Sa Pa", image: "/places/sapa.png" },
  { name: "Hà Nội", image: "/places/ha-noi.png" },
  { name: "Nha Trang", image: "/places/nha-trang.png" },
  { name: "Hội An", image: "/places/hoi-an.png" },
];

const defaultBottomRowHighlights: Highlight[] = [
  { name: "Phở", image: "/foods/pho.png" },
  { name: "Bánh mì", image: "/foods/banh-mi.png" },
  { name: "Nem nướng", image: "/foods/nem-nuong.png" },
  { name: "Bánh xèo", image: "/foods/banh-xeo.png" },
  { name: "Cơm tấm", image: "/foods/com-tam.png" },
  { name: "Bún đậu", image: "/foods/bun-dau.png" },
  { name: "Bánh cuốn", image: "/foods/banh-cuon.png" },
  { name: "Súp cua", image: "/foods/sup-cua.png" },
  { name: "Bún thịt nướng", image: "/foods/bun-thit-nuong.png" },
];

export function VietnamHighlightsSection({
  buttonText = "Explore",
  buttonHref = "/places",
  eyebrow = "Vietnam highlights",
  title = "Discover Vietnam’s highlights.",
  subtitle = "From street-food nights to mountain getaways — explore culture, nature, and local life.",
  topRowHighlights = defaultTopRowHighlights,
  bottomRowHighlights = defaultBottomRowHighlights,
}: VietnamHighlightSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

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

  // Card chỉ có ảnh
  const HighlightCard = ({ highlight }: { highlight: Highlight }) => {
    return (
      <div className="w-64 h-40 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg group">
        <img
          src={highlight.image}
          alt={highlight.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
      {/* Header giống SolutionSection */}
      <div className="text-center mb-16 lg:mb-20">
        <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
          {eyebrow}
        </p>

        <ScrollBlurText
          text={title}
          className="font-serif text-3xl text-foreground text-balance mb-6 md:text-7xl font-light"
        />

        <p className="reveal opacity-0 animation-delay-400 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <motion.a
          href={buttonHref}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="inline-block mt-6 px-12 py-3 rounded-full border border-border hover:bg-muted transition"
        >
          {buttonText}
        </motion.a>
      </div>

      {/* Carousel */}
      <div className="relative h-[320px] overflow-hidden">
        {/* Top row */}
        <div
          ref={topRowRef}
          className="flex gap-6 absolute top-6 whitespace-nowrap"
        >
          {[...topRowHighlights, ...topRowHighlights].map((highlight, i) => (
            <HighlightCard key={`top-${i}`} highlight={highlight} />
          ))}
        </div>

        {/* Bottom row */}
        <div
          ref={bottomRowRef}
          className="flex gap-6 absolute top-[180px] whitespace-nowrap"
        >
          {[...bottomRowHighlights, ...bottomRowHighlights].map(
            (highlight, i) => (
              <HighlightCard key={`bot-${i}`} highlight={highlight} />
            ),
          )}
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
