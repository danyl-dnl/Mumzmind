"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

import GrainTexture from "./GrainTexture";
import MumzMindNav from "./MumzMindNav";
import { usePageMotion } from "../hooks/usePageMotion";

export default function MumzMindRouteFrame({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const motionConfig = usePageMotion();

  return (
    <div className="min-h-screen bg-[var(--warm-ivory)]">
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[80] -translate-y-16 rounded-full bg-white px-4 py-2 text-sm text-[var(--deep-plum)] shadow-lg focus:translate-y-0"
      >
        Skip to content
      </a>
      <GrainTexture />
      <MumzMindNav />
      <motion.main
        id="main-content"
        key={pathname}
        className="relative flex-1"
        initial={motionConfig.prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionConfig.prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </div>
  );
}
