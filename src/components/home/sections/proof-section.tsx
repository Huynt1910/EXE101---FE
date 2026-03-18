"use client";

import { useEffect, useRef, useState } from "react";
import { FlaskConical, Leaf, Shield, Users } from "lucide-react";
import { ScrollBlurText } from "@/components/animations/scroll-blur-text";
import { homePageContent } from "@/content/site-content";

const statIcons = {
  users: Users,
  shield: Shield,
  flask: FlaskConical,
  leaf: Leaf,
} as const;

export function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animatedValues, setAnimatedValues] = useState<{
    [key: string]: number;
  }>({});
  const [hasAnimated, setHasAnimated] = useState(false);
  const t = homePageContent.proof;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            if (!hasAnimated) {
              setHasAnimated(true);
              t.stats.forEach((stat) => {
                animateCounter(stat.value, stat.label);
              });
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [hasAnimated, t.stats]);

  const animateCounter = (value: string, label: string) => {
    const numericValue = Number.parseInt(value.replace(/[^0-9]/g, ""));
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentValue = Math.min(
        Math.round(increment * currentStep),
        numericValue,
      );
      setAnimatedValues((prev) => ({ ...prev, [label]: currentValue }));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);
  };

  const formatValue = (
    originalValue: string,
    animatedValue: number | undefined,
  ) => {
    if (animatedValue === undefined) return "0";

    if (originalValue.includes("%")) return `${animatedValue}%`;
    if (originalValue.includes("K+")) return `${animatedValue}K+`;
    if (originalValue.includes("+")) return `${animatedValue}+`;
    if (originalValue.toLowerCase().includes("h")) return `${animatedValue}h`;
    return `${animatedValue}`;
  };

  return (
    <section
      ref={sectionRef}
      id="science"
      className="py-24 lg:py-32 bg-primary text-primary-foreground"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-primary-foreground/70 font-medium mb-4">
            {t.eyebrow}
          </p>
          <ScrollBlurText
            text={t.title}
            className="font-serif text-3xl md:text-4xl text-primary-foreground text-balance mb-6 lg:text-7xl font-light"
          />
          <p className="reveal opacity-0 animation-delay-400 text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="reveal opacity-0 animation-delay-400 grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {t.stats.map((stat) => {
            const Icon = statIcons[stat.icon as keyof typeof statIcons];
            return (
              <div key={stat.label} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                  {Icon ? (
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  ) : null}
                </div>
                <div className="font-serif text-4xl md:text-5xl font-medium text-primary-foreground mb-2">
                  {formatValue(stat.value, animatedValues[stat.label])}
                </div>
                <div className="text-sm text-primary-foreground/70">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {t.principles.map((principle, index) => (
            <div
              key={principle.number}
              className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : ""}`}
            >
              <div className="border-t border-primary-foreground/20 pt-8">
                <span className="text-sm font-medium text-primary-foreground/50 mb-4 block">
                  {principle.number}
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-medium text-primary-foreground mb-4">
                  {principle.title}
                </h3>
                <p className="text-primary-foreground/70 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

