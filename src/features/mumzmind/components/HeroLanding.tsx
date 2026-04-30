"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Heart,
  Sparkles,
} from "lucide-react";
import { useCallback, useRef } from "react";

import familiesData from "../data/families.json";
import { type GsapScrollTools, useGsapScroll } from "../hooks/useGsapScroll";
import { useLenis } from "../hooks/useLenis";
import { predictBabyStage } from "../lib/stage-engine";
import type { FamilyProfile } from "../types";
import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";

const HOW_IT_WORKS = [
  {
    title: "Understand the current stage",
    body: "MumzMind reads gentle stage signals from recent essentials.",
    icon: Sparkles,
  },
  {
    title: "See what may help next",
    body: "Parents get simple, practical suggestions for the next chapter.",
    icon: CheckCircle2,
  },
  {
    title: "Stay in control",
    body: "Every baby grows differently. Parents can update the stage anytime.",
    icon: Heart,
  },
];

const JOURNEY_PREVIEW = [
  { label: "Newborn Care", iconName: "newborn" as PremiumBabyIconName },
  { label: "Feeding Routine", iconName: "bottle" as PremiumBabyIconName },
  { label: "Starting Solids", iconName: "spoon" as PremiumBabyIconName },
  { label: "Crawling Prep", iconName: "teddy" as PremiumBabyIconName },
  { label: "First Shoes", iconName: "shoe" as PremiumBabyIconName },
];

const CRM_PREVIEW = [
  { label: "Starting solids soon", value: "12 families" },
  { label: "At-risk families", value: "4 families" },
  { label: "Journeys prepared", value: "18 ready" },
  { label: "Next best action", value: "Gentle reminder" },
];

const DEMO_FEEDBACK = [
  "The next step felt clearer without feeling pushy.",
  "I liked seeing why this stage may be coming.",
  "It felt like a calm guide, not another shopping feed.",
];

function formatWindow(windowText: string): string {
  return windowText.replaceAll("-", "–");
}

export default function HeroLanding({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useLenis(true);
  const families = familiesData as FamilyProfile[];
  const family =
    families.find((entry) => entry.parentName === "Sara" && entry.babyName === "Omar") ??
    families[0];
  const prediction = predictBabyStage(family);
  const essentialsPreview = prediction.recommendedCategories.slice(0, 3);

  const hoverScale = reducedMotion ? undefined : { scale: 1.03 };
  const tapScale = reducedMotion ? undefined : { scale: 0.97 };

  const setupScrollAnimations = useCallback(
    ({ gsap }: GsapScrollTools) => {
      const heroTimeline = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      heroTimeline
        .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 18, duration: 0.5 })
        .from(
          "[data-hero-line]",
          {
            autoAlpha: 0,
            yPercent: 110,
            duration: 0.8,
            stagger: 0.12,
          },
          "-=0.22",
        )
        .from("[data-hero-copy]", { autoAlpha: 0, y: 22, duration: 0.6 }, "-=0.34")
        .from("[data-hero-actions]", { autoAlpha: 0, y: 22, duration: 0.6 }, "-=0.3")
        .from("[data-hero-preview]", { autoAlpha: 0, x: 28, duration: 0.9 }, "-=0.65")
        .from(
          "[data-preview-float]",
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.4,
            stagger: 0.08,
          },
          "-=0.42",
        );

      gsap.utils.toArray<HTMLElement>("[data-scroll-section]").forEach((section) => {
        gsap.from(section, {
          autoAlpha: 0,
          y: 36,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-float-chip]").forEach((chip, index) => {
        gsap.fromTo(
          chip,
          { x: 0, y: 0 },
          {
            x: index % 2 === 0 ? 5 : -5,
            y: index % 2 === 0 ? -8 : 8,
            duration: 4.2 + index * 0.25,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );
      });
    },
    [],
  );

  useGsapScroll(scopeRef, setupScrollAnimations, !reducedMotion);

  return (
    <div ref={scopeRef} className="min-h-screen overflow-x-clip bg-[var(--warm-ivory)]">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 18% 20%, rgba(248,216,213,0.34), transparent 38%)",
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.28, 0.42, 0.28],
                  scale: [1, 1.08, 1],
                }
          }
          transition={reducedMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 82% 72%, rgba(243,230,220,0.75), transparent 34%)",
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0.24, 0.38, 0.24],
                  scale: [1.08, 1, 1.08],
                }
          }
          transition={reducedMotion ? undefined : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <section className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div>
            <div
              data-hero-eyebrow
              className="mumz-badge mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-[var(--rose)]" />
              <span className="text-sm text-[var(--muted-mauve)]">
                Baby-stage guidance for growing families
              </span>
            </div>

            <h1 className="overflow-hidden text-[2.9rem] leading-[1.02] text-[var(--deep-plum)] sm:text-[4rem] lg:text-[4.85rem]">
              <span data-hero-line className="block overflow-hidden">
                Your baby&rsquo;s next chapter,
              </span>
              <span data-hero-line className="block overflow-hidden">
                prepared with care.
              </span>
            </h1>

            <p
              data-hero-copy
              className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-mauve)] sm:text-lg"
            >
              MumzMind helps parents feel ready for each new stage from feeding changes to first steps with gentle guidance and helpful essentials.
            </p>

            <div data-hero-actions className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <motion.button
                type="button"
                className="mumz-primary-button rounded-full px-6 py-3.5 text-white"
                whileHover={hoverScale}
                whileTap={tapScale}
                onClick={() => onNavigate("parent")}
              >
                View Omar&rsquo;s journey
              </motion.button>
              <motion.button
                type="button"
                className="mumz-secondary-button rounded-full px-6 py-3.5 text-[var(--deep-plum)]"
                whileHover={hoverScale}
                whileTap={tapScale}
                onClick={() => onNavigate("crm")}
              >
                See CRM view
              </motion.button>
            </div>
          </div>

          <div data-hero-preview className="relative">
            <motion.div
              className="mumz-card relative overflow-hidden rounded-[2.3rem] p-6 sm:p-8"
              whileHover={reducedMotion ? undefined : { y: -4 }}
            >
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(248,216,213,0.55),transparent_66%)]" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(243,230,220,0.86),transparent_68%)]" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(248,216,213,0.5)] px-4 py-2 text-sm text-[var(--deep-berry)]">
                  <Sparkles className="h-4 w-4" />
                  <span>Product preview</span>
                </div>

                <h2 className="mt-5 text-[1.9rem] leading-[1.08] text-[var(--deep-plum)] sm:text-[2.2rem]">
                  {family.babyName} may be ready for solids soon
                </h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] bg-[rgba(255,251,247,0.94)] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Current</p>
                    <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.currentStage}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-[rgba(255,251,247,0.94)] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Next</p>
                    <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.nextStage}</p>
                  </div>
                  <div className="rounded-[1.4rem] bg-[rgba(255,251,247,0.94)] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Window</p>
                    <p className="mt-1 text-sm text-[var(--deep-plum)]">{formatWindow(prediction.nextStageWindow)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-[var(--muted-mauve)]">Helpful essentials</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {essentialsPreview.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[rgba(255,251,247,0.94)] px-4 py-2 text-sm text-[var(--deep-plum)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div
              data-preview-float
              data-float-chip
              className="absolute -left-2 top-6 rounded-[1.3rem] border border-[rgba(42,18,18,0.07)] bg-white/90 px-4 py-3 shadow-[0_14px_28px_rgba(42,18,18,0.05)] sm:-left-10"
            >
              <p className="text-xs text-[var(--muted-mauve)]">Parent view</p>
              <p className="mt-1 text-sm text-[var(--deep-plum)]">Prepared gently</p>
            </div>

            <div
              data-preview-float
              data-float-chip
              className="absolute -bottom-3 right-3 rounded-[1.3rem] border border-[rgba(42,18,18,0.07)] bg-white/90 px-4 py-3 shadow-[0_14px_28px_rgba(42,18,18,0.05)]"
            >
              <p className="text-xs text-[var(--muted-mauve)]">Next chapter</p>
              <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.nextStage}</p>
            </div>
          </div>
        </section>

        <section data-scroll-section className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[2rem] text-[var(--deep-plum)] sm:text-[2.5rem]">
              A calmer way to prepare for each stage
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <motion.article
                key={item.title}
                className="mumz-card-soft rounded-[1.9rem] p-6 sm:p-7"
                whileHover={reducedMotion ? undefined : { y: -3 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[rgba(248,216,213,0.58)]">
                  <item.icon className="h-5 w-5 text-[var(--deep-berry)]" />
                </div>
                <h3 className="mt-5 text-[1.3rem] text-[var(--deep-plum)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)] sm:text-base">
                  {item.body}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        <section data-scroll-section className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[2rem] text-[var(--deep-plum)] sm:text-[2.5rem]">
              From newborn care to first steps
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {JOURNEY_PREVIEW.map((milestone, index) => (
              <div key={milestone.label} className="flex items-center gap-3 md:block">
                <motion.article
                  className="mumz-card-soft flex flex-1 items-center gap-4 rounded-[1.7rem] p-4 md:min-h-[12rem] md:flex-col md:justify-center md:text-center"
                  whileHover={reducedMotion ? undefined : { y: -3 }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[rgba(255,251,247,0.94)] shadow-[0_10px_20px_rgba(42,18,18,0.04)]">
                    <PremiumBabyIcon name={milestone.iconName} className="h-8 w-8" />
                  </div>
                  <p className="text-sm text-[var(--deep-plum)]">{milestone.label}</p>
                </motion.article>
                {index < JOURNEY_PREVIEW.length - 1 ? (
                  <ArrowRight className="hidden h-4 w-4 text-[var(--muted-mauve)] md:block" />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-24 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section data-scroll-section>
            <div className="mb-6">
              <h2 className="text-[2rem] text-[var(--deep-plum)] sm:text-[2.35rem]">
                Designed for busy parents
              </h2>
            </div>

            <motion.article
              className="mumz-card rounded-[2rem] p-6 sm:p-7"
              whileHover={reducedMotion ? undefined : { y: -4 }}
            >
              <p className="text-sm text-[var(--muted-mauve)]">Good morning, Sara</p>
              <h3 className="mt-2 text-[1.6rem] text-[var(--deep-plum)]">Omar&rsquo;s next chapter is ready</h3>
              <div className="mt-5 rounded-[1.5rem] bg-[rgba(255,251,247,0.92)] px-5 py-5">
                <p className="text-sm text-[var(--muted-mauve)]">Your baby&rsquo;s next chapter</p>
                <p className="mt-2 text-lg text-[var(--deep-plum)]">
                  {family.babyName} may be ready for solids soon
                </p>
                <motion.button
                  type="button"
                  className="mumz-primary-button mt-5 rounded-full px-5 py-3 text-white"
                  whileHover={hoverScale}
                  whileTap={tapScale}
                  onClick={() => onNavigate("parent")}
                >
                  View essentials
                </motion.button>
              </div>
            </motion.article>
          </section>

          <section data-scroll-section>
            <div className="mb-6">
              <h2 className="text-[2rem] text-[var(--deep-plum)] sm:text-[2.35rem]">
                A clearer view for the business team
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--muted-mauve)]">
                MumzMind also helps teams understand stage opportunities, prepare journeys, and identify families who may need a gentle reminder.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {CRM_PREVIEW.map((item) => (
                <motion.article
                  key={item.label}
                  className="mumz-card-soft rounded-[1.7rem] p-5"
                  whileHover={reducedMotion ? undefined : { y: -3 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[rgba(243,230,220,0.76)]">
                    <BarChart3 className="h-5 w-5 text-[var(--deep-berry)]" />
                  </div>
                  <p className="mt-4 text-sm text-[var(--muted-mauve)]">{item.label}</p>
                  <p className="mt-2 text-[1.2rem] text-[var(--deep-plum)]">{item.value}</p>
                </motion.article>
              ))}
            </div>
          </section>
        </div>

        <section data-scroll-section className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[2rem] text-[var(--deep-plum)] sm:text-[2.5rem]">
              Made to feel helpful, not overwhelming
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {DEMO_FEEDBACK.map((quote) => (
              <motion.article
                key={quote}
                className="mumz-card-soft rounded-[1.8rem] p-6"
                whileHover={reducedMotion ? undefined : { y: -3 }}
              >
                <p className="text-base leading-relaxed text-[var(--deep-plum)]">&ldquo;{quote}&rdquo;</p>
                <p className="mt-4 text-sm text-[var(--muted-mauve)]">Fictional demo feedback</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section data-scroll-section className="mt-24">
          <div className="mumz-card rounded-[2.2rem] px-6 py-10 text-center sm:px-10 sm:py-12">
            <h2 className="text-[2rem] text-[var(--deep-plum)] sm:text-[2.7rem]">
              Prepare the next chapter with more confidence.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.button
                type="button"
                className="mumz-primary-button rounded-full px-6 py-3.5 text-white"
                whileHover={hoverScale}
                whileTap={tapScale}
                onClick={() => onNavigate("parent")}
              >
                Open Parent Feed
              </motion.button>
              <motion.button
                type="button"
                className="mumz-secondary-button rounded-full px-6 py-3.5 text-[var(--deep-plum)]"
                whileHover={hoverScale}
                whileTap={tapScale}
                onClick={() => onNavigate("timeline")}
              >
                View Timeline
              </motion.button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
