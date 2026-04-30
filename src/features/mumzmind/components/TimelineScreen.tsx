"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

import familiesData from "../data/families.json";
import stagesData from "../data/stages.json";
import { usePageMotion } from "../hooks/usePageMotion";
import { predictBabyStage } from "../lib/stage-engine";
import type { BabyStage, FamilyProfile } from "../types";
import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";

type Milestone = {
  month: number;
  title: string;
  description: string;
  placeholderLabel: string;
  imageSrc: string;
  imageAlt: string;
  iconName: PremiumBabyIconName;
};

const FIRST_YEAR_MILESTONES: Milestone[] = [
  {
    month: 0,
    title: "Newborn",
    description: "Getting to know the world with comfort and care.",
    placeholderLabel: "Newborn image",
    imageSrc: "/mumzmind/timeline/newborn.jpg",
    imageAlt: "Soft newborn care scene",
    iconName: "newborn",
  },
  {
    month: 2,
    title: "Early Smiles",
    description: "Smiling more and discovering familiar faces.",
    placeholderLabel: "2-month image",
    imageSrc: "/mumzmind/timeline/two-months.jpg",
    imageAlt: "Two-month baby milestone scene",
    iconName: "newborn",
  },
  {
    month: 4,
    title: "Rolling & Reaching",
    description: "More movement and reaching for favorite things.",
    placeholderLabel: "4-month image",
    imageSrc: "/mumzmind/timeline/four-months.jpg",
    imageAlt: "Four-month rolling and reaching milestone scene",
    iconName: "playmat",
  },
  {
    month: 6,
    title: "Sitting Up",
    description: "Sitting with support and showing more personality.",
    placeholderLabel: "6-month image",
    imageSrc: "/mumzmind/timeline/six-months.jpg",
    imageAlt: "Six-month sitting up and starting solids milestone scene",
    iconName: "chair",
  },
  {
    month: 8,
    title: "Crawling & Exploring",
    description: "Getting curious and exploring the world around them.",
    placeholderLabel: "8-month image",
    imageSrc: "/mumzmind/timeline/eight-months.jpg",
    imageAlt: "Eight-month crawling and exploring milestone scene",
    iconName: "teddy",
  },
  {
    month: 12,
    title: "First Steps",
    description: "Walking with support and celebrating big milestones.",
    placeholderLabel: "12-month image",
    imageSrc: "/mumzmind/timeline/twelve-months.jpg",
    imageAlt: "Twelve-month first steps milestone scene",
    iconName: "shoe",
  },
];

function formatWindow(windowText: string): string {
  return windowText.replaceAll("-", "–");
}

function getNearestMilestoneIndex(ageMonths: number): number {
  return FIRST_YEAR_MILESTONES.reduce((bestIndex, milestone, index) => {
    const bestDistance = Math.abs(FIRST_YEAR_MILESTONES[bestIndex].month - ageMonths);
    const nextDistance = Math.abs(milestone.month - ageMonths);
    return nextDistance < bestDistance ? index : bestIndex;
  }, 0);
}

export default function TimelineScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const motionConfig = usePageMotion();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const families = familiesData as FamilyProfile[];
  const stageCatalog = stagesData as BabyStage[];
  const family =
    families.find((entry) => entry.parentName === "Sara" && entry.babyName === "Omar") ??
    families[0];
  const prediction = predictBabyStage(family);
  const activeMilestoneIndex = getNearestMilestoneIndex(prediction.predictedAgeMonths);
  const activeMilestone = FIRST_YEAR_MILESTONES[activeMilestoneIndex];
  const currentStageInfo =
    stageCatalog.find((stage) => stage.name === prediction.currentStage) ??
    stageCatalog.find((stage) => stage.name === prediction.nextStage);

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--warm-ivory)]">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <motion.div
          className="absolute left-0 top-0 h-80 w-80 rounded-full sm:h-[30rem] sm:w-[30rem]"
          style={{ background: "radial-gradient(circle, rgba(248,216,213,0.46), transparent 64%)" }}
          animate={motionConfig.floatAmbient}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-72 w-72 rounded-full sm:h-[26rem] sm:w-[26rem]"
          style={{ background: "radial-gradient(circle, rgba(243,230,220,0.72), transparent 62%)" }}
          animate={motionConfig.floatAmbient}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 14, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <motion.section
          className="mx-auto max-w-3xl text-center"
          {...motionConfig.getReveal({ direction: "down", duration: 0.55 })}
        >
          <h1 className="text-[2.2rem] text-[var(--deep-plum)] sm:text-[2.95rem]">
            {family.babyName}&rsquo;s First Year
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--muted-mauve)] sm:text-lg">
            A beautiful journey of growth, discovery and endless firsts.
          </p>
        </motion.section>

        <motion.section
          className="mt-10 rounded-[2rem] border border-[rgba(42,18,18,0.07)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,251,247,0.95))] px-5 py-8 shadow-[0_18px_44px_rgba(42,18,18,0.05)] sm:px-8 sm:py-10"
          {...motionConfig.getReveal({ delay: 0.12, duration: 0.55 })}
        >
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-6 gap-5">
                {FIRST_YEAR_MILESTONES.map((milestone, index) => {
                  const isActive = index === activeMilestoneIndex;
                  const isPast = milestone.month < activeMilestone.month;
                  const showFallback = imageErrors[milestone.month] ?? false;

                  return (
                    <motion.article
                      key={milestone.month}
                      className="flex flex-col items-center text-center"
                      {...motionConfig.getReveal({ delay: 0.16 + index * 0.06, direction: "up", distance: 18, duration: 0.45 })}
                    >
                      <div
                        className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border px-4 py-4 shadow-[0_14px_32px_rgba(42,18,18,0.05)] ${
                          isActive
                            ? "border-[rgba(201,47,75,0.16)] bg-[linear-gradient(180deg,rgba(248,216,213,0.52),rgba(255,251,247,0.98))]"
                            : "border-[rgba(42,18,18,0.07)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(243,230,220,0.72))]"
                        }`}
                      >
                        {showFallback ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-white/84 shadow-[0_10px_20px_rgba(42,18,18,0.04)]">
                              <PremiumBabyIcon name={milestone.iconName} className="h-8 w-8" />
                            </div>
                            <span className="text-xs text-[var(--muted-mauve)]">{milestone.placeholderLabel}</span>
                          </div>
                        ) : (
                          <Image
                            src={milestone.imageSrc}
                            alt={milestone.imageAlt}
                            fill
                            sizes="128px"
                            className="object-cover"
                            onError={() =>
                              setImageErrors((current) => ({
                                ...current,
                                [milestone.month]: true,
                              }))
                            }
                          />
                        )}
                      </div>

                      <div className="mt-5 min-h-[4.5rem] px-2">
                        {isActive ? (
                          <div className="rounded-[1.3rem] border border-[rgba(201,47,75,0.12)] bg-white/92 px-4 py-3 shadow-[0_12px_28px_rgba(42,18,18,0.04)]">
                            <p className="text-sm text-[var(--deep-plum)]">
                              {family.babyName} may be nearing {prediction.nextStage}
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <div className="relative mt-1 flex w-full items-center justify-center px-2">
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-[rgba(42,18,18,0.12)]" />
                        <div
                          className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border text-sm shadow-[0_10px_20px_rgba(42,18,18,0.04)] ${
                            isActive
                              ? "h-14 w-14 border-[rgba(143,16,37,0.18)] bg-[linear-gradient(180deg,rgba(201,47,75,0.98),rgba(143,16,37,0.96))] text-white ring-[10px] ring-[rgba(248,216,213,0.5)] shadow-[0_0_0_1px_rgba(255,255,255,0.72),0_0_0_16px_rgba(248,216,213,0.24),0_18px_34px_rgba(143,16,37,0.16),0_0_34px_rgba(201,47,75,0.14)]"
                              : isPast
                                ? "border-[rgba(42,18,18,0.09)] bg-white text-[var(--deep-plum)]"
                                : "border-[rgba(42,18,18,0.08)] bg-[rgba(255,251,247,0.98)] text-[var(--deep-plum)]"
                          }`}
                        >
                          {milestone.month}
                        </div>
                      </div>

                      <div className="mt-6 px-2">
                        <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted-mauve)]">
                          {milestone.month} month
                        </p>
                        <h3 className="mt-3 text-[1.05rem] text-[var(--deep-plum)]">{milestone.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)]">
                          {milestone.description}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <motion.section
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.22, duration: 0.5 })}
            whileHover={motionConfig.cardHoverSoft}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[rgba(248,216,213,0.58)]">
                <Sparkles className="h-5 w-5 text-[var(--deep-berry)]" />
              </div>
              <div>
                <h3 className="text-[1.35rem] text-[var(--deep-plum)]">Current stage context</h3>
                <p className="text-sm text-[var(--muted-mauve)]">
                  A gentle view of what may come next.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.35rem] bg-[rgba(255,251,247,0.92)] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Current</p>
                <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.currentStage}</p>
              </div>
              <div className="rounded-[1.35rem] bg-[rgba(255,251,247,0.92)] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Next</p>
                <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.nextStage}</p>
              </div>
              <div className="rounded-[1.35rem] bg-[rgba(255,251,247,0.92)] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Window</p>
                <p className="mt-1 text-sm text-[var(--deep-plum)]">{formatWindow(prediction.nextStageWindow)}</p>
              </div>
            </div>

            {currentStageInfo ? (
              <div className="mt-5 rounded-[1.35rem] bg-[rgba(243,230,220,0.62)] px-4 py-4">
                <p className="text-sm leading-relaxed text-[var(--muted-mauve)]">
                  {currentStageInfo.parentMessage}
                </p>
              </div>
            ) : null}

            <motion.button
              type="button"
              className="mumz-primary-button mt-6 rounded-full px-6 py-3.5 text-white"
              whileHover={motionConfig.buttonHoverStrong}
              whileTap={motionConfig.gentleTap}
              onClick={() => onNavigate("stage")}
            >
              See the next chapter
            </motion.button>
          </motion.section>

          <motion.section
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.28, duration: 0.5 })}
            whileHover={motionConfig.cardHoverSoft}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[rgba(221,239,229,0.84)]">
                <Sparkles className="h-5 w-5 text-[var(--soft-espresso)]" />
              </div>
              <div>
                <h3 className="text-[1.35rem] text-[var(--deep-plum)]">Why this may be the right time</h3>
                <p className="text-sm text-[var(--muted-mauve)]">
                  A few gentle signals from {family.babyName}&rsquo;s recent journey.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {prediction.explanationSignals.slice(0, 3).map((reason, index) => (
                <motion.div
                  key={reason}
                  className="rounded-[1.3rem] bg-[rgba(255,251,247,0.92)] px-4 py-4"
                  {...motionConfig.getReveal({ delay: 0.34 + index * 0.08, direction: "left", distance: 14, duration: 0.4 })}
                >
                  <p className="text-sm leading-relaxed text-[var(--muted-mauve)]">{reason}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.div
          className="mt-10 text-center"
          {...motionConfig.getReveal({ delay: 0.36, duration: 0.45 })}
        >
          <p className="text-base text-[var(--muted-mauve)]">
            Every baby grows at their own pace. Celebrate every little milestone.
          </p>
          <motion.button
            type="button"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--deep-berry)]"
            whileHover={motionConfig.buttonHover}
            whileTap={motionConfig.gentleTap}
            onClick={() => onNavigate("parent")}
          >
            Back to the parent feed
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
