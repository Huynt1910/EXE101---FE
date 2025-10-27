"use client";
import { motion, MotionProps } from "framer-motion";
import React from "react";
import clsx from "clsx";

export const sectionBase =
  "min-h-[100svh] snap-start flex flex-col justify-center py-16 md:py-20";
export const containerBase =
  "w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-7xl 2xl:max-w-[1280px]";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  asMotion?: boolean; // dùng motion.section nếu cần
} & MotionProps; // chứa cả 'style', 'id', 'onViewportEnter', ...

export default function Section({
  children,
  className,
  containerClassName,
  asMotion = true,
  ...motionProps
}: SectionProps) {
  // Dùng motion.section khi cần animation, ngược lại dùng section thuần túy
  const Wrap: any = asMotion ? motion.section : "section";

  // Chỉ add props animation khi asMotion=true
  const baseMotion = asMotion
    ? {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
        viewport: { amount: 0.35 },
      }
    : {};

  return (
    <Wrap
      className={clsx(sectionBase, className)}
      {...baseMotion}
      {...motionProps} // QUAN TRỌNG: forward style/id/aria/... xuống Wrap
    >
      <div className={clsx(containerBase, containerClassName)}>{children}</div>
    </Wrap>
  );
}
