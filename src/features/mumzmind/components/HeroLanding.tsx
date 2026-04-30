"use client";

import { motion } from "motion/react";
import { Sparkles, Heart, Baby, ShoppingBag } from "lucide-react";
import { useCallback, useRef } from "react";

import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";
import { type GsapScrollTools, useGsapScroll } from "../hooks/useGsapScroll";
import { useLenis } from "../hooks/useLenis";

const milestones = [
  { label: "Newborn", icon: "👶", position: { x: 10, y: 50 } },
  { label: "Diaper Size 2", icon: "🍼", position: { x: 25, y: 30 } },
  { label: "Starting Solids", icon: "🥄", position: { x: 45, y: 20 } },
  { label: "Crawling", icon: "🧸", position: { x: 65, y: 35 } },
  { label: "First Shoes", icon: "👟", position: { x: 85, y: 45 } },
];

const MILESTONE_ICON_MAP: Record<string, PremiumBabyIconName> = {
  Newborn: "newborn",
  "Diaper Size 2": "diaper",
  "Starting Solids": "spoon",
  Crawling: "teddy",
  "First Shoes": "shoe",
};

const floatingCategories = [
  { name: "Diapers", color: "var(--pale-peach)", x: 15, y: 15 },
  { name: "Feeding", color: "var(--soft-mint)", x: 30, y: 70 },
  { name: "High Chair", color: "var(--blush-pink)", x: 50, y: 10 },
  { name: "Toys", color: "var(--mist-lavender)", x: 70, y: 75 },
  { name: "Shoes", color: "var(--powder-blue)", x: 85, y: 20 },
  { name: "Wipes", color: "var(--warm-sand)", x: 10, y: 85 },
];

const sections = [
  {
    title: "A calmer way to read each family rhythm",
    description: "Recent shopping moments become gentle stage signals, helping MumzMind prepare what may feel useful next.",
    icon: ShoppingBag,
  },
  {
    title: "Next chapters arrive with more calm and less guesswork",
    description: "From diaper transitions to first shoes, each stage is prepared with clear, human-friendly guidance.",
    icon: Sparkles,
  },
  {
    title: "Helpful essentials feel curated, not pushy",
    description: "Parents see warm, practical suggestions that support the moment without pressure or clutter.",
    icon: Heart,
  },
  {
    title: "Teams support families with clarity and care",
    description: "The CRM view stays explainable and practical, so every outreach feels more thoughtful and timely.",
    icon: Baby,
  },
];

export default function HeroLanding({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useLenis(true);
  const hoverScale = reducedMotion ? undefined : { scale: 1.05 };
  const tapScale = reducedMotion ? undefined : { scale: 0.96 };

  const setupScrollAnimations = useCallback(
    ({ gsap, ScrollTrigger }: GsapScrollTools) => {
      const heroTimeline = gsap.timeline({
        defaults: { ease: "power2.out" },
      });
      const heroPath = scopeRef.current?.querySelector<SVGPathElement>("[data-journey-path]");

      if (heroPath) {
        const pathLength = heroPath.getTotalLength();

        gsap.set(heroPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });
      }

      heroTimeline
        .from("[data-hero-nav]", { autoAlpha: 0, y: -24, duration: 0.7 })
        .from("[data-hero-badge]", { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.35")
        .from(
          "[data-hero-line]",
          {
            autoAlpha: 0,
            yPercent: 110,
            duration: 0.9,
            stagger: 0.14,
          },
          "-=0.2",
        )
        .from("[data-hero-copy]", { autoAlpha: 0, y: 26, duration: 0.7 }, "-=0.45")
        .from("[data-hero-actions]", { autoAlpha: 0, y: 24, duration: 0.7 }, "-=0.45")
        .from("[data-hero-visual]", { autoAlpha: 0, x: 34, duration: 1 }, "-=0.75");

      if (heroPath) {
        heroTimeline.to(
          heroPath,
          {
            strokeDashoffset: 0,
            duration: 1.45,
            ease: "power1.inOut",
          },
          "-=0.9",
        );
      }

      heroTimeline
        .from(
          "[data-milestone-node]",
          {
            autoAlpha: 0,
            scale: 0.84,
            duration: 0.48,
            stagger: 0.12,
          },
          "-=0.8",
        )
        .from("[data-prediction-badge]", { autoAlpha: 0, y: 18, duration: 0.6 }, "-=0.35");

      gsap.utils.toArray<HTMLElement>("[data-category-bubble]").forEach((bubble, index) => {
        gsap.fromTo(
          bubble,
          { x: 0, y: 0 },
          {
            x: index % 2 === 0 ? 6 : -6,
            y: index % 3 === 0 ? -12 : 10,
            duration: 4.4 + index * 0.25,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-story-section]").forEach((section) => {
        gsap.from(section, {
          autoAlpha: 0,
          y: 48,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
        });
      });

      const footer = scopeRef.current?.querySelector<HTMLElement>("[data-footer-cta]");

      if (footer) {
        gsap.from(footer, {
          autoAlpha: 0,
          y: 36,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 82%",
          },
        });
      }

      const firstStorySection = scopeRef.current?.querySelector<HTMLElement>('[data-story-section="0"]');

      if (firstStorySection && window.innerWidth >= 1024) {
        ScrollTrigger.create({
          trigger: firstStorySection,
          start: "top top+=88",
          end: "+=28%",
          pin: true,
          pinSpacing: true,
        });
      }
    },
    [],
  );

  useGsapScroll(scopeRef, setupScrollAnimations, !reducedMotion);

  return (
    <div ref={scopeRef} className="min-h-screen overflow-hidden bg-[var(--warm-ivory)]">
      {/* Animated background mesh */}
      <div className="pointer-events-none fixed inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 18% 28%, rgba(244, 178, 176, 0.26) 0%, transparent 46%)",
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }
          }
          transition={reducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 82% 66%, rgba(222, 58, 87, 0.14) 0%, transparent 48%)",
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.3, 0.5],
                }
          }
          transition={reducedMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Navigation */}
      <nav
        data-hero-nav
        className="relative z-10 flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(160deg,rgba(222,58,87,0.95),rgba(165,13,37,0.9))] shadow-[0_14px_28px_rgba(165,13,37,0.16)]">
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl text-[var(--deep-plum)]">MumzMind</h1>
        </div>

        <div className="mumz-badge flex flex-wrap items-center gap-2 self-start rounded-full px-4 py-2 text-xs text-[var(--deep-plum)] sm:self-auto sm:px-5 sm:text-sm">
          <span>English-only</span>
          <span className="text-xs opacity-60">&rarr;</span>
          <span className="opacity-60">Arabic later</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <div>
            <div
              data-hero-badge
              className="mumz-badge mb-6 inline-flex flex-wrap items-center gap-2 rounded-full px-4 py-2"
            >
              <Sparkles className="w-4 h-4 text-[var(--rose)]" />
              <span className="text-sm text-[var(--muted-mauve)]">Gentle stage signals and helpful essentials</span>
            </div>

            <h2 className="mb-6 overflow-hidden text-4xl leading-[1.04] text-[var(--deep-plum)] sm:text-5xl lg:text-[4.25rem]">
              <span data-hero-line className="block overflow-hidden">
                Your baby&rsquo;s next chapter,
              </span>
              <span data-hero-line className="block overflow-hidden">
                <span className="bg-gradient-to-r from-[var(--rose)] to-[var(--coral)] bg-clip-text text-transparent">
                  prepared with care.
                </span>
              </span>
              <span data-hero-line className="block overflow-hidden pt-3 text-[0.52em] font-normal text-[var(--muted-mauve)]">
                A calmer way to prepare for every gentle family moment.
              </span>
            </h2>

            <p data-hero-copy className="mb-8 max-w-xl text-base leading-relaxed text-[var(--muted-mauve)] sm:text-lg">
              MumzMind helps parents feel ready for each new stage, from feeding changes to first steps, using gentle stage signals and helpful essentials.
            </p>

            <div data-hero-actions className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <motion.button
                className="mumz-primary-button w-full rounded-full px-6 py-3.5 text-white sm:w-auto sm:px-8 sm:py-4"
                whileHover={hoverScale}
                whileTap={tapScale}
                onClick={() => onNavigate("parent")}
              >
                See the parent experience
              </motion.button>

              <motion.button
                className="mumz-secondary-button w-full rounded-full px-6 py-3.5 text-[var(--deep-plum)] sm:w-auto sm:px-8 sm:py-4"
                whileHover={hoverScale}
                whileTap={tapScale}
                onClick={() => onNavigate("crm")}
              >
                View the CRM preview
              </motion.button>
            </div>
          </div>

          {/* Right: Visual Journey Path */}
          <div data-hero-visual className="relative h-[320px] sm:h-[420px] lg:h-[500px]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                data-journey-path
                d="M 10,50 Q 30,30 50,20 T 85,45"
                stroke="url(#gradient)"
                strokeWidth="0.5"
                fill="none"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--rose)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--soft-teal)" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            {milestones.map((milestone) => (
              <div
                key={milestone.label}
                data-milestone-node
                className="absolute"
                style={{
                  left: `${milestone.position.x}%`,
                  top: `${milestone.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(165,13,37,0.08)] bg-[rgba(255,252,251,0.96)] text-2xl shadow-[0_18px_34px_rgba(37,0,0,0.08)] sm:h-14 sm:w-14 sm:text-[1.65rem] lg:h-16 lg:w-16 lg:text-3xl">
                    <PremiumBabyIcon
                      name={MILESTONE_ICON_MAP[milestone.label] ?? "newborn"}
                      className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
                    />
                  </div>
                  <p className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-center text-[10px] text-[var(--muted-mauve)] sm:text-xs">
                    {milestone.label}
                  </p>
                </div>
              </div>
            ))}

            {floatingCategories.map((category) => (
              <div
                key={category.name}
                data-category-bubble
                className="absolute rounded-full border border-[rgba(165,13,37,0.08)] px-3 py-1.5 text-xs shadow-[0_12px_22px_rgba(37,0,0,0.05)] backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
                style={{
                  left: `${category.x}%`,
                  top: `${category.y}%`,
                  backgroundColor: category.color,
                  color: "var(--deep-plum)",
                }}
              >
                {category.name}
              </div>
            ))}

            <motion.div
              data-prediction-badge
              className="absolute bottom-4 left-4 right-4 rounded-3xl border border-[rgba(165,13,37,0.08)] bg-[rgba(255,252,251,0.88)] px-4 py-4 shadow-[0_22px_36px_rgba(37,0,0,0.08)] backdrop-blur-lg sm:bottom-8 sm:left-auto sm:right-8 sm:w-auto sm:px-6"
              whileHover={hoverScale}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--coral)]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-mauve)]">Your baby&rsquo;s next chapter</p>
                  <p className="text-sm text-[var(--deep-plum)]">Starting solids may be coming soon</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Storytelling Sections */}
      <div className="relative z-10 mx-auto max-w-6xl space-y-20 px-4 py-20 sm:space-y-28 sm:px-6 sm:py-24 lg:space-y-32 lg:px-8 lg:py-28">
        {sections.map((section, idx) => (
          <section key={section.title} data-story-section={idx} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {idx % 2 === 0 ? (
              <>
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-[rgba(165,13,37,0.08)] bg-[rgba(255,251,250,0.88)] shadow-[0_14px_26px_rgba(37,0,0,0.05)] sm:h-16 sm:w-16">
                    <section.icon className="w-8 h-8 text-[var(--rose)]" />
                  </div>
                  <h3 className="mb-4 text-2xl text-[var(--deep-plum)] sm:text-3xl">{section.title}</h3>
                  <p className="text-base leading-relaxed text-[var(--muted-mauve)] sm:text-lg">{section.description}</p>
                </div>
                <div className="mumz-card-soft h-56 rounded-[2rem] bg-[linear-gradient(160deg,rgba(255,250,248,0.96),rgba(244,178,176,0.34))] p-8 sm:h-72 lg:h-80">
                  <div className="flex h-full flex-col justify-between rounded-[1.6rem] border border-white/70 bg-[rgba(255,255,255,0.48)] p-6">
                    <p className="max-w-sm text-sm uppercase tracking-[0.18em] text-[var(--muted-mauve)]">Prepared gently</p>
                    <div className="space-y-3">
                      <div className="h-3 w-2/3 rounded-full bg-[rgba(165,13,37,0.12)]" />
                      <div className="h-3 w-1/2 rounded-full bg-[rgba(222,58,87,0.18)]" />
                      <div className="h-3 w-3/4 rounded-full bg-[rgba(244,178,176,0.3)]" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mumz-card-soft h-56 rounded-[2rem] bg-[linear-gradient(155deg,rgba(255,250,248,0.96),rgba(250,225,226,0.7))] p-8 sm:h-72 lg:order-first lg:h-80">
                  <div className="flex h-full flex-col justify-between rounded-[1.6rem] border border-white/70 bg-[rgba(255,255,255,0.48)] p-6">
                    <p className="max-w-sm text-sm uppercase tracking-[0.18em] text-[var(--muted-mauve)]">A calmer way to prepare</p>
                    <div className="space-y-3">
                      <div className="h-3 w-1/2 rounded-full bg-[rgba(244,178,176,0.3)]" />
                      <div className="h-3 w-3/4 rounded-full bg-[rgba(165,13,37,0.12)]" />
                      <div className="h-3 w-2/3 rounded-full bg-[rgba(222,58,87,0.18)]" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-[rgba(165,13,37,0.08)] bg-[rgba(255,251,250,0.88)] shadow-[0_14px_26px_rgba(37,0,0,0.05)] sm:h-16 sm:w-16">
                    <section.icon className="w-8 h-8 text-[var(--soft-teal)]" />
                  </div>
                  <h3 className="mb-4 text-2xl text-[var(--deep-plum)] sm:text-3xl">{section.title}</h3>
                  <p className="text-base leading-relaxed text-[var(--muted-mauve)] sm:text-lg">{section.description}</p>
                </div>
              </>
            )}
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <div data-footer-cta className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <h3 className="mb-6 text-3xl text-[var(--deep-plum)] sm:text-4xl">Prepared gently for your family</h3>
        <p className="mb-8 text-base text-[var(--muted-mauve)] sm:text-lg">
          See how MumzMind turns stage signals into a calmer, more practical parent experience.
        </p>
        <motion.button
          className="mumz-primary-button w-full rounded-full px-6 py-3.5 text-white sm:w-auto sm:px-8 sm:py-4"
          whileHover={hoverScale}
          whileTap={tapScale}
          onClick={() => onNavigate("parent")}
        >
          Open the parent experience
        </motion.button>
      </div>
    </div>
  );
}
