"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

type IntroProps = {
  /** intro có mở khi mount? (mặc định true) */
  defaultOpen?: boolean;
  /** gọi khi intro đóng (hết animation hoặc click Skip) */
  onClose?: () => void;
};

export default function IntroHomePage({
  defaultOpen = true,
  onClose,
}: IntroProps) {
  const [showIntro, setShowIntro] = useState(defaultOpen);
  const prefersReduced = useReducedMotion();

  const word = "Explore";
  const letters = useMemo(() => word.split(""), []);

  // thời gian animation tổng (memo để không tính lại mỗi render)
  const totalMs = useMemo(() => {
    const perCharDelay = prefersReduced ? 0 : 0.18; // s
    const perCharDur = 0.45; // s
    const holdAfterWrite = 0.9; // s
    return (
      (letters.length - 1) * perCharDelay * 1000 +
      perCharDur * 1000 +
      holdAfterWrite * 1000
    );
  }, [letters.length, prefersReduced]);

  // quản lý timer + khoá scroll
  useEffect(() => {
    if (!showIntro) return;

    // khoá scroll khi intro mở
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeout = setTimeout(
      () => {
        setShowIntro(false);
        onClose?.();
      },
      prefersReduced ? 1200 : totalMs
    );

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = prevOverflow;
    };
  }, [showIntro, prefersReduced, totalMs, onClose]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="intro"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 3 }}
          transition={{
            duration: prefersReduced ? 0.35 : 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        >
          {/* Ảnh nền cuộn ngang */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: prefersReduced ? 0 : "-50%" }}
            transition={{ duration: prefersReduced ? 0 : 8, ease: "linear" }}
            className="pointer-events-none absolute inset-0 flex w-[200%]"
          >
            <img
              src="/HaLong_Bay.jpg"
              alt=""
              className="h-full w-1/2 object-cover"
            />
            <img
              src="/Hoi_An.jpg"
              alt=""
              className="h-full w-1/2 object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

          {/* Chữ duy nhất */}
          <div className="relative z-10 text-center text-white">
            <h1
              className={`${greatVibes.className} leading-none text-[18vw] sm:text-[14vw] md:text-[10vw]`}
              style={{
                color: "#neutral-900",
                WebkitTextStroke: "0.06em #neutral-900",
                textShadow: "0 4px 18px",
              }}
            >
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: prefersReduced ? 0 : i * 0.18,
                    duration: 0.45,
                    ease: "easeOut",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReduced ? 0 : 0.9, duration: 0.6 }}
              className="mt-4 text-2xl sm:text-3xl md:text-5xl font-light tracking-wide"
            >
              your trip
            </motion.h2>

            <button
              onClick={() => {
                setShowIntro(false);
                onClose?.();
              }}
              className="mt-6 rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Skip intro
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
