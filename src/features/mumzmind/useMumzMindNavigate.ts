"use client";

import { usePathname, useRouter } from "next/navigation";

import { mumzMindRouteMap, type MumzMindScreen } from "./routes";

export function useMumzMindNavigate() {
  const router = useRouter();
  const pathname = usePathname();

  return (screen: string) => {
    const path = mumzMindRouteMap[screen as MumzMindScreen] ?? "/";
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (path === pathname) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }

    router.push(path);
  };
}
