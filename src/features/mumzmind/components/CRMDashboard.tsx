"use client";

import { motion } from "motion/react";
import {
  BellRing,
  ClipboardList,
  FileText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useRef, useState } from "react";

import familiesData from "../data/families.json";
import { usePageMotion } from "../hooks/usePageMotion";
import { generateJourneyCard } from "../lib/journey-templates";
import { predictBabyStage } from "../lib/stage-engine";
import type { FamilyProfile, JourneyCard, JourneyTone, StagePredictionResult } from "../types";

type FamilyInsight = {
  family: FamilyProfile;
  prediction: StagePredictionResult;
  demoLabel: string;
};

type GeneratedJourneyPreview = {
  babyName: string;
  stage: string;
  channel: string;
  card: JourneyCard;
};

const DISTRIBUTION_STAGES = [
  "Newborn Care",
  "Feeding Routine",
  "Starting Solids",
  "Crawling Prep",
  "First Shoes",
] as const;

const STAGE_COLORS = ["#F8D8D5", "#F3E6DC", "#C92F4B", "#DDEFE5", "#8F1025"];
const TEMPLATE_STAGE_OPTIONS = [
  "Newborn Care",
  "Feeding Routine",
  "Starting Solids",
  "Crawling Prep",
  "First Shoes",
] as const;
const LOADING_STEPS = [
  "Reviewing the demo family journey",
  "Checking recent stage signals",
  "Matching the next chapter",
  "Preparing the template journey",
] as const;

function formatDemoLabel(index: number): string {
  return `Demo family ${String(index + 1).padStart(2, "0")}`;
}

export default function CRMDashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const timeoutIdsRef = useRef<number[]>([]);
  const gentleReminderRef = useRef<HTMLDivElement | null>(null);
  const motionConfig = usePageMotion();

  const insights: FamilyInsight[] = (familiesData as FamilyProfile[]).map((family, index) => ({
    family,
    prediction: predictBabyStage(family),
    demoLabel: formatDemoLabel(index),
  }));

  const totalFamilies = insights.length;
  const startingSolidsSoon = insights.filter((entry) => entry.prediction.nextStage === "Starting Solids").length;
  const crawlingPrepSoon = insights.filter((entry) => entry.prediction.nextStage === "Crawling Prep").length;
  const firstShoesSoon = insights.filter((entry) => entry.prediction.nextStage === "First Shoes").length;
  const atRiskFamilies = insights.filter((entry) => entry.prediction.riskLevel !== "Low");
  const templateJourneysPrepared = insights.length;

  const stageDistributionData = DISTRIBUTION_STAGES.map((stage, index) => ({
    stage,
    families: insights.filter(
      (entry) => entry.prediction.currentStage === stage || entry.prediction.nextStage === stage,
    ).length,
    color: STAGE_COLORS[index],
  }));

  const explainabilityExample =
    insights.find((entry) => entry.family.parentName === "Sara" && entry.family.babyName === "Omar") ??
    insights[0];

  const [selectedStage, setSelectedStage] = useState<(typeof TEMPLATE_STAGE_OPTIONS)[number]>(
    TEMPLATE_STAGE_OPTIONS.includes(
      (explainabilityExample?.prediction.nextStage ?? "Starting Solids") as (typeof TEMPLATE_STAGE_OPTIONS)[number],
    )
      ? (explainabilityExample.prediction.nextStage as (typeof TEMPLATE_STAGE_OPTIONS)[number])
      : "Starting Solids",
  );
  const [selectedTone, setSelectedTone] = useState<JourneyTone>("gentle");
  const [selectedChannel, setSelectedChannel] = useState("Email");
  const [actionMessage, setActionMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(-1);
  const [generatedJourney, setGeneratedJourney] = useState<GeneratedJourneyPreview | null>(null);

  function clearPendingTimeouts() {
    timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutIdsRef.current = [];
  }

  function handlePrepareJourney() {
    clearPendingTimeouts();

    const matchedFamily =
      insights.find(
        (entry) => entry.prediction.nextStage === selectedStage || entry.prediction.currentStage === selectedStage,
      ) ?? explainabilityExample;

    setIsGenerating(true);
    setLoadingStepIndex(0);
    setGeneratedJourney(null);
    setActionMessage("");

    LOADING_STEPS.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setLoadingStepIndex(index);
      }, index * 520);

      timeoutIdsRef.current.push(timeoutId);
    });

    const finalTimeoutId = window.setTimeout(() => {
      setGeneratedJourney({
        babyName: matchedFamily.family.babyName,
        stage: selectedStage,
        channel: selectedChannel,
        card: generateJourneyCard({
          babyName: matchedFamily.family.babyName,
          stage: selectedStage,
          tone: selectedTone,
        }),
      });
      setIsGenerating(false);
    }, LOADING_STEPS.length * 520 + 260);

    timeoutIdsRef.current.push(finalTimeoutId);
  }

  function scrollToGentleReminderSection() {
    gentleReminderRef.current?.scrollIntoView({
      behavior: motionConfig.prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    return () => {
      clearPendingTimeouts();
    };
  }, []);

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

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <motion.section
          className="mb-10"
          {...motionConfig.getReveal({ direction: "down", duration: 0.55 })}
        >
          <h1 className="text-[2.2rem] text-[var(--deep-plum)] sm:text-[2.8rem]">
            Internal CRM Preview
          </h1>
          <p className="mt-3 text-base text-[var(--muted-mauve)] sm:text-lg">
            A gentle overview of family stages and next opportunities.
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-[rgba(42,18,18,0.08)] bg-white/88 px-5 py-4 shadow-[0_14px_30px_rgba(42,18,18,0.045)]">
            <p className="text-sm leading-relaxed text-[var(--muted-mauve)]">
              Demo view using fictional data. In production, this dashboard would be restricted to authorized internal teams.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {["Local demo data", "Rule-based stage logic", "Template journeys", "Admin/internal concept"].map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-[rgba(255,251,247,0.92)] px-4 py-2 text-sm text-[var(--deep-plum)] shadow-[0_10px_22px_rgba(42,18,18,0.04)]"
              >
                {chip}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="mt-5 text-sm text-[var(--deep-berry)] underline decoration-[rgba(143,16,37,0.24)] underline-offset-4"
            onClick={() => onNavigate("landing")}
          >
            Return to the landing page
          </button>

          {actionMessage ? (
            <p className="mt-5 inline-flex rounded-full border border-[rgba(42,18,18,0.08)] bg-white/90 px-4 py-2 text-sm text-[var(--muted-mauve)]">
              {actionMessage}
            </p>
          ) : null}
        </motion.section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Families tracked",
              value: totalFamilies.toString(),
              note: "Fictional families in the local demo",
              icon: Users,
              tint: "bg-[rgba(248,216,213,0.48)]",
            },
            {
              label: "Starting solids soon",
              value: startingSolidsSoon.toString(),
              note: "Families nearing the next mealtime chapter",
              icon: Sparkles,
              tint: "bg-[rgba(255,251,247,0.92)]",
            },
            {
              label: "At-risk families",
              value: atRiskFamilies.length.toString(),
              note: "Families that may need a gentle reminder",
              icon: BellRing,
              tint: "bg-[rgba(243,230,220,0.78)]",
            },
            {
              label: "Journeys prepared",
              value: templateJourneysPrepared.toString(),
              note: "English-only lifecycle templates available",
              icon: FileText,
              tint: "bg-[rgba(221,239,229,0.74)]",
            },
          ].map((metric, index) => (
            <motion.article
              key={metric.label}
              className="mumz-card rounded-[1.9rem] p-6"
              {...motionConfig.getReveal({ delay: 0.08 * index, duration: 0.45 })}
              whileHover={motionConfig.cardHoverSoft}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-[1rem] ${metric.tint}`}>
                <metric.icon className="h-5 w-5 text-[var(--deep-berry)]" />
              </div>
              <p className="mt-5 text-sm text-[var(--muted-mauve)]">{metric.label}</p>
              <p className="mt-2 text-[2rem] text-[var(--deep-plum)]">{metric.value}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)]">{metric.note}</p>
            </motion.article>
          ))}
        </section>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.22, duration: 0.5 })}
          >
            <div className="mb-6">
              <h2 className="text-[1.45rem] text-[var(--deep-plum)]">Family stage distribution</h2>
              <p className="mt-2 text-sm text-[var(--muted-mauve)]">
                Current and near-next stage mix across the fictional family set.
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageDistributionData} barCategoryGap={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,18,18,0.07)" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#7A5C58" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#7A5C58" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(248,216,213,0.18)" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(42,18,18,0.08)",
                    borderRadius: "16px",
                    color: "#2A1212",
                  }}
                />
                <Bar dataKey="families" radius={[10, 10, 0, 0]}>
                  {stageDistributionData.map((entry, index) => (
                    <Cell key={`${entry.stage}-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.section>

          <motion.section
            className="rounded-[2rem] border border-[rgba(42,18,18,0.08)] bg-[linear-gradient(180deg,rgba(255,251,247,0.98),rgba(248,216,213,0.22))] p-6 shadow-[0_18px_40px_rgba(42,18,18,0.05)] sm:p-7"
            {...motionConfig.getReveal({ delay: 0.28, duration: 0.5 })}
          >
            <div className="mb-6">
              <h2 className="text-[1.45rem] text-[var(--deep-plum)]">Next stage opportunities</h2>
              <p className="mt-2 text-sm text-[var(--muted-mauve)]">
                A gentle way to see which transitions may be coming soon.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Starting solids soon",
                  count: startingSolidsSoon,
                  note: "Families moving from early feeding patterns toward first meals.",
                  action: "Prepare solids journey",
                },
                {
                  title: "Crawling prep soon",
                  count: crawlingPrepSoon,
                  note: "Families showing signs of more movement and floor activity.",
                  action: "Send crawling prep guide",
                },
                {
                  title: "First shoes soon",
                  count: firstShoesSoon,
                  note: "Families nearing early standing and first-step moments.",
                  action: "Prepare first shoes journey",
                },
              ].map((opportunity, index) => (
                <motion.article
                  key={opportunity.title}
                  className="rounded-[1.5rem] border border-[rgba(42,18,18,0.08)] bg-white/88 p-5"
                  {...motionConfig.getReveal({ delay: 0.32 + index * 0.08, direction: "left", distance: 16, duration: 0.4 })}
                  whileHover={motionConfig.cardHoverSoft}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[var(--muted-mauve)]">{opportunity.title}</p>
                      <p className="mt-2 text-[1.7rem] text-[var(--deep-plum)]">{opportunity.count}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(248,216,213,0.5)] px-3 py-1 text-xs text-[var(--deep-berry)]">
                      {opportunity.action}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)]">{opportunity.note}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <motion.section
            ref={gentleReminderRef}
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.34, duration: 0.5 })}
          >
            <div className="mb-6">
              <h2 className="text-[1.45rem] text-[var(--deep-plum)]">Families that may need a gentle reminder</h2>
              <p className="mt-2 text-sm text-[var(--muted-mauve)]">
                A softer internal view of families who may need timely follow-up.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full">
                <thead>
                  <tr className="border-b border-[rgba(42,18,18,0.08)] text-left">
                    <th className="px-3 py-3 text-sm text-[var(--muted-mauve)]">Family</th>
                    <th className="px-3 py-3 text-sm text-[var(--muted-mauve)]">Baby</th>
                    <th className="px-3 py-3 text-sm text-[var(--muted-mauve)]">Current stage</th>
                    <th className="px-3 py-3 text-sm text-[var(--muted-mauve)]">Days silent</th>
                    <th className="px-3 py-3 text-sm text-[var(--muted-mauve)]">Risk level</th>
                    <th className="px-3 py-3 text-sm text-[var(--muted-mauve)]">Next best action</th>
                  </tr>
                </thead>
                <tbody>
                  {atRiskFamilies.map((entry, index) => (
                    <motion.tr
                      key={entry.family.id}
                      className="border-b border-[rgba(42,18,18,0.06)]"
                      {...motionConfig.getReveal({ delay: 0.38 + index * 0.05, direction: "up", distance: 12, duration: 0.35 })}
                    >
                      <td className="px-3 py-4 text-sm text-[var(--deep-plum)]">{entry.demoLabel}</td>
                      <td className="px-3 py-4 text-sm text-[var(--deep-plum)]">{entry.family.babyName}</td>
                      <td className="px-3 py-4 text-sm text-[var(--deep-plum)]">{entry.prediction.currentStage}</td>
                      <td className="px-3 py-4 text-sm text-[var(--deep-plum)]">{entry.family.daysSilent}</td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            entry.prediction.riskLevel === "High"
                              ? "bg-[rgba(201,47,75,0.12)] text-[var(--deep-berry)]"
                              : "bg-[rgba(243,230,220,0.76)] text-[var(--soft-espresso)]"
                          }`}
                        >
                          {entry.prediction.riskLevel}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-[var(--muted-mauve)]">{entry.prediction.nextBestAction}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          <motion.section
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.4, duration: 0.5 })}
            whileHover={motionConfig.cardHoverSoft}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[rgba(243,230,220,0.78)]">
              <ShieldCheck className="h-5 w-5 text-[var(--deep-berry)]" />
            </div>
            <h2 className="mt-5 text-[1.45rem] text-[var(--deep-plum)]">Why this family may need attention</h2>
            <p className="mt-2 text-sm text-[var(--muted-mauve)]">
              A business-friendly summary from one fictional family example.
            </p>

            <div className="mt-6 space-y-3">
              {[
                ...explainabilityExample.prediction.explanationSignals.slice(0, 3),
                explainabilityExample.family.daysSilent >= 7
                  ? "Family has been inactive for several days"
                  : "Recent activity still looks healthy",
              ].map((signal) => (
                <div
                  key={signal}
                  className="rounded-[1.3rem] bg-[rgba(255,251,247,0.92)] px-4 py-4"
                >
                  <p className="text-sm leading-relaxed text-[var(--muted-mauve)]">{signal}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            className="rounded-[2rem] border border-[rgba(42,18,18,0.08)] bg-[linear-gradient(180deg,rgba(255,251,247,0.98),rgba(248,216,213,0.22))] p-6 shadow-[0_18px_40px_rgba(42,18,18,0.05)] sm:p-7"
            {...motionConfig.getReveal({ delay: 0.46, duration: 0.5 })}
          >
            <div className="mb-6">
              <h2 className="text-[1.45rem] text-[var(--deep-plum)]">Template journey preview</h2>
              <p className="mt-2 text-sm text-[var(--muted-mauve)]">
                Prepare a parent-friendly transition message.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-[var(--muted-mauve)]">Stage</label>
                <select
                  className="w-full rounded-[1.2rem] border border-[rgba(42,18,18,0.08)] bg-white/90 px-4 py-3 text-[var(--deep-plum)]"
                  value={selectedStage}
                  onChange={(event) => setSelectedStage(event.target.value as (typeof TEMPLATE_STAGE_OPTIONS)[number])}
                >
                  {TEMPLATE_STAGE_OPTIONS.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-[var(--muted-mauve)]">Tone</label>
                  <select
                    className="w-full rounded-[1.2rem] border border-[rgba(42,18,18,0.08)] bg-white/90 px-4 py-3 text-[var(--deep-plum)]"
                    value={selectedTone}
                    onChange={(event) => setSelectedTone(event.target.value as JourneyTone)}
                  >
                    <option value="gentle">Gentle</option>
                    <option value="premium">Premium</option>
                    <option value="offer-led">Offer-led</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[var(--muted-mauve)]">Channel</label>
                  <select
                    className="w-full rounded-[1.2rem] border border-[rgba(42,18,18,0.08)] bg-white/90 px-4 py-3 text-[var(--deep-plum)]"
                    value={selectedChannel}
                    onChange={(event) => setSelectedChannel(event.target.value)}
                  >
                    <option>Email</option>
                    <option>WhatsApp</option>
                    <option>App Push</option>
                  </select>
                </div>
              </div>

              <motion.button
                type="button"
                className="mumz-primary-button w-full rounded-full px-6 py-3.5 text-white"
                whileHover={motionConfig.buttonHoverStrong}
                whileTap={motionConfig.gentleTap}
                onClick={handlePrepareJourney}
                disabled={isGenerating}
                aria-busy={isGenerating}
              >
                {isGenerating ? "Preparing journey..." : "Prepare journey"}
              </motion.button>
            </div>
          </motion.section>

          <motion.section
            className="mumz-card rounded-[2rem] p-6 sm:p-7"
            {...motionConfig.getReveal({ delay: 0.52, duration: 0.5 })}
          >
            <h3 className="text-[1.3rem] text-[var(--deep-plum)]">Template preview</h3>

            {isGenerating ? (
              <div className="mt-5 space-y-3" role="status" aria-live="polite">
                {LOADING_STEPS.map((step, index) => {
                  const isActive = index === loadingStepIndex;
                  const isComplete = index < loadingStepIndex;

                  return (
                    <motion.div
                      key={step}
                      className={`rounded-[1.3rem] border px-4 py-4 ${
                        isActive
                          ? "border-[rgba(201,47,75,0.18)] bg-[rgba(248,216,213,0.36)]"
                          : isComplete
                            ? "border-[rgba(42,18,18,0.08)] bg-[rgba(221,239,229,0.52)]"
                            : "border-[rgba(42,18,18,0.08)] bg-[rgba(255,251,247,0.92)]"
                      }`}
                      {...motionConfig.getReveal({ direction: "up", distance: 8, duration: 0.3 })}
                    >
                      <p className="text-sm text-[var(--deep-plum)]">{step}</p>
                    </motion.div>
                  );
                })}
              </div>
            ) : generatedJourney ? (
              <div className="mt-5 rounded-[1.6rem] border border-[rgba(42,18,18,0.08)] bg-[rgba(255,251,247,0.92)] p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-mauve)]">
                  <span>{generatedJourney.babyName}</span>
                  <span>&middot;</span>
                  <span>{generatedJourney.stage}</span>
                  <span>&middot;</span>
                  <span>{generatedJourney.channel}</span>
                </div>
                <p className="mt-4 text-lg text-[var(--deep-plum)]">{generatedJourney.card.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)] sm:text-base">
                  {generatedJourney.card.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {generatedJourney.card.recommendedCategories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-white/92 px-3 py-1 text-xs text-[var(--deep-plum)]"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-[var(--deep-berry)]">{generatedJourney.card.gentleCTA}</p>
              </div>
            ) : (
              <div className="mumz-empty-state mt-5 rounded-[1.5rem] p-5">
                <p className="text-[var(--deep-plum)]">Choose a stage to preview the next journey.</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-mauve)]">
                  This is a local English-only template preview based on fictional family data and rule-based stage logic.
                </p>
              </div>
            )}
          </motion.section>
        </div>

        <motion.section
          className="mt-10"
          {...motionConfig.getReveal({ delay: 0.58, duration: 0.5 })}
        >
          <div className="mb-6">
            <h2 className="text-[1.45rem] text-[var(--deep-plum)]">What the team can do next</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Prepare solids journey",
                body: "Set the journey preview to a first-solids transition message.",
                action: "prepare-solids",
              },
              {
                title: "Review families needing reminders",
                body: "Jump back to the families list that may need follow-up.",
                action: "review-reminders",
              },
              {
                title: "Send gentle reactivation message",
                body: "Prototype-only action for a future internal outreach workflow.",
                action: "reactivation",
              },
            ].map((item, index) => (
              <motion.article
                key={item.title}
                className="mumz-card-soft rounded-[1.8rem] p-6"
                {...motionConfig.getReveal({ delay: 0.62 + index * 0.08, duration: 0.4 })}
                whileHover={motionConfig.cardHoverSoft}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[rgba(248,216,213,0.5)]">
                  <ClipboardList className="h-5 w-5 text-[var(--deep-berry)]" />
                </div>
                <h3 className="mt-5 text-[1.25rem] text-[var(--deep-plum)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-mauve)]">{item.body}</p>
                <motion.button
                  type="button"
                  className="mumz-secondary-button mt-5 rounded-full px-5 py-3 text-[var(--deep-plum)]"
                  whileHover={motionConfig.buttonHover}
                  whileTap={motionConfig.gentleTap}
                  onClick={() => {
                    if (item.action === "prepare-solids") {
                      setSelectedStage("Starting Solids");
                      setSelectedTone("gentle");
                      setActionMessage("The journey preview is set to Starting Solids.");
                      return;
                    }

                    if (item.action === "review-reminders") {
                      scrollToGentleReminderSection();
                      setActionMessage("Scrolled to families that may need a gentle reminder.");
                      return;
                    }

                    setActionMessage("Gentle reactivation sending is still a prototype-only action.");
                  }}
                >
                  Open
                </motion.button>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
