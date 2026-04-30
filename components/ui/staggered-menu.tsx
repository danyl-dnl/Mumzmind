"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

type StaggeredMenuItem = {
  href: string;
  label: string;
  eyebrow?: string;
};

type StaggeredMenuProps = {
  items: readonly StaggeredMenuItem[];
  logo?: string;
  subtitle?: string;
  badge?: string;
  colors?: [string, string, string];
  accentColor?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  className?: string;
};

export function StaggeredMenu({
  items,
  logo = "MumzMind",
  subtitle = "Next Chapter",
  badge = "Menu",
  colors = ["#250000", "#A50D25", "#FFF8F5"],
  accentColor = "#DE3A57",
  menuButtonColor = "#250000",
  openMenuButtonColor = "#250000",
  className,
}: StaggeredMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const darkLayerRef = useRef<HTMLDivElement | null>(null);
  const berryLayerRef = useRef<HTMLDivElement | null>(null);
  const ivoryLayerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const triggerLabel = isOpen ? "Close navigation menu" : "Open navigation menu";

  const menuItems = useMemo(() => items.map((item) => ({ ...item })), [items]);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(backdropRef.current, { autoAlpha: 0 });
      gsap.set([darkLayerRef.current, berryLayerRef.current, ivoryLayerRef.current], { xPercent: 108 });
      gsap.set(contentRef.current, { autoAlpha: 0 });
      gsap.set(itemRefs.current, { autoAlpha: 0, y: 22 });
      gsap.set(detailsRef.current, { autoAlpha: 0, y: 18 });

      timelineRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "power2.out" } })
        .to(backdropRef.current, { autoAlpha: 1, duration: prefersReducedMotion ? 0.01 : 0.24 }, 0)
        .to(darkLayerRef.current, { xPercent: 0, duration: prefersReducedMotion ? 0.01 : 0.52, ease: "power3.out" }, 0)
        .to(berryLayerRef.current, { xPercent: 0, duration: prefersReducedMotion ? 0.01 : 0.62, ease: "power3.out" }, prefersReducedMotion ? 0 : 0.04)
        .to(ivoryLayerRef.current, { xPercent: 0, duration: prefersReducedMotion ? 0.01 : 0.72, ease: "power3.out" }, prefersReducedMotion ? 0 : 0.08)
        .to(contentRef.current, { autoAlpha: 1, duration: prefersReducedMotion ? 0.01 : 0.16 }, prefersReducedMotion ? 0 : 0.24)
        .to(itemRefs.current, { autoAlpha: 1, y: 0, duration: prefersReducedMotion ? 0.01 : 0.46, stagger: prefersReducedMotion ? 0 : 0.07 }, prefersReducedMotion ? 0 : 0.26)
        .to(detailsRef.current, { autoAlpha: 1, y: 0, duration: prefersReducedMotion ? 0.01 : 0.4 }, prefersReducedMotion ? 0 : 0.36);
    }, rootRef);

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    if (isOpen) {
      timeline.play();
      document.body.style.overflow = "hidden";
      return;
    }

    timeline.reverse();
    document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div ref={rootRef} className={cn("relative lg:hidden", className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={triggerLabel}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(165,13,37,0.12)] bg-[rgba(255,252,251,0.92)] shadow-[0_12px_24px_rgba(37,0,0,0.08)] backdrop-blur-xl"
        style={{ color: isOpen ? openMenuButtonColor : menuButtonColor }}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[95]",
          isOpen && "pointer-events-auto",
        )}
        aria-hidden={!isOpen}
      >
        <div ref={backdropRef} className="absolute inset-0 bg-[rgba(37,0,0,0.22)] backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />

        <div
          ref={darkLayerRef}
          className="absolute inset-y-0 right-0 w-full max-w-[32rem]"
          style={{ backgroundColor: colors[0] }}
        />
        <div
          ref={berryLayerRef}
          className="absolute inset-y-0 right-0 w-full max-w-[30rem]"
          style={{ backgroundColor: colors[1] }}
        />
        <div
          ref={ivoryLayerRef}
          className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col border-l border-[rgba(165,13,37,0.08)] shadow-[0_24px_60px_rgba(37,0,0,0.14)]"
          style={{ backgroundColor: colors[2] }}
        >
          <div
            ref={contentRef}
            className="flex h-full flex-col px-6 pb-8 pt-6 sm:px-8 sm:pt-8"
          >
            <div className="mb-10 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-lg font-medium text-[var(--deep-plum)]">{logo}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[rgba(165,13,37,0.12)] bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--deep-berry)]">
                    {subtitle}
                  </span>
                  <span className="text-xs text-[var(--muted-mauve)]">{badge}</span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(165,13,37,0.12)] bg-white/80 text-[var(--deep-plum)] shadow-[0_10px_24px_rgba(37,0,0,0.06)]"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <nav className="flex-1" aria-label="Mobile navigation">
              <ul className="space-y-3">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        ref={(node) => {
                          itemRefs.current[index] = node;
                        }}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "group flex items-center justify-between rounded-[1.75rem] border px-5 py-4 transition-colors duration-200",
                          isActive
                            ? "border-[rgba(165,13,37,0.14)] bg-[rgba(244,178,176,0.22)] text-[var(--deep-plum)]"
                            : "border-[rgba(165,13,37,0.08)] bg-white/72 text-[var(--deep-plum)] hover:bg-white",
                        )}
                      >
                        <div>
                          {item.eyebrow ? (
                            <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">
                              {item.eyebrow}
                            </p>
                          ) : null}
                          <p className="text-[1.55rem] leading-none tracking-[-0.03em] sm:text-[1.9rem]">
                            {item.label}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full border transition-transform duration-200 group-hover:translate-x-0.5",
                            isActive
                              ? "border-[rgba(165,13,37,0.16)] bg-white/80 text-[var(--deep-berry)]"
                              : "border-[rgba(165,13,37,0.08)] bg-[rgba(255,248,245,0.92)] text-[var(--muted-mauve)]",
                          )}
                          style={isActive ? { color: accentColor } : undefined}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div ref={detailsRef} className="mt-8 rounded-[1.75rem] border border-[rgba(165,13,37,0.08)] bg-white/72 p-5">
              <p className="text-sm text-[var(--deep-plum)]">A calmer way to explore MumzMind.</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-mauve)]">
                Each route stays exactly the same. This overlay simply gives mobile and tablet navigation a warmer, more intentional feel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaggeredMenu;
