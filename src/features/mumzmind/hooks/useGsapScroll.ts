"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let gsapRegistered = false;

export type GsapScrollTools = {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
};

export function ensureGsapPlugins() {
  if (typeof window !== "undefined" && !gsapRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    gsapRegistered = true;
  }

  return { gsap, ScrollTrigger };
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useGsapScroll<T extends HTMLElement>(
  scopeRef: RefObject<T | null>,
  setup: (tools: GsapScrollTools) => void,
  enabled = true,
) {
  useIsomorphicLayoutEffect(() => {
    if (!enabled || !scopeRef.current || typeof window === "undefined") {
      return;
    }

    const tools = ensureGsapPlugins();
    const context = tools.gsap.context(() => {
      setup(tools);
    }, scopeRef);

    return () => {
      context.revert();
    };
  }, [enabled, scopeRef, setup]);
}
