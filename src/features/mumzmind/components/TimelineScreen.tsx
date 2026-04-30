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
    imageSrc: "/mumzmind/timeline/baby_stage_0.png",
    imageAlt: "Cartoon illustration of a newborn",
    iconName: "newborn",
  },
  {
    month: 2,
    title: "Early Smiles",
    description: "Smiling more and discovering familiar faces.",
    placeholderLabel: "2-month image",
    imageSrc: "/mumzmind/timeline/baby_stage_2.png",
    imageAlt: "Cartoon illustration of a two month baby",
    iconName: "newborn",
  },
  {
    month: 4,
    title: "Rolling & Reaching",
    description: "More movement and reaching for favorite things.",
    placeholderLabel: "4-month image",
    imageSrc: "/mumzmind/timeline/baby_stage_4.png",
    imageAlt: "Cartoon illustration of a rolling four month baby",
    iconName: "playmat",
  },
  {
    month: 6,
    title: "Sitting Up",
    description: "Sitting with support and showing more personality.",
    placeholderLabel: "6-month image",
    imageSrc: "/mumzmind/timeline/baby_stage_6.png",
    imageAlt: "Cartoon illustration of a six month baby sitting",
    iconName: "chair",
  },
  {
    month: 8,
    title: "Crawling & Exploring",
    description: "Getting curious and exploring the world around them.",
    placeholderLabel: "8-month image",
    imageSrc: "/mumzmind/timeline/baby_stage_8.png",
    imageAlt: "Cartoon illustration of a crawling eight month baby",
    iconName: "teddy",
  },
  {
    month: 12,
    title: "First Steps",
    description: "Walking with support and celebrating big milestones.",
    placeholderLabel: "12-month image",
    imageSrc: "/mumzmind/timeline/baby_stage_12.png",
    imageAlt: "Cartoon illustration of a twelve month baby taking steps",
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
    families.find((entry) => entry.parentName === "Sara" && entry.babyName === "Baby") ??
    families[0];
  
  const [userAge, setUserAge] = useState<number | string>(6);
  
  const prediction = predictBabyStage({
    ...family,
    predictedAgeMonths: typeof userAge === 'number' ? userAge : 0
  });

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

          <div className="mt-8 inline-flex items-center gap-4 rounded-[2rem] bg-white/60 p-2 pl-6 shadow-sm ring-1 ring-[rgba(42,18,18,0.05)] backdrop-blur-sm">
            <span className="text-sm font-medium text-[var(--deep-plum)]">Personalize your journey:</span>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={userAge}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserAge(val === '' ? '' : parseInt(val));
                }}
                className="w-16 rounded-xl border-none bg-white px-3 py-2 text-center text-sm font-bold text-[var(--deep-berry)] shadow-inner ring-1 ring-[rgba(201,47,75,0.1)] focus:ring-2 focus:ring-[var(--deep-berry)]"
                min="0"
                max="24"
              />
              <span className="text-sm text-[var(--muted-mauve)] font-medium">months old</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-[var(--muted-mauve)] italic">
            Enter your baby's exact age for personalized recommendations and exclusive stage-based offers.
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

                      <div className="mt-5 h-[5rem] px-2 relative w-full flex items-end justify-center">
                        {isActive ? (
                          <div className="absolute bottom-1 w-[max-content] max-w-[160px] rounded-[1.3rem] border border-[rgba(201,47,75,0.12)] bg-white/92 px-4 py-2.5 shadow-[0_12px_28px_rgba(42,18,18,0.04)] z-20">
                            <p className="text-sm text-[var(--deep-plum)] leading-tight">
                              {family.babyName} may be nearing<br />
                              <span className="font-semibold text-[var(--deep-berry)]">{prediction.nextStage}</span>
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <div className="relative mt-2 flex w-full items-center justify-center px-2 py-4">
                        {/* Connecting Line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-[rgba(42,18,18,0.04)]">
                           {(isPast || isActive) && (
                             <div 
                               className={`h-full bg-[linear-gradient(90deg,#E6C5C3,#C92F4B)] transition-all duration-700 ${isActive ? 'w-1/2' : 'w-full'} ${index === 0 ? 'rounded-l-full' : ''}`}
                             />
                           )}
                        </div>
                        
                        {/* The Node */}
                        <div className="relative z-10">
                          {isActive && (
                            <>
                              <div className="absolute inset-0 rounded-full bg-[var(--deep-berry)] blur-[10px] opacity-30 animate-[pulse_2s_ease-in-out_infinite]" />
                              <div className="absolute -inset-3 rounded-full border border-[var(--deep-berry)] opacity-20 animate-[ping_3s_ease-in-out_infinite]" />
                            </>
                          )}
                          <div
                            className={`relative flex items-center justify-center rounded-full text-[15px] font-semibold transition-all duration-500 z-10 ${
                              isActive
                                ? "h-14 w-14 border-[3px] border-[var(--deep-berry)] bg-white text-[var(--deep-berry)] shadow-[0_0_15px_rgba(201,47,75,0.3)] scale-110"
                                : isPast
                                  ? "h-12 w-12 border-2 border-white bg-[linear-gradient(135deg,var(--blush-pink),#DDA7A5)] text-white shadow-md"
                                  : "h-12 w-12 border-2 border-white bg-[rgba(243,230,220,0.5)] text-[var(--muted-mauve)] shadow-sm"
                            }`}
                          >
                            {milestone.month}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 px-2">
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
          className="mt-12 max-w-2xl mx-auto text-center"
          {...motionConfig.getReveal({ delay: 0.36, duration: 0.45 })}
        >
          <div className="mb-6 rounded-[1.5rem] bg-[rgba(248,216,213,0.15)] p-4 border border-[rgba(201,47,75,0.1)]">
            <p className="text-[12px] text-[var(--deep-berry)] font-medium leading-relaxed italic">
              Disclaimer: This is a demonstration of the MumzMind concept. While we map products to developmental stages, no live AI model is currently processing this data. Predictions are based on simplified logic and may be incorrect.
            </p>
          </div>
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
