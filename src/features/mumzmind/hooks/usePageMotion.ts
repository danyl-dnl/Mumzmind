"use client";

import { useEffect, useState } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "scale";

type RevealOptions = {
  delay?: number;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  scale?: number;
};

const DEFAULT_DISTANCE = 28;

export function usePageMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);

      return () => {
        mediaQuery.removeEventListener("change", updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);

    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  function getReveal({
    delay = 0,
    direction = "up",
    distance = DEFAULT_DISTANCE,
    duration = 0.6,
    scale = 0.96,
  }: RevealOptions = {}) {
    if (prefersReducedMotion) {
      return {
        initial: false as const,
        animate: { opacity: 1 },
        transition: { duration: 0 },
      };
    }

    const initialByDirection: Record<RevealDirection, Record<string, number>> = {
      up: { opacity: 0, y: distance },
      down: { opacity: 0, y: -distance },
      left: { opacity: 0, x: distance },
      right: { opacity: 0, x: -distance },
      scale: { opacity: 0, scale },
    };

    return {
      initial: initialByDirection[direction],
      animate: { opacity: 1, x: 0, y: 0, scale: 1 },
      transition: { delay, duration, ease: "easeOut" as const },
    };
  }

  return {
    prefersReducedMotion,
    getReveal,
    cardHover:
      prefersReducedMotion ? undefined : { y: -4, boxShadow: "0 16px 32px rgba(0, 0, 0, 0.08)" },
    cardHoverSoft: prefersReducedMotion ? undefined : { y: -2 },
    cardHoverScale: prefersReducedMotion ? undefined : { scale: 1.05, y: -4 },
    buttonHover: prefersReducedMotion ? undefined : { scale: 1.02 },
    buttonHoverStrong:
      prefersReducedMotion ? undefined : { scale: 1.05, boxShadow: "0 12px 24px rgba(255, 107, 157, 0.24)" },
    iconButtonHover: prefersReducedMotion ? undefined : { scale: 1.08 },
    gentleTap: prefersReducedMotion ? undefined : { scale: 0.98 },
    iconTap: prefersReducedMotion ? undefined : { scale: 0.92 },
    pulse:
      prefersReducedMotion
        ? undefined
        : {
            scale: [1, 1.12, 1],
          },
    floatAmbient:
      prefersReducedMotion
        ? undefined
        : {
            scale: [1, 1.16, 1],
            opacity: [0.28, 0.44, 0.28],
          },
  };
}
