"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";

import { ensureGsapPlugins } from "./useGsapScroll";

export function useLenis(enabled = true) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateReducedMotion();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateReducedMotion);

      return () => {
        mediaQuery.removeEventListener("change", updateReducedMotion);
      };
    }

    mediaQuery.addListener(updateReducedMotion);

    return () => {
      mediaQuery.removeListener(updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotion || typeof window === "undefined") {
      return;
    }

    const { ScrollTrigger } = ensureGsapPlugins();
    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", handleScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [enabled, reducedMotion]);

  return { reducedMotion };
}
