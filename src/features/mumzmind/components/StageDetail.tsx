"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Edit3,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";

import familiesData from "../data/families.json";
import recommendationsData from "../data/recommendations.json";
import { usePageMotion } from "../hooks/usePageMotion";
import { generateJourneyCard } from "../lib/journey-templates";
import { predictBabyStage } from "../lib/stage-engine";
import type { FamilyProfile, StageRecommendation } from "../types";
import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";

type PreparationCard = {
  name: string;
  note: string;
  iconName: PremiumBabyIconName;
};

type CuratedPick = {
  title: string;
  reason: string;
  iconName: PremiumBabyIconName;
};

const PREPARATION_NOTES: Record<string, string> = {
  "Baby cereal": "Gentle first-food starter",
  "Soft spoons": "Easier for tiny mouths",
  Bibs: "Keeps first meals calmer",
  "High chair": "Comfortable feeding setup",
};

const CATEGORY_ICON_MAP: Record<string, PremiumBabyIconName> = {
  "Baby cereal": "cereal",
  "Soft spoons": "spoon",
  Bibs: "bib",
  "High chair": "chair",
  "Sippy cup": "cup",
  "Feeding bottle": "bottle",
  "Crawling toys": "teddy",
  "Play mat": "playmat",
  "Baby-proofing essentials": "safety",
  "First walker shoes": "shoe",
  "Toddler socks": "socks",
  "Outdoor stroller accessories": "stroller",
};

const STARTING_SOLIDS_ORDER = ["Baby cereal", "Soft spoons", "Bibs", "High chair"] as const;

const CURATED_PICKS: CuratedPick[] = [
  {
    title: "First Foods Prep Kit",
    reason: "Helpful for first feeding",
    iconName: "cereal",
  },
  {
    title: "Soft Spoon & Bowl Set",
    reason: "Easy to clean",
    iconName: "spoon",
  },
  {
    title: "Silicone Bib Set",
    reason: "Parent-loved starter item",
    iconName: "bib",
  },
];

function getWarmSignalLabel(confidence: number): string {
  if (confidence >= 80) {
    return "Strong signal";
  }

  if (confidence >= 65) {
    return "Steady signal";
  }

  return "Gentle signal";
}

function formatWindow(windowText: string): string {
  return windowText.replaceAll("-", "–");
}

function buildPreparationCards(categories: string[]): PreparationCard[] {
  const normalizedCategorySet = new Set(categories.map((category) => category.toLowerCase()));
  const prioritized = STARTING_SOLIDS_ORDER.filter((category) =>
    normalizedCategorySet.has(category.toLowerCase()),
  );
  const fallback = categories.filter(
    (category) => !prioritized.includes(category as (typeof STARTING_SOLIDS_ORDER)[number]),
  );

  return [...prioritized, ...fallback].slice(0, 4).map((name) => ({
    name,
    note: PREPARATION_NOTES[name] ?? "A helpful essential for this stage",
    iconName: CATEGORY_ICON_MAP[name] ?? "newborn",
  }));
}

export default function StageDetail({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const motionConfig = usePageMotion();
  const [actionMessage, setActionMessage] = useState("");
  const [savedPickTitles, setSavedPickTitles] = useState<string[]>([]);
  const prepareRef = useRef<HTMLElement | null>(null);

  const families = familiesData as FamilyProfile[];
  const recommendations = recommendationsData as StageRecommendation[];
  const family =
    families.find((entry) => entry.parentName === "Sara" && entry.babyName === "Omar") ??
    families[0];
  const prediction = predictBabyStage(family);
  const recommendation =
    recommendations.find((entry) => entry.stage === prediction.nextStage) ??
    recommendations.find((entry) => entry.stage === family.nextStage);
  const journeyCard = generateJourneyCard({
    babyName: family.babyName,
    stage: prediction.nextStage,
    tone: "gentle",
  });

  const displayWindow = formatWindow(prediction.nextStageWindow);
  const signalLabel = getWarmSignalLabel(prediction.confidence);
  const recommendedCategories =
    prediction.nextStage === "Starting Solids"
      ? [...STARTING_SOLIDS_ORDER]
      : recommendation?.recommendedCategories.map((category) =>
          category
            .split(" ")
            .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
            .join(" "),
        ) ?? prediction.recommendedCategories;
  const preparationCards = buildPreparationCards(recommendedCategories);
  const explanationSignals = prediction.explanationSignals.slice(0, 3);

  function handlePrototypeAction(message: string) {
    setActionMessage(message);
  }

  function scrollToPrepareSection() {
    prepareRef.current?.scrollIntoView({
      behavior: motionConfig.prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function toggleSavedPick(title: string) {
    setSavedPickTitles((current) => {
      const exists = current.includes(title);
      const next = exists ? current.filter((entry) => entry !== title) : [...current, title];

      setActionMessage(
        exists
          ? `${title} was removed from your shortlist.`
          : `${title} was saved to your shortlist.`,
      );

      return next;
    });
  }

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

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          {...motionConfig.getReveal({ direction: "down", duration: 0.55 })}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[rgba(248,216,213,0.55)] px-4 py-2 text-sm text-[var(--deep-berry)]">
            <Sparkles className="h-4 w-4" />
            <span>Next Chapter</span>
          </div>

          <h1 className="text-[2.1rem] text-[var(--deep-plum)] sm:text-[2.8rem]">
            {prediction.nextStage}
          </h1>
          <p className="mt-3 text-base text-[var(--muted-mauve)] sm:text-lg">
            Likely in the next {displayWindow} for {family.babyName}.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              family.babyName,
              `${prediction.predictedAgeMonths} months`,
              signalLabel,
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[rgba(42,18,18,0.08)] bg-white/88 px-4 py-2 text-sm text-[var(--deep-plum)] shadow-[0_10px_24px_rgba(42,18,18,0.04)]"
              >
                {chip}
              </span>
            ))}
          </div>

          {actionMessage ? (
            <p
              className="mt-5 inline-flex rounded-full border border-[rgba(42,18,18,0.08)] bg-white/90 px-4 py-2 text-sm text-[var(--muted-mauve)] shadow-[0_12px_26px_rgba(42,18,18,0.04)]"
              role="status"
              aria-live="polite"
            >
              {actionMessage}
            </p>
          ) : null}
        </motion.div>

        <motion.section
          className="mumz-card mt-10 overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10"
          {...motionConfig.getReveal({ delay: 0.12, duration: 0.55 })}
        >
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div className="flex flex-col justify-center">
              <h2 className="text-[2rem] leading-[1.08] text-[var(--deep-plum)] sm:text-[2.45rem]">
                A calm start to solids
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted-mauve)] sm:text-lg">
                Starting solids can feel like a big step. A few simple essentials can make the first week calmer and easier.
              </p>

              <div className="mt-7">
                <motion.button
                  type="button"
                  className="mumz-primary-button rounded-full px-6 py-3.5 text-white"
                  whileHover={motionConfig.buttonHoverStrong}
                  whileTap={motionConfig.gentleTap}
                  onClick={scrollToPrepareSection}
                >
                  See what may help
                </motion.button>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-[rgba(42,18,18,0.08)] bg-[rgba(255,251,247,0.92)] px-4 py-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Current</p>
                    <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.currentStage}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Next</p>
                    <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.nextStage}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Window</p>
                    <p className="mt-1 text-sm text-[var(--deep-plum)]">{displayWindow}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[rgba(42,18,18,0.08)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(243,230,220,0.82))] p-5 shadow-[0_18px_36px_rgba(42,18,18,0.04)] sm:p-6">
              <div className="flex h-full min-h-[18rem] flex-col justify-between rounded-[1.7rem] border border-[rgba(42,18,18,0.06)] bg-[rgba(255,255,255,0.72)] p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[rgba(248,216,213,0.55)] px-3 py-1 text-xs text-[var(--deep-berry)]">
                    Stage Overview
                  </span>
                  <span className="text-xs text-[var(--muted-mauve)]">{signalLabel}</span>
                </div>

                <div className="flex flex-1 items-center justify-center py-4">
                  <div className="relative flex h-48 w-full max-w-[18rem] items-center justify-center rounded-[1.8rem] overflow-hidden shadow-[0_16px_28px_rgba(42,18,18,0.08)]">
                    <img src="/images/premium_chair.png" alt="high chair" className="h-full w-full object-cover" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] bg-[rgba(255,251,247,0.88)] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Why this matters</p>
                    <p className="mt-2 text-sm text-[var(--deep-plum)]">
                      {recommendation?.message ?? "A few calm essentials can make this next chapter feel easier."}
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] bg-[rgba(255,251,247,0.88)] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Helpful note</p>
                    <p className="mt-2 text-sm text-[var(--deep-plum)]">
                      A little preparation now can make the first few meals feel calmer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={prepareRef}
          className="mt-10"
          {...motionConfig.getReveal({ delay: 0.2, duration: 0.5 })}
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-[1.45rem] text-[var(--deep-plum)]">What to prepare</h3>
              <p className="mt-1 text-[var(--muted-mauve)]">A few gentle essentials for this first week.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {preparationCards.map((item, index) => (
              <motion.article
                key={item.name}
                className="mumz-card-soft rounded-[1.75rem] p-4 sm:p-5 flex flex-col"
                {...motionConfig.getReveal({ delay: 0.24 + index * 0.08, direction: "up", distance: 18, duration: 0.45 })}
                whileHover={motionConfig.cardHoverSoft}
              >
                <div className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] shadow-sm">
                  <PremiumBabyIcon name={item.iconName} className="h-full w-full object-cover" />
                </div>
                <h4 className="text-lg text-[var(--deep-plum)] px-1">{item.name}</h4>
                <p className="mt-1 text-sm text-[var(--muted-mauve)] px-1">{item.note}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <motion.section
            className="rounded-[2rem] border border-[rgba(42,18,18,0.08)] bg-[linear-gradient(180deg,rgba(255,251,247,0.98),rgba(248,216,213,0.26))] p-6 shadow-[0_18px_38px_rgba(42,18,18,0.05)] sm:p-7"
            {...motionConfig.getReveal({ delay: 0.3, duration: 0.5 })}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-white/82">
                <PremiumBabyIcon name="spoon" className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-[1.35rem] text-[var(--deep-plum)]">Curated picks</h3>
                <p className="text-sm text-[var(--muted-mauve)]">A few parent-loved starters for this chapter.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {CURATED_PICKS.map((pick, index) => {
                const isSaved = savedPickTitles.includes(pick.title);

                return (
                  <motion.article
                    key={pick.title}
                    className="rounded-[1.5rem] border border-[rgba(42,18,18,0.08)] bg-white/86 p-4 flex flex-col"
                    {...motionConfig.getReveal({ delay: 0.34 + index * 0.08, direction: "left", distance: 16, duration: 0.4 })}
                    whileHover={motionConfig.cardHoverSoft}
                  >
                    <div className="mb-4 aspect-square w-full overflow-hidden rounded-[1rem] shadow-sm">
                      <PremiumBabyIcon name={pick.iconName} className="h-full w-full object-cover" />
                    </div>
                    <h4 className="text-base text-[var(--deep-plum)] px-1">{pick.title}</h4>
                    <p className="mt-2 text-sm text-[var(--muted-mauve)] px-1">{pick.reason}</p>
                    <motion.button
                      type="button"
                      className="mt-4 text-sm text-[var(--deep-berry)] underline decoration-[rgba(143,16,37,0.24)] underline-offset-4"
                      whileHover={motionConfig.buttonHover}
                      whileTap={motionConfig.gentleTap}
                      onClick={() => toggleSavedPick(pick.title)}
                    >
                      {isSaved ? "Saved to shortlist" : "Save to shortlist"}
                    </motion.button>
                  </motion.article>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.34, duration: 0.5 })}
            whileHover={motionConfig.cardHoverSoft}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[rgba(221,239,229,0.84)]">
              <BookOpen className="h-5 w-5 text-[var(--soft-espresso)]" />
            </div>
            <h3 className="mt-5 text-[1.35rem] text-[var(--deep-plum)]">First foods checklist</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)] sm:text-base">
              A simple guide to help prepare for the first week of solids.
            </p>
            <div className="mt-5 space-y-3">
              {explanationSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-[1.2rem] bg-[rgba(255,251,247,0.92)] px-4 py-3 text-sm text-[var(--muted-mauve)]"
                >
                  {signal}
                </div>
              ))}
            </div>
            <motion.button
              type="button"
              className="mumz-secondary-button mt-6 rounded-full px-5 py-3 text-[var(--deep-plum)]"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
              onClick={() => handlePrototypeAction("The checklist is still a local prototype action in this demo.")}
            >
              View the checklist
            </motion.button>
          </motion.section>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <motion.section
            className="rounded-[2rem] border border-[rgba(42,18,18,0.08)] bg-[linear-gradient(180deg,rgba(255,250,248,0.98),rgba(248,216,213,0.22))] p-6 shadow-[0_18px_38px_rgba(42,18,18,0.05)] sm:p-7"
            {...motionConfig.getReveal({ delay: 0.4, duration: 0.5 })}
          >
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/82">
                <Sparkles className="h-5 w-5 text-[var(--deep-berry)]" />
              </div>
              <div>
                <h3 className="text-[1.35rem] text-[var(--deep-plum)]">Journey message</h3>
                <p className="mt-1 text-sm text-[var(--muted-mauve)]">A warm message prepared for this next chapter.</p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-[rgba(42,18,18,0.08)] bg-white/88 p-5 sm:p-6">
              <p className="text-lg text-[var(--deep-plum)]">{journeyCard.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)] sm:text-base">
                {journeyCard.body}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {journeyCard.recommendedCategories.slice(0, 4).map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-[rgba(255,251,247,0.92)] px-3 py-1 text-xs text-[var(--deep-plum)]"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <motion.button
                type="button"
                className="mumz-primary-button mt-6 rounded-full px-6 py-3.5 text-white"
                whileHover={motionConfig.buttonHoverStrong}
                whileTap={motionConfig.gentleTap}
                onClick={() => handlePrototypeAction("This preparation flow is still a prototype in this demo.")}
              >
                Prepare for this stage
              </motion.button>
            </div>
          </motion.section>

          <motion.section
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.44, duration: 0.5 })}
            whileHover={motionConfig.cardHoverSoft}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[rgba(248,216,213,0.58)]">
              <Edit3 className="h-5 w-5 text-[var(--deep-berry)]" />
            </div>
            <h3 className="mt-5 text-[1.35rem] text-[var(--deep-plum)]">Every baby grows differently</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)] sm:text-base">
              If this does not feel right for {family.babyName}, you can update the stage anytime.
            </p>
            <motion.button
              type="button"
              className="mumz-secondary-button mt-6 rounded-full px-5 py-3 text-[var(--deep-plum)]"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
              onClick={() => handlePrototypeAction("Editing the baby stage is still a prototype action in this demo.")}
            >
              Edit baby stage
            </motion.button>
          </motion.section>
        </div>

        <motion.div
          className="mt-8 flex justify-start"
          {...motionConfig.getReveal({ delay: 0.48, duration: 0.45 })}
        >
          <motion.button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-[var(--deep-berry)]"
            whileHover={motionConfig.buttonHover}
            whileTap={motionConfig.gentleTap}
            onClick={() => onNavigate("parent")}
          >
            Return to the parent feed
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
