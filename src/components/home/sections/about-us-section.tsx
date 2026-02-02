"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type AboutUsSectionProps = {
  eyebrow?: string;
  eyebrowHint?: string;

  headline?: string;
  subheadline?: string;
  description?: string;

  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;

  videoSrc?: string;
  posterSrc?: string;
};

export function AboutUsSection(props: AboutUsSectionProps) {
  const {
    eyebrow = "ABOUT BONDDY",
    eyebrowHint = "Meet our team and mission",

    headline = "Travel like a local — with a buddy who knows the city.",
    subheadline = "Bonddy connects you with verified locals to design a personalized itinerary, share hidden gems, and support you before and during your trip.",
    description = "Instead of generic tours, you get real places, real food, and real recommendations — based on your pace and preferences.",

    primaryButtonText = "Read our story",
    primaryButtonHref = "/about-us",
    secondaryButtonText = "Browse buddies",
    secondaryButtonHref = "/buddies",

    videoSrc = "/videos/tvc.mp4",
  } = props;

  return (
    <section className="w-full px-8 pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* OUTER WRAP giống mẫu Withlocals */}
        <div className="rounded-[40px] bg-[#e9e9e9] p-6 md:p-10">
          <div className="grid grid-cols-12 gap-6 items-center">
            {/* LEFT: Content (bỏ bg riêng nếu muốn giống mẫu) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
              className="
            col-span-12 lg:col-span-6
            rounded-[32px]
            bg-transparent
            p-6 md:p-8 lg:p-10
          "
            >
              {/* Eyebrow */}
              <div className="flex flex-col gap-1 text-[#6b6b6b] mb-6">
                <motion.span
                  initial={{ transform: "translateY(14px)", opacity: 0 }}
                  whileInView={{ transform: "translateY(0px)", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    ease: [0.645, 0.045, 0.355, 1],
                    delay: 0.15,
                  }}
                  className="text-sm uppercase tracking-tight font-mono flex items-center gap-2"
                  style={{
                    fontFamily:
                      "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
                  }}
                >
                  {eyebrow}
                  <ArrowUpRight className="w-[0.75em] h-[0.75em]" />
                </motion.span>

                <span
                  className="text-sm uppercase tracking-[0.16em] text-[#8a8a8a]"
                  style={{
                    fontFamily:
                      "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
                  }}
                >
                  {eyebrowHint}
                </span>
              </div>

              {/* Headline */}
              <h2
                className="text-[48px] md:text-[56px] leading-[1.05] tracking-tight text-[#202020] max-w-[520px] mb-6"
                style={{
                  fontWeight: "500",
                  fontFamily: "var(--font-figtree), Figtree",
                }}
              >
                {headline}
              </h2>

              {/* Subheadline */}
              <p
                className="text-lg leading-7 text-[#404040] max-w-[520px] mb-6"
                style={{ fontFamily: "var(--font-figtree), Figtree" }}
              >
                {subheadline}
              </p>

              {/* Description (optional) */}
              <p
                className="text-base leading-6 text-[#4a4a4a] max-w-[520px]"
                style={{ fontFamily: "var(--font-figtree), Figtree" }}
              >
                {description}
              </p>

              {/* CTA */}
              <ul className="flex gap-2 flex-wrap mt-10">
                <li>
                  <a
                    href={primaryButtonHref}
                    className="block cursor-pointer text-white rounded-full px-[18px] py-[15px] text-base leading-4 whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)]"
                    style={{ background: "#156d95" }}
                  >
                    {primaryButtonText}
                  </a>
                </li>
                <li>
                  <a
                    href={secondaryButtonHref}
                    className="block cursor-pointer text-[#202020] border border-[#202020] rounded-full px-[18px] py-[15px] text-base leading-4 whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)]"
                  >
                    {secondaryButtonText}
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                ease: [0.645, 0.045, 0.355, 1],
                delay: 0.2,
              }}
              className="
            col-span-12 lg:col-span-6
            flex items-center justify-center
          "
            >
              {/* CARD nổi như mẫu */}
              <div
                className="
              w-full
              rounded-[28px]
              bg-white/0
              shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)]
              ring-1 ring-black/5
            "
              >
                {/* GIỮ NGUYÊN phần right của bạn */}
                <div className="w-full max-w-full aspect-[16/10] rounded-3xl overflow-hidden bg-black">
                  <video
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
