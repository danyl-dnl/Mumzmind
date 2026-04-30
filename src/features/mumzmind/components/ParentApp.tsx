"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Edit3,
  Sparkles,
  User,
} from "lucide-react";
import { useRef, useState, type RefObject } from "react";

import familiesData from "../data/families.json";
import { usePageMotion } from "../hooks/usePageMotion";
import { generateJourneyCard } from "../lib/journey-templates";
import { predictBabyStage } from "../lib/stage-engine";
import type { FamilyProfile } from "../types";
import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";

const ESSENTIAL_ICON_MAP: Record<string, PremiumBabyIconName> = {
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

const ESSENTIAL_NOTES: Record<string, string> = {
  "Baby cereal": "Gentle first-food starter",
  "Soft spoons": "Easier for tiny mouths",
  Bibs: "Keeps first meals calmer",
};

const STAGE_ICON_MAP: Record<string, PremiumBabyIconName> = {
  "Newborn Care": "newborn",
  "Diaper Size 1": "diaper",
  "Diaper Size 2": "diaper",
  "Diaper Size 3": "diaper",
  "Feeding Routine": "bottle",
  "Starting Solids": "spoon",
  "Sitting Support": "chair",
  "Crawling Prep": "teddy",
  "First Shoes": "shoe",
  "Toddler Snacks": "cereal",
};

const LATER_STAGE_SEQUENCE = [
  "Newborn Care",
  "Diaper Size 1",
  "Diaper Size 2",
  "Diaper Size 3",
  "Starting Solids",
  "Crawling Prep",
  "First Shoes",
  "Toddler Snacks",
] as const;

const FALLBACK_SIGNALS = [
  "Recent size 3 diaper purchase",
  "Feeding routine is becoming more frequent",
  "No solids essentials added yet",
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

function getLaterStage(nextStage: string): string {
  const stageIndex = LATER_STAGE_SEQUENCE.indexOf(nextStage as (typeof LATER_STAGE_SEQUENCE)[number]);

  if (stageIndex === -1) {
    return "Crawling Prep";
  }

  return LATER_STAGE_SEQUENCE[Math.min(stageIndex + 1, LATER_STAGE_SEQUENCE.length - 1)];
}

export default function ParentApp({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const motionConfig = usePageMotion();
  const [actionMessage, setActionMessage] = useState("");
  const [prepList, setPrepList] = useState<string[]>([]);
  const essentialsRef = useRef<HTMLElement | null>(null);
  const whyRef = useRef<HTMLElement | null>(null);

  const families = familiesData as FamilyProfile[];
  const family =
    families.find((entry) => entry.parentName === "Sara" && entry.babyName === "Omar") ??
    families[0];
  const prediction = predictBabyStage(family);
  const journeyCard = generateJourneyCard({
    babyName: family.babyName,
    stage: prediction.nextStage,
    tone: "gentle",
  });

  const essentials = prediction.recommendedCategories.slice(0, 3).map((name) => ({
    name,
    iconName: ESSENTIAL_ICON_MAP[name] ?? "newborn",
    note: ESSENTIAL_NOTES[name] ?? "A helpful essential for this chapter",
  }));
  const explanationSignals =
    prediction.explanationSignals.length >= 3
      ? prediction.explanationSignals.slice(0, 3)
      : FALLBACK_SIGNALS;
  const signalLabel = getWarmSignalLabel(prediction.confidence);
  const laterStage = getLaterStage(prediction.nextStage);

  function scrollToSection(sectionRef: RefObject<HTMLElement | null>) {
    sectionRef.current?.scrollIntoView({
      behavior: motionConfig.prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function handlePrototypeAction(message: string) {
    setActionMessage(message);
  }

  function togglePrepItem(itemName: string) {
    setPrepList((current) => {
      const alreadyAdded = current.includes(itemName);
      const next = alreadyAdded
        ? current.filter((entry) => entry !== itemName)
        : [...current, itemName];

      setActionMessage(
        alreadyAdded
          ? `${itemName} was removed from your prep list.`
          : `${itemName} was added to your prep list.`,
      );

      return next;
    });
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--warm-ivory)]">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <motion.div
          className="absolute -right-20 top-0 h-72 w-72 rounded-full sm:h-[28rem] sm:w-[28rem]"
          style={{ background: "radial-gradient(circle, rgba(248,216,213,0.5), transparent 64%)" }}
          animate={motionConfig.floatAmbient}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 11, repeat: Infinity }}
        />
        <motion.div
          className="absolute -left-16 bottom-0 h-64 w-64 rounded-full sm:h-80 sm:w-80"
          style={{ background: "radial-gradient(circle, rgba(243,230,220,0.72), transparent 62%)" }}
          animate={motionConfig.floatAmbient}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 13, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          {...motionConfig.getReveal({ direction: "down", duration: 0.55 })}
        >
          <div>
            <h1 className="text-[2rem] text-[var(--deep-plum)] sm:text-[2.3rem]">
              Good morning, {family.parentName}
            </h1>
            <p className="mt-2 text-base text-[var(--muted-mauve)] sm:text-lg">
              {family.babyName}&rsquo;s next chapter is ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[rgba(42,18,18,0.08)] bg-white/88 px-4 py-3 text-sm shadow-[0_12px_28px_rgba(42,18,18,0.05)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(201,47,75,0.12)]">
                <PremiumBabyIcon name="newborn" className="h-5 w-5" />
              </div>
              <span className="text-[var(--deep-plum)]">{family.babyName}</span>
              <span className="text-[var(--muted-mauve)]">&middot;</span>
              <span className="text-[var(--muted-mauve)]">{prediction.predictedAgeMonths} months</span>
              <span className="text-[var(--muted-mauve)]">&middot;</span>
              <span className="rounded-full bg-[rgba(221,239,229,0.86)] px-3 py-1 text-[var(--soft-espresso)]">
                {signalLabel}
              </span>
            </div>

            <motion.button
              type="button"
              aria-label="Open parent profile"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(42,18,18,0.08)] bg-white/88 shadow-[0_12px_28px_rgba(42,18,18,0.05)]"
              whileHover={motionConfig.iconButtonHover}
              whileTap={motionConfig.iconTap}
              onClick={() => handlePrototypeAction("Profile tools are still a prototype in this demo.")}
            >
              <User className="h-5 w-5 text-[var(--deep-plum)]" />
            </motion.button>
          </div>
        </motion.div>

        {actionMessage ? (
          <motion.p
            className="mb-6 inline-flex rounded-full border border-[rgba(42,18,18,0.08)] bg-white/90 px-4 py-2 text-sm text-[var(--muted-mauve)] shadow-[0_12px_26px_rgba(42,18,18,0.04)]"
            role="status"
            aria-live="polite"
            {...motionConfig.getReveal({ direction: "up", distance: 12, duration: 0.35 })}
          >
            {actionMessage}
          </motion.p>
        ) : null}

        <motion.section
          className="mumz-card overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10"
          {...motionConfig.getReveal({ delay: 0.12, duration: 0.55 })}
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:gap-10">
            <div className="flex flex-col">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(248,216,213,0.55)] px-4 py-2 text-sm text-[var(--deep-berry)]">
                <Sparkles className="h-4 w-4" />
                <span>Your baby&rsquo;s next chapter</span>
              </div>

              <h2 className="max-w-2xl text-[2rem] leading-[1.08] text-[var(--deep-plum)] sm:text-[2.55rem]">
                {journeyCard.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted-mauve)] sm:text-lg">
                We noticed a few gentle signs from {family.babyName}&rsquo;s recent essentials. Here are helpful things to prepare.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <motion.button
                  type="button"
                  className="mumz-primary-button rounded-full px-6 py-3.5 text-white"
                  whileHover={motionConfig.buttonHoverStrong}
                  whileTap={motionConfig.gentleTap}
                  onClick={() => scrollToSection(essentialsRef)}
                >
                  View essentials
                </motion.button>
                <motion.button
                  type="button"
                  className="mumz-secondary-button rounded-full px-6 py-3.5 text-[var(--deep-plum)]"
                  whileHover={motionConfig.buttonHover}
                  whileTap={motionConfig.gentleTap}
                  onClick={() => scrollToSection(whyRef)}
                >
                  Why this suggestion?
                </motion.button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[rgba(42,18,18,0.08)] bg-[rgba(255,251,247,0.92)] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Current</p>
                  <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.currentStage}</p>
                </div>
                <div className="rounded-[1.5rem] border border-[rgba(42,18,18,0.08)] bg-[rgba(255,251,247,0.92)] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Next</p>
                  <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.nextStage}</p>
                </div>
                <div className="rounded-[1.5rem] border border-[rgba(42,18,18,0.08)] bg-[rgba(255,251,247,0.92)] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">Window</p>
                  <p className="mt-1 text-sm text-[var(--deep-plum)]">{prediction.nextStageWindow}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[rgba(42,18,18,0.08)] bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(243,230,220,0.82))] p-5 shadow-[0_18px_36px_rgba(42,18,18,0.04)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--muted-mauve)]">Stage transition</p>
                  <p className="text-lg text-[var(--deep-plum)]">A calmer way to prepare</p>
                </div>
                <div className="rounded-full bg-white/80 px-3 py-1 text-xs text-[var(--deep-berry)]">
                  {signalLabel}
                </div>
              </div>

              <div className="relative space-y-4">
                <div className="absolute left-6 top-10 bottom-10 border-l border-dashed border-[rgba(143,16,37,0.18)]" />

                {[
                  {
                    label: "Current",
                    stage: prediction.currentStage,
                    iconName: STAGE_ICON_MAP[prediction.currentStage] ?? "diaper",
                    accent: "bg-[rgba(243,230,220,0.84)]",
                  },
                  {
                    label: "Next",
                    stage: prediction.nextStage,
                    iconName: STAGE_ICON_MAP[prediction.nextStage] ?? "spoon",
                    accent: "bg-[rgba(248,216,213,0.78)]",
                  },
                  {
                    label: "Later",
                    stage: laterStage,
                    iconName: STAGE_ICON_MAP[laterStage] ?? "teddy",
                    accent: "bg-[rgba(255,251,247,0.92)]",
                  },
                ].map((entry, index) => (
                  <motion.div
                    key={entry.label}
                    className={`relative flex items-center gap-4 rounded-[1.5rem] border border-[rgba(42,18,18,0.08)] px-4 py-4 shadow-[0_10px_24px_rgba(42,18,18,0.035)] ${
                      entry.label === "Next"
                        ? "bg-white ring-1 ring-[rgba(201,47,75,0.12)]"
                        : "bg-[rgba(255,255,255,0.76)]"
                    }`}
                    {...motionConfig.getReveal({ delay: 0.18 + index * 0.08, direction: "left", distance: 18, duration: 0.45 })}
                    whileHover={motionConfig.cardHoverSoft}
                  >
                    <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1rem] ${entry.accent} p-1 shadow-sm`}>
                      <PremiumBabyIcon name={entry.iconName} className="h-full w-full rounded-[0.75rem]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-mauve)]">{entry.label}</p>
                      <p className="mt-1 text-[15px] text-[var(--deep-plum)]">{entry.stage}</p>
                    </div>
                    {entry.label === "Next" ? (
                      <span className="rounded-full bg-[rgba(201,47,75,0.12)] px-3 py-1 text-xs text-[var(--deep-berry)]">
                        Coming soon
                      </span>
                    ) : null}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={essentialsRef}
          className="mt-8"
          {...motionConfig.getReveal({ delay: 0.2, duration: 0.5 })}
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-[1.45rem] text-[var(--deep-plum)]">Helpful essentials</h3>
              <p className="mt-1 text-[var(--muted-mauve)]">
                A few gentle essentials for this stage.
              </p>
            </div>
            <motion.button
              type="button"
              className="mumz-secondary-button w-full rounded-full px-5 py-3 text-[var(--deep-plum)] sm:w-auto"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
              onClick={() => onNavigate("stage")}
            >
              Explore all essentials
            </motion.button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {essentials.map((item, index) => {
              const isAdded = prepList.includes(item.name);

              return (
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
                <motion.button
                  type="button"
                  className="mt-4 text-sm text-[var(--deep-berry)] underline decoration-[rgba(143,16,37,0.24)] underline-offset-4 self-start px-1"
                  whileHover={motionConfig.buttonHover}
                  whileTap={motionConfig.gentleTap}
                  onClick={() => togglePrepItem(item.name)}
                >
                  {isAdded ? "Added to prep list" : "Add to prep list"}
                </motion.button>
              </motion.article>
              );
            })}
          </div>
        </motion.section>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.section
            ref={whyRef}
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.28, duration: 0.5 })}
            whileHover={motionConfig.cardHoverSoft}
          >
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[rgba(248,216,213,0.6)]">
                <BookOpen className="h-5 w-5 text-[var(--deep-berry)]" />
              </div>
              <div>
                <h3 className="text-[1.35rem] text-[var(--deep-plum)]">Why this may be the right time</h3>
                <p className="mt-1 text-sm text-[var(--muted-mauve)]">
                  Three gentle clues from {family.babyName}&rsquo;s recent essentials.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {explanationSignals.map((signal, index) => (
                <motion.div
                  key={signal}
                  className="flex items-start gap-3 rounded-[1.4rem] bg-[rgba(255,251,247,0.92)] px-4 py-3"
                  {...motionConfig.getReveal({ delay: 0.34 + index * 0.08, direction: "left", distance: 16, duration: 0.4 })}
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--rose)]" />
                  <p className="text-sm text-[var(--muted-mauve)]">{signal}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="rounded-[2rem] border border-[rgba(42,18,18,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,230,220,0.84))] p-6 shadow-[0_18px_40px_rgba(42,18,18,0.05)] sm:p-7"
            {...motionConfig.getReveal({ delay: 0.36, duration: 0.5 })}
            whileHover={motionConfig.cardHoverSoft}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[rgba(201,47,75,0.1)]">
              <Clock3 className="h-5 w-5 text-[var(--deep-berry)]" />
            </div>
            <h3 className="mt-5 text-[1.35rem] text-[var(--deep-plum)]">You&rsquo;re always in control</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)] sm:text-base">
              Every baby grows differently. If this does not match {family.babyName}&rsquo;s stage, you can correct it anytime.
            </p>
            <p className="mt-4 text-sm text-[var(--muted-mauve)]">
              A calmer way to prepare starts with a few simple essentials and one next step at a time.
            </p>
            <motion.button
              type="button"
              className="mumz-secondary-button mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[var(--deep-plum)]"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
              onClick={() => handlePrototypeAction("Editing the baby stage is still a prototype action in this demo.")}
            >
              <Edit3 className="h-4 w-4" />
              Edit baby stage
            </motion.button>
          </motion.section>
        </div>

        <motion.div
          className="mt-8 flex justify-start"
          {...motionConfig.getReveal({ delay: 0.42, duration: 0.45 })}
        >
          <motion.button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-[var(--deep-berry)]"
            whileHover={motionConfig.buttonHover}
            whileTap={motionConfig.gentleTap}
            onClick={() => onNavigate("timeline")}
          >
            See the full baby timeline
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
