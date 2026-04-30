"use client";

import { motion } from "motion/react";
import { ArrowLeft, Sparkles, CheckCircle, Clock, TrendingUp, Edit3 } from "lucide-react";

import familiesData from "../data/families.json";
import stagesData from "../data/stages.json";
import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";
import { usePageMotion } from "../hooks/usePageMotion";
import { predictBabyStage } from "../lib/stage-engine";
import type { BabyStage, FamilyProfile } from "../types";

type TimelineStatus = "past" | "current" | "next" | "future";

type TimelineStage = {
  id: string;
  name: string;
  status: TimelineStatus;
  timeframe: string;
  confidence: number;
  iconName: PremiumBabyIconName;
  categories: string[];
  color: string;
  ageRangeMonths: string;
  parentMessage: string;
  signals: string[];
};

const STAGE_VISUALS: Record<string, { icon: string; color: string }> = {
  "Newborn Care": { icon: "👶", color: "var(--soft-mint)" },
  "Diaper Size 1": { icon: "🍼", color: "var(--powder-blue)" },
  "Diaper Size 2": { icon: "🧸", color: "var(--pale-peach)" },
  "Diaper Size 3": { icon: "🥛", color: "var(--blush-pink)" },
  "Feeding Routine": { icon: "🍼", color: "var(--warm-sand)" },
  "Starting Solids": { icon: "🥄", color: "var(--mist-lavender)" },
  "Sitting Support": { icon: "🪑", color: "var(--warm-sand)" },
  "Crawling Prep": { icon: "🧩", color: "var(--soft-mint)" },
  "First Shoes": { icon: "👟", color: "var(--powder-blue)" },
  "Toddler Snacks": { icon: "🍎", color: "var(--pale-peach)" },
};

const STAGE_PREMIUM_ICON_MAP: Record<string, PremiumBabyIconName> = {
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

function titleCaseCategory(category: string): string {
  return category
    .split(" ")
    .map((word) => {
      if (!word) {
        return word;
      }

      return `${word[0].toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
}

export default function TimelineScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const motionConfig = usePageMotion();
  const families = familiesData as FamilyProfile[];
  const stageCatalog = stagesData as BabyStage[];
  const family =
    families.find((entry) => entry.parentName === "Sara" && entry.babyName === "Omar") ??
    families[0];
  const prediction = predictBabyStage(family);
  const stageMap = new Map(stageCatalog.map((stage) => [stage.name, stage]));

  const pastStageNames = ["Newborn Care", "Diaper Size 1", "Diaper Size 2"];
  const currentStageNames = [prediction.currentStage];

  if (
    prediction.currentStage !== "Feeding Routine" &&
    prediction.predictedAgeMonths >= 4 &&
    prediction.predictedAgeMonths <= 6 &&
    stageMap.has("Feeding Routine")
  ) {
    currentStageNames.push("Feeding Routine");
  }

  const futureStageNames = [prediction.nextStage, ...prediction.nextThreeStages].filter(
    (stageName, index, allNames) =>
      !!stageName &&
      !currentStageNames.includes(stageName) &&
      !pastStageNames.includes(stageName) &&
      allNames.indexOf(stageName) === index,
  );

  const orderedStageNames = [...pastStageNames, ...currentStageNames, ...futureStageNames].filter(
    (stageName, index, allNames) => allNames.indexOf(stageName) === index,
  );

  const timelineStages: TimelineStage[] = orderedStageNames
    .map((stageName, index) => {
      const stage = stageMap.get(stageName);

      if (!stage) {
        return null;
      }

      let status: TimelineStatus = "future";

      if (pastStageNames.includes(stageName)) {
        status = "past";
      } else if (stageName === prediction.currentStage || stageName === "Feeding Routine") {
        status = "current";
      } else if (stageName === prediction.nextStage) {
        status = "next";
      }

      const confidence =
        status === "current"
          ? prediction.confidence
          : status === "next"
            ? Math.max(prediction.confidence - 2, 70)
            : status === "past"
              ? Math.max(prediction.confidence - 6 + index * 2, 82)
              : Math.max(prediction.confidence - 10 - index, 65);

      const timeframe =
        status === "past"
          ? `Completed · ${stage.ageRangeMonths} months`
          : status === "current"
            ? stageName === prediction.currentStage
              ? `Current stage · ${stage.ageRangeMonths} months`
              : `Relevant now · ${stage.ageRangeMonths} months`
            : status === "next"
              ? `Likely in ${prediction.nextStageWindow}`
              : `Ahead · ${stage.ageRangeMonths} months`;

      return {
        id: stage.id,
        name: stage.name,
        status,
        timeframe,
        confidence,
        iconName: STAGE_PREMIUM_ICON_MAP[stage.name] ?? "newborn",
        color: STAGE_VISUALS[stage.name]?.color ?? "var(--warm-sand)",
        categories: stage.recommendedCategories.map(titleCaseCategory),
        ageRangeMonths: stage.ageRangeMonths,
        parentMessage: stage.parentMessage,
        signals: stage.signals,
      };
    })
    .filter((stage): stage is TimelineStage => stage !== null);

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--warm-ivory)]">
      {/* Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(at 50% 0%, rgba(244, 178, 176, 0.3), transparent)" }}
          animate={motionConfig.prefersReducedMotion ? undefined : { opacity: [0.2, 0.4, 0.2] }}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 border-b border-[var(--border)] bg-white/40 px-4 pb-6 pt-8 backdrop-blur-md sm:px-6"
        {...motionConfig.getReveal({ direction: "down" })}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-start gap-4">
            <motion.button
              aria-label="Back to parent feed"
              className="w-10 h-10 rounded-full bg-white/60 border border-[var(--border)] flex items-center justify-center"
              whileHover={motionConfig.iconButtonHover}
              whileTap={motionConfig.iconTap}
              onClick={() => onNavigate("parent")}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--deep-plum)]" />
            </motion.button>
            <div>
              <h1 className="text-2xl text-[var(--deep-plum)] sm:text-[2rem]">{family.babyName}&rsquo;s Growth Journey</h1>
              <p className="text-[var(--muted-mauve)] text-sm">A gentle view of what may come next</p>
            </div>
          </div>

          {/* Current Stage Info */}
          <motion.div
            className="mumz-card rounded-2xl p-5"
            {...motionConfig.getReveal({ delay: 0.2, direction: "scale", scale: 0.95 })}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-[var(--muted-mauve)] mb-1">Current stage</p>
                <p className="text-lg text-[var(--deep-plum)]">{prediction.currentStage}</p>
              </div>
              <div className="sm:text-center">
                <p className="text-sm text-[var(--muted-mauve)] mb-1">Predicted age</p>
                <p className="text-lg text-[var(--deep-plum)]">{prediction.predictedAgeMonths} months</p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-[var(--muted-mauve)] mb-1">Confidence</p>
                <div className="flex items-center gap-2 sm:justify-end">
                  <Sparkles className="w-4 h-4 text-[var(--soft-teal)]" />
                  <p className="text-lg text-[var(--soft-teal)]">{prediction.confidence}%</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-[var(--warm-ivory)] text-sm text-[var(--deep-plum)]">
                Next: {prediction.nextStage}
              </span>
              <span className="px-4 py-2 rounded-full bg-[var(--warm-ivory)] text-sm text-[var(--deep-plum)]">
                Window: {prediction.nextStageWindow}
              </span>
              <span className="mumz-badge rounded-full px-4 py-2 text-sm text-[var(--deep-plum)]">
                Prepared from gentle lifecycle signals
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="relative">
          <div className="absolute bottom-0 left-5 top-0 w-0.5 bg-gradient-to-b from-[rgba(217,111,120,0.18)] via-[rgba(222,58,87,0.36)] to-transparent sm:left-8" />

          <div className="space-y-8">
            {timelineStages.map((stage, idx) => (
              <motion.div
                key={stage.id}
                className="relative"
                {...motionConfig.getReveal({ delay: 0.1 * idx, direction: "left", distance: 30, duration: 0.5 })}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <motion.div
                    className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 text-xl shadow-lg sm:h-16 sm:w-16 sm:text-2xl ${
                      stage.status === "current"
                        ? "border-[var(--rose)] bg-white"
                        : stage.status === "past"
                          ? "border-[var(--soft-teal)] bg-white"
                          : "border-white bg-white/60"
                    }`}
                    style={{ backgroundColor: stage.status === "current" ? "white" : stage.color }}
                    whileHover={motionConfig.prefersReducedMotion ? undefined : { scale: 1.08, rotate: 3 }}
                    transition={{ type: "spring" }}
                  >
                    <PremiumBabyIcon
                      name={stage.iconName}
                      className="h-7 w-7 sm:h-9 sm:w-9"
                    />
                    {stage.status === "current" && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--coral)] flex items-center justify-center"
                        animate={motionConfig.pulse}
                        transition={motionConfig.prefersReducedMotion ? undefined : { duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                    {stage.status === "past" && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--soft-teal)] flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    className={`flex-1 rounded-2xl p-4 sm:p-6 ${
                      stage.status === "current"
                        ? "border-2 border-[rgba(165,13,37,0.12)] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(244,178,176,0.24))] shadow-[0_20px_38px_rgba(37,0,0,0.08)]"
                        : stage.status === "past"
                          ? "border border-[var(--border)] bg-[rgba(255,252,251,0.9)] shadow-[0_12px_26px_rgba(37,0,0,0.05)]"
                          : "border border-[var(--border)] bg-[rgba(255,255,255,0.56)]"
                    }`}
                    whileHover={motionConfig.cardHover}
                  >
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className={`text-lg ${stage.status === "current" ? "text-[var(--rose)]" : "text-[var(--deep-plum)]"}`}>
                          {stage.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className={`w-4 h-4 ${stage.status === "current" ? "text-[var(--rose)]" : "text-[var(--muted-mauve)]"}`} />
                          <span className={`text-sm ${stage.status === "current" ? "text-[var(--rose)]" : "text-[var(--muted-mauve)]"}`}>
                            {stage.timeframe}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted-mauve)] mt-2">Age range: {stage.ageRangeMonths} months</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-[var(--soft-teal)]" />
                        <span className="text-sm text-[var(--soft-teal)]">{stage.confidence}%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {stage.categories.map((category) => (
                        <motion.span
                          key={category}
                          className={`px-3 py-1 rounded-full text-xs ${
                            stage.status === "current"
                              ? "bg-white/80 text-[var(--deep-plum)]"
                              : "bg-white/60 text-[var(--muted-mauve)]"
                          }`}
                          whileHover={motionConfig.buttonHover}
                        >
                          {category}
                        </motion.span>
                      ))}
                    </div>

                    <p className="text-sm text-[var(--muted-mauve)] leading-relaxed mb-3">{stage.parentMessage}</p>

                    <div className="flex flex-wrap gap-2">
                      {stage.signals.slice(0, 2).map((signal) => (
                        <span
                          key={signal}
                          className="px-3 py-1 rounded-full text-xs bg-[var(--warm-ivory)] text-[var(--muted-mauve)]"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>

                    {stage.status === "next" && (
                      <motion.button
                        className="mumz-primary-button mt-4 w-full rounded-full px-5 py-2 text-sm text-white sm:w-auto"
                        whileHover={motionConfig.buttonHoverStrong}
                        whileTap={motionConfig.gentleTap}
                        onClick={() => onNavigate("stage")}
                      >
                        Prepare for this stage
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation Panel */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-4 pb-12 sm:px-6"
        {...motionConfig.getReveal({ delay: 0.8 })}
      >
        <div className="mumz-card rounded-3xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--soft-mint)] to-[var(--powder-blue)] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[var(--soft-teal)]" />
              </div>
              <div>
                <h3 className="text-xl text-[var(--deep-plum)]">Why this may be the right time</h3>
                <p className="text-sm text-[var(--muted-mauve)]">Gentle signals based on {family.parentName} and {family.babyName}&rsquo;s purchase history</p>
              </div>
            </div>
            <span className="mumz-badge rounded-full px-3 py-1 text-xs text-[var(--deep-plum)]">
              Local lifecycle rules
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {prediction.explanationSignals.map((reason, idx) => (
              <motion.div
                key={reason}
                className="flex items-start gap-3"
                {...motionConfig.getReveal({ delay: 1 + idx * 0.1, direction: "left", distance: 20 })}
              >
                <div className="w-6 h-6 rounded-full bg-[var(--blush-pink)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[var(--rose)]" />
                </div>
                <p className="text-[var(--muted-mauve)] leading-relaxed">{reason}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <motion.button
              className="mumz-subtle-button flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[var(--deep-plum)]"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
            >
              <Edit3 className="w-4 h-4" />
              Correct baby age
            </motion.button>
            <motion.button
              className="mumz-primary-button rounded-full px-6 py-3 text-white"
              whileHover={motionConfig.buttonHoverStrong}
              whileTap={motionConfig.gentleTap}
              onClick={() => onNavigate("stage")}
            >
              Explore next chapter
            </motion.button>
            <motion.button
              className="mumz-secondary-button rounded-full px-6 py-3 text-[var(--deep-plum)]"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
            >
              See stage details
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
