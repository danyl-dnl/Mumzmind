"use client";

import { motion } from "motion/react";
import { TrendingUp, Users, AlertCircle, Sparkles, ChevronRight, ArrowLeft } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useRef, useState } from "react";

import familiesData from "../data/families.json";
import { usePageMotion } from "../hooks/usePageMotion";
import { generateJourneyCard } from "../lib/journey-templates";
import { predictBabyStage } from "../lib/stage-engine";
import type { FamilyProfile, JourneyCard, JourneyTone, StagePredictionResult } from "../types";

type FamilyInsight = {
  family: FamilyProfile;
  prediction: StagePredictionResult;
  lastPurchase: string;
};

type GeneratedJourneyPreview = {
  babyName: string;
  stage: string;
  channel: string;
  card: JourneyCard;
};

const KPI_CARD_COLORS = [
  "from-[var(--rose)] to-[var(--coral)]",
  "from-[var(--soft-teal)] to-[var(--blush-pink)]",
  "from-[var(--coral)] to-[var(--pale-peach)]",
  "from-[var(--dusty-rose)] to-[var(--mist-lavender)]",
  "from-[var(--powder-blue)] to-[var(--soft-mint)]",
];

const FUNNEL_STAGES = ["Newborn Care", "Feeding Routine", "Starting Solids", "Crawling Prep", "First Shoes"] as const;
const FUNNEL_STAGE_COLORS: Record<string, string> = {
  "Newborn Care": "var(--soft-mint)",
  "Feeding Routine": "var(--pale-peach)",
  "Starting Solids": "var(--blush-pink)",
  "Crawling Prep": "var(--mist-lavender)",
  "First Shoes": "var(--powder-blue)",
};

const TEMPLATE_STAGE_OPTIONS = ["Newborn Care", "Feeding Routine", "Starting Solids", "Crawling Prep", "First Shoes"] as const;
const LOADING_STEPS = [
  "Reading purchase journey",
  "Inferring baby stage",
  "Matching lifecycle pattern",
  "Preparing template journey",
] as const;

const RISK_PRIORITY: Record<string, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

function getStageIndex(stageName: string): number {
  return FUNNEL_STAGES.indexOf(stageName as (typeof FUNNEL_STAGES)[number]);
}

function getLatestPurchaseName(family: FamilyProfile): string {
  const latestPurchase = [...family.purchaseHistory].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  })[0];

  return latestPurchase?.productName ?? "No purchase history";
}

export default function CRMDashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const timeoutIdsRef = useRef<number[]>([]);
  const motionConfig = usePageMotion();

  const insights: FamilyInsight[] = (familiesData as FamilyProfile[]).map((family) => ({
    family,
    prediction: predictBabyStage(family),
    lastPurchase: getLatestPurchaseName(family),
  }));

  const totalFamilies = insights.length;
  const familiesWithPredictedNextStage = insights.filter((entry) => !!entry.prediction.nextStage).length;
  const startingSolidsSoon = insights.filter((entry) => entry.prediction.nextStage === "Starting Solids").length;
  const diaperTransitionExpected = insights.filter((entry) => entry.prediction.nextStage.startsWith("Diaper Size")).length;
  const atRiskFamiliesCount = insights.filter((entry) => entry.prediction.riskLevel !== "Low").length;
  const templateJourneysPrepared = insights.length;

  const kpiData = [
    {
      label: "Total families",
      value: totalFamilies.toString(),
      trend: `${Math.round((totalFamilies / Math.max(totalFamilies, 1)) * 100)}% mock coverage`,
      color: KPI_CARD_COLORS[0],
    },
    {
      label: "Families with predicted next stage",
      value: familiesWithPredictedNextStage.toString(),
      trend: `${Math.round((familiesWithPredictedNextStage / Math.max(totalFamilies, 1)) * 100)}% of families`,
      color: KPI_CARD_COLORS[1],
    },
    {
      label: "Starting solids soon",
      value: startingSolidsSoon.toString(),
      trend: `${Math.round((startingSolidsSoon / Math.max(totalFamilies, 1)) * 100)}% preparing soon`,
      color: KPI_CARD_COLORS[2],
    },
    {
      label: "Diaper transition expected",
      value: diaperTransitionExpected.toString(),
      trend: `${Math.round((diaperTransitionExpected / Math.max(totalFamilies, 1)) * 100)}% in transition`,
      color: KPI_CARD_COLORS[3],
    },
    {
      label: "At-risk families",
      value: atRiskFamiliesCount.toString(),
      trend: `${Math.round((atRiskFamiliesCount / Math.max(totalFamilies, 1)) * 100)}% need follow-up`,
      color: KPI_CARD_COLORS[4],
    },
  ];

  const funnelData = FUNNEL_STAGES.map((stage) => {
    const targetIndex = getStageIndex(stage);
    const families = insights.filter((entry) => {
      const currentIndex = getStageIndex(entry.prediction.currentStage);
      const nextIndex = getStageIndex(entry.prediction.nextStage);

      return (
        currentIndex >= targetIndex ||
        nextIndex >= targetIndex ||
        entry.prediction.nextThreeStages.includes(stage)
      );
    }).length;

    return {
      stage,
      families,
      color: FUNNEL_STAGE_COLORS[stage],
    };
  });

  const chartData = FUNNEL_STAGES.map((stage) => ({
    stage,
    currentFamilies: insights.filter((entry) => entry.prediction.currentStage === stage).length,
    nextStageFamilies: insights.filter((entry) => entry.prediction.nextStage === stage).length,
  }));

  const familyTableRows = [...insights].sort((a, b) => {
    const riskDelta = RISK_PRIORITY[a.prediction.riskLevel] - RISK_PRIORITY[b.prediction.riskLevel];

    if (riskDelta !== 0) {
      return riskDelta;
    }

    return b.family.daysSilent - a.family.daysSilent;
  });

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(-1);
  const [generatedJourney, setGeneratedJourney] = useState<GeneratedJourneyPreview | null>(null);

  function clearPendingTimeouts() {
    timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutIdsRef.current = [];
  }

  function handleGenerateJourney() {
    clearPendingTimeouts();

    const matchedFamily =
      insights.find(
        (entry) => entry.prediction.nextStage === selectedStage || entry.prediction.currentStage === selectedStage,
      ) ?? explainabilityExample;

    setIsGenerating(true);
    setLoadingStepIndex(0);
    setGeneratedJourney(null);

    LOADING_STEPS.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setLoadingStepIndex(index);
      }, index * 500);

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
    }, LOADING_STEPS.length * 500 + 250);

    timeoutIdsRef.current.push(finalTimeoutId);
  }

  useEffect(() => {
    return () => {
      clearPendingTimeouts();
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--warm-ivory)]">
      {/* Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(at 30% 20%, rgba(244, 178, 176, 0.3), transparent), radial-gradient(at 70% 80%, rgba(222, 58, 87, 0.16), transparent)",
          }}
          animate={motionConfig.prefersReducedMotion ? undefined : { opacity: [0.1, 0.2, 0.1] }}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 border-b border-[var(--border)] bg-white/60 px-4 pb-6 pt-8 backdrop-blur-md sm:px-6 lg:px-8"
        {...motionConfig.getReveal({ direction: "down" })}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <motion.button
                aria-label="Back to landing page"
                className="w-10 h-10 rounded-full bg-white border border-[var(--border)] flex items-center justify-center"
                whileHover={motionConfig.iconButtonHover}
                whileTap={motionConfig.iconTap}
                onClick={() => onNavigate("landing")}
              >
                <ArrowLeft className="w-5 h-5 text-[var(--deep-plum)]" />
              </motion.button>
              <div>
                <h1 className="text-2xl text-[var(--deep-plum)] sm:text-3xl">MumzMind CRM Dashboard</h1>
                <p className="text-[var(--muted-mauve)]">Review family stages, prepare next journeys, and notice quiet families early</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-[rgba(165,13,37,0.08)] bg-[rgba(255,251,250,0.9)] px-4 py-2 text-[var(--deep-plum)] shadow-[0_12px_28px_rgba(37,0,0,0.06)] sm:px-5">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">{templateJourneysPrepared} template journeys prepared</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          {kpiData.map((kpi, idx) => (
            <motion.div
              key={kpi.label}
              className="mumz-card relative overflow-hidden rounded-3xl p-6"
              {...motionConfig.getReveal({ delay: 0.1 * idx })}
              whileHover={motionConfig.cardHover}
            >
              <div className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br ${kpi.color} opacity-12 blur-3xl`} />
              <div className="relative z-10">
                <p className="text-sm text-[var(--muted-mauve)] mb-2">{kpi.label}</p>
                <p className="text-3xl text-[var(--deep-plum)] mb-2">{kpi.value}</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--soft-teal)]" />
                  <span className="text-sm text-[var(--soft-teal)]">{kpi.trend}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stage Prediction Funnel & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="mumz-card rounded-3xl p-6 sm:p-8"
            {...motionConfig.getReveal({ delay: 0.4, direction: "left", distance: 40 })}
          >
            <h2 className="text-xl text-[var(--deep-plum)] mb-2">Stage Prediction Funnel</h2>
            <p className="text-sm text-[var(--muted-mauve)] mb-6">Families that have reached or are approaching each lifecycle stage</p>
            <div className="space-y-4">
              {funnelData.map((stage, idx) => (
                <motion.div
                  key={stage.stage}
                  {...motionConfig.getReveal({ delay: 0.5 + idx * 0.1, direction: "left", distance: 20 })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--deep-plum)]">{stage.stage}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-[var(--muted-mauve)]">{stage.families.toLocaleString()} families</span>
                    </div>
                  </div>
                  <motion.div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: stage.color }} whileHover={motionConfig.buttonHover}>
                    <motion.div
                      className="h-full bg-gradient-to-r from-[var(--rose)] to-[var(--coral)] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.families / Math.max(funnelData[0]?.families ?? 1, 1)) * 100}%` }}
                      transition={{ delay: 0.6 + idx * 0.1, duration: 1, ease: "easeOut" }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="mumz-card rounded-3xl p-6 sm:p-8"
            {...motionConfig.getReveal({ delay: 0.4, direction: "right", distance: 40 })}
          >
            <h2 className="text-xl text-[var(--deep-plum)] mb-2">Current vs Next Stage Mix</h2>
            <p className="text-sm text-[var(--muted-mauve)] mb-6">Local family counts by current stage and predicted next stage</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="stage"
                  stroke="var(--muted-mauve)"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={56}
                />
                <YAxis allowDecimals={false} stroke="var(--muted-mauve)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                />
                <Line type="monotone" dataKey="currentFamilies" name="Current families" stroke="var(--rose)" strokeWidth={3} dot={{ fill: "var(--rose)", r: 5 }} />
                <Line type="monotone" dataKey="nextStageFamilies" name="Next stage families" stroke="var(--soft-teal)" strokeWidth={3} dot={{ fill: "var(--soft-teal)", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* At-Risk Family Table */}
        <motion.div
          className="mumz-card rounded-3xl p-6 sm:p-8"
          {...motionConfig.getReveal({ delay: 0.6 })}
        >
          <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--dusty-rose)] to-[var(--mist-lavender)] flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--deep-plum)]">At-Risk Families</h2>
                <p className="text-sm text-[var(--muted-mauve)]">Using all local mock families with deterministic risk scoring</p>
              </div>
            </div>
            <motion.button
              className="mumz-subtle-button px-5 py-2 rounded-full text-[var(--deep-plum)] text-sm"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
            >
              Export All
            </motion.button>
          </div>
          <div className="space-y-4 md:hidden">
            {familyTableRows.map((entry, idx) => (
              <motion.div
                key={entry.family.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--warm-ivory)] p-4"
                {...motionConfig.getReveal({ delay: 0.7 + idx * 0.05, direction: "up", distance: 18, duration: 0.45 })}
                whileHover={motionConfig.cardHoverSoft}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-[var(--muted-mauve)]">{entry.family.id}</p>
                    <p className="text-base text-[var(--deep-plum)]">
                      {entry.family.parentName} &middot; {entry.family.babyName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      entry.prediction.riskLevel === "High"
                        ? "bg-[var(--rose)]/10 text-[var(--rose)]"
                        : entry.prediction.riskLevel === "Medium"
                          ? "bg-[var(--coral)]/10 text-[var(--coral)]"
                          : "bg-[var(--soft-teal)]/10 text-[var(--soft-teal)]"
                    }`}
                  >
                    {entry.prediction.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-[var(--muted-mauve)]">Predicted stage</p>
                    <p className="text-[var(--deep-plum)]">{entry.prediction.nextStage}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-mauve)]">Last key purchase</p>
                    <p className="text-[var(--deep-plum)]">{entry.lastPurchase}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-mauve)]">Days silent</p>
                    <p className="text-[var(--deep-plum)]">{entry.family.daysSilent}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted-mauve)]">Next best action</p>
                    <p className="text-[var(--soft-teal)]">{entry.prediction.nextBestAction}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="hidden md:block">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-sm text-[var(--muted-mauve)]">Parent ID</th>
                  <th className="text-left py-3 px-4 text-sm text-[var(--muted-mauve)]">Baby</th>
                  <th className="text-left py-3 px-4 text-sm text-[var(--muted-mauve)]">Predicted Stage</th>
                  <th className="text-left py-3 px-4 text-sm text-[var(--muted-mauve)]">Last Key Purchase</th>
                  <th className="text-left py-3 px-4 text-sm text-[var(--muted-mauve)]">Days Silent</th>
                  <th className="text-left py-3 px-4 text-sm text-[var(--muted-mauve)]">Next Best Action</th>
                  <th className="text-left py-3 px-4 text-sm text-[var(--muted-mauve)]">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {familyTableRows.map((entry, idx) => (
                  <motion.tr
                    key={entry.family.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--blush-pink)]/20 cursor-pointer"
                    {...motionConfig.getReveal({ delay: 0.7 + idx * 0.05, direction: "left", distance: 20, duration: 0.45 })}
                    whileHover={motionConfig.prefersReducedMotion ? undefined : { x: 4 }}
                  >
                    <td className="py-4 px-4 text-sm text-[var(--deep-plum)]">{entry.family.id}</td>
                    <td className="py-4 px-4 text-sm text-[var(--deep-plum)]">
                      <div>{entry.family.babyName}</div>
                      <div className="text-xs text-[var(--muted-mauve)]">{entry.family.parentName}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[var(--deep-plum)]">{entry.prediction.nextStage}</td>
                    <td className="py-4 px-4 text-sm text-[var(--muted-mauve)]">{entry.lastPurchase}</td>
                    <td className="py-4 px-4 text-sm text-[var(--deep-plum)]">{entry.family.daysSilent}</td>
                    <td className="py-4 px-4 text-sm text-[var(--soft-teal)]">{entry.prediction.nextBestAction}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          entry.prediction.riskLevel === "High"
                            ? "bg-[var(--rose)]/10 text-[var(--rose)]"
                            : entry.prediction.riskLevel === "Medium"
                              ? "bg-[var(--coral)]/10 text-[var(--coral)]"
                              : "bg-[var(--soft-teal)]/10 text-[var(--soft-teal)]"
                        }`}
                      >
                        {entry.prediction.riskLevel}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Template-Based Journey Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="rounded-3xl border border-[rgba(165,13,37,0.08)] bg-[linear-gradient(160deg,rgba(255,248,245,0.98),rgba(244,178,176,0.34))] p-6 sm:p-8"
            {...motionConfig.getReveal({ delay: 0.8 })}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[var(--rose)]" />
              </div>
              <h2 className="text-xl text-[var(--deep-plum)]">Template-Based Journey Generator</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--muted-mauve)] mb-2 block">Baby Stage</label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-white/60 text-[var(--deep-plum)]"
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-[var(--muted-mauve)] mb-2 block">Journey Tone</label>
                  <select
                    className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-white/60 text-[var(--deep-plum)]"
                    value={selectedTone}
                    onChange={(event) => setSelectedTone(event.target.value as JourneyTone)}
                  >
                    <option value="gentle">Gentle</option>
                    <option value="premium">Premium</option>
                    <option value="offer-led">Offer-led</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[var(--muted-mauve)] mb-2 block">Channel</label>
                  <select
                    className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-white/60 text-[var(--deep-plum)]"
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
                className="mumz-primary-button w-full rounded-full px-6 py-4 text-white"
                whileHover={motionConfig.buttonHoverStrong}
                whileTap={motionConfig.gentleTap}
                onClick={handleGenerateJourney}
                disabled={isGenerating}
                aria-busy={isGenerating}
              >
                {isGenerating ? "Preparing Journey..." : "Generate Journey"}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="mumz-card rounded-3xl p-6 sm:p-8"
            {...motionConfig.getReveal({ delay: 0.9 })}
          >
            <h3 className="text-lg text-[var(--deep-plum)] mb-4">Template Preview</h3>
            {isGenerating ? (
              <div className="space-y-3" role="status" aria-live="polite">
                {LOADING_STEPS.map((step, index) => {
                  const isActive = index === loadingStepIndex;
                  const isComplete = index < loadingStepIndex;

                  return (
                    <motion.div
                      key={step}
                      className={`p-4 rounded-2xl border ${
                        isActive
                          ? "bg-[var(--blush-pink)]/30 border-[var(--rose)]/20"
                          : isComplete
                            ? "bg-[var(--soft-mint)]/20 border-[var(--soft-teal)]/20"
                            : "bg-[var(--warm-ivory)] border-[var(--border)]"
                      }`}
                      {...motionConfig.getReveal({ direction: "up", distance: 8, duration: 0.35 })}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete ? "bg-[var(--soft-teal)] text-white" : isActive ? "bg-[var(--rose)] text-white" : "bg-white text-[var(--muted-mauve)]"}`}>
                          {isComplete ? "Done" : index + 1}
                        </div>
                        <p className="text-[var(--deep-plum)]">{step}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : generatedJourney ? (
              <div className="space-y-4" aria-live="polite">
                <div className="p-5 rounded-2xl bg-[var(--blush-pink)]/30 border border-[var(--border)]">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-[var(--muted-mauve)]">{generatedJourney.babyName}</span>
                    <span className="text-xs text-[var(--muted-mauve)]">&middot;</span>
                    <span className="text-xs text-[var(--muted-mauve)]">{generatedJourney.stage}</span>
                    <span className="text-xs text-[var(--muted-mauve)]">&middot;</span>
                    <span className="text-xs text-[var(--muted-mauve)]">{generatedJourney.channel}</span>
                  </div>
                  <p className="text-lg text-[var(--deep-plum)] mb-2">{generatedJourney.card.title}</p>
                  <p className="text-[var(--deep-plum)] leading-relaxed">{generatedJourney.card.body}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {generatedJourney.card.recommendedCategories.map((category) => (
                      <span key={category} className="px-3 py-1 rounded-full bg-white/70 text-xs text-[var(--deep-plum)]">
                        {category}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--rose)] mt-4">{generatedJourney.card.gentleCTA}</p>
                </div>
              </div>
            ) : (
              <div className="mumz-empty-state rounded-2xl p-5" role="note">
                <p className="mb-2 text-[var(--deep-plum)]">Choose a stage to preview the next journey.</p>
                <p className="text-[var(--muted-mauve)] leading-relaxed">
                  Select a stage, tone, and channel to prepare an English-only lifecycle template from local rules.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Explainability */}
        <motion.div
          className="mumz-card rounded-3xl p-6 sm:p-8"
          {...motionConfig.getReveal({ delay: 1 })}
        >
          <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--soft-mint)] to-[var(--powder-blue)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--soft-teal)]" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--deep-plum)]">Explainability / No AI API</h2>
                <span className="text-sm text-[var(--muted-mauve)]">Example signals from {explainabilityExample.family.parentName} and {explainabilityExample.family.babyName}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {explainabilityExample.prediction.explanationSignals.map((reason, idx) => (
              <motion.div
                key={reason}
                className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--blush-pink)]/20 border border-[var(--border)]"
                {...motionConfig.getReveal({ delay: 1.1 + idx * 0.1, direction: "scale", scale: 0.95 })}
                whileHover={motionConfig.buttonHover}
              >
                <div className="w-6 h-6 rounded-full bg-[var(--rose)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChevronRight className="w-4 h-4 text-[var(--rose)]" />
                </div>
                <p className="text-sm text-[var(--deep-plum)]">{reason}</p>
              </motion.div>
            ))}
          </div>
          <div className="rounded-2xl bg-[var(--warm-ivory)] border border-[var(--border)] p-5 space-y-3">
            <p className="text-[var(--deep-plum)]">
              This prototype uses local mock data, deterministic lifecycle rules, confidence scoring, and English-only journey templates. It does not call external AI APIs.
            </p>
            <p className="text-[var(--muted-mauve)]">
              Arabic localization can be added later with verified translations.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
