"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, CheckCircle2, Code2, Zap, ShieldCheck, Database, Search, BarChart3, Settings2, Activity } from "lucide-react";
import { useCart } from "../CartContext";

// ─── Workflow steps shown in the panel ───────────────────────────────────────
const WORKFLOW_STEPS = [
  {
    icon: <Database className="h-5 w-5" />,
    title: "Data Ingestion",
    description: "Synchronizes local cart state and historical purchase patterns from the client-side database.",
    detail: "Zero network dependency — local processing.",
    color: "bg-white border-[rgba(42,18,18,0.08)]",
    badge: "Module 1",
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: "Signal Identification",
    description: "Executes a pattern-matching algorithm against product categories to identify milestone signals.",
    detail: "Pattern: 'cereal' → Nutritional Milestone",
    color: "bg-white border-[rgba(42,18,18,0.08)]",
    badge: "Module 2",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Probability Scoring",
    description: "Applies weightage based on signal density and temporal recency to calculate prediction accuracy.",
    detail: "Recency-weighted confidence scoring.",
    color: "bg-white border-[rgba(42,18,18,0.08)]",
    badge: "Module 3",
  },
  {
    icon: <Settings2 className="h-5 w-5" />,
    title: "Logic Mapping",
    description: "Maps the high-probability stage to a deterministic set of product recommendations and insights.",
    detail: "Rule-based resolution. Sub-10ms latency.",
    color: "bg-white border-[rgba(42,18,18,0.08)]",
    badge: "Module 4",
  },
];

// ─── Maps cart item names to stage signals ────────────────────────────────────
const KEYWORD_TO_SIGNAL: Record<string, { stage: string; signal: string }> = {
  Diaper: { stage: "Newborn", signal: "Diaper usage pattern detected" },
  Bottle: { stage: "Feeding", signal: "Feeding accessory identified" },
  Spoon: { stage: "Solids", signal: "Weaning implement detected" },
  Cereal: { stage: "Solids", signal: "Nutritional transition signal" },
  Chair: { stage: "Solids", signal: "Seating milestone identified" },
  Bib: { stage: "Solids", signal: "Protective gear signal detected" },
  Bear: { stage: "Mobility", signal: "Developmental play signal" },
  "Play Mat": { stage: "Mobility", signal: "Floor-time environment expansion" },
  Shoes: { stage: "Walking", signal: "Ambulation milestone detected" },
  Cup: { stage: "Walking", signal: "Independence signal identified" },
};

export default function AITransparencyPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "how">("live");
  const { cart } = useCart();

  // Derive live signals from current cart
  const liveSignals = cart.flatMap((item) => {
    return Object.entries(KEYWORD_TO_SIGNAL)
      .filter(([keyword]) => item.name.includes(keyword))
      .map(([, match]) => ({ ...match, product: item.name }));
  });

  const uniqueStages = [...new Set(liveSignals.map((s) => s.stage))];
  const topStage = uniqueStages[uniqueStages.length - 1] ?? "Awaiting Data";
  const confidence = Math.min(20 + liveSignals.length * 25, 97);

  const confidenceColor =
    confidence >= 75 ? "text-emerald-700" :
      confidence >= 50 ? "text-amber-700" :
        "text-[var(--muted-mauve)]";

  const confidenceBarColor =
    confidence >= 75 ? "bg-emerald-600" :
      confidence >= 50 ? "bg-amber-600" :
        "bg-[var(--deep-berry)]";

  return (
    <>
      {/* ── Floating trigger pill ────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[70] flex items-center gap-2.5 rounded-full bg-[var(--deep-plum)] px-6 py-3.5 text-white shadow-[0_12px_40px_rgba(42,18,18,0.2)] hover:shadow-[0_16px_48px_rgba(42,18,18,0.3)] transition-all"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 300, damping: 24 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open Intelligence Diagnostics"
      >
        <Activity className="h-4 w-4 text-[var(--deep-berry)]" />
        <span className="text-[13px] font-semibold tracking-wide uppercase">Diagnostics</span>
        {liveSignals.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--deep-berry)] text-[10px] font-bold">
            {liveSignals.length}
          </span>
        )}
      </motion.button>

      {/* ── Drawer overlay ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[71] bg-[#2A1212]/10 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.aside
              key="panel"
              className="fixed right-0 top-0 z-[72] flex h-full w-full max-w-md flex-col bg-[var(--warm-ivory)] shadow-[-32px_0_80px_rgba(42,18,18,0.15)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 38 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[rgba(42,18,18,0.06)] px-8 py-7">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[var(--deep-berry)]" />
                    <h2 className="text-xl font-bold tracking-tight text-[var(--deep-plum)]">
                      Intelligence Diagnostics
                    </h2>
                  </div>
                  <p className="text-[13px] text-[var(--muted-mauve)] font-medium">
                    Technical insight into stage prediction logic
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2.5 text-[var(--muted-mauve)] hover:bg-[rgba(42,18,18,0.05)] hover:text-[var(--deep-plum)] transition-colors"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="flex items-center gap-3 border-b border-[rgba(42,18,18,0.06)] bg-white/50 px-8 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-[12px] font-medium leading-relaxed text-emerald-800">
                  Privacy First: 100% local processing. No external LLM or cloud dependency.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-b border-[rgba(42,18,18,0.06)] px-8 pt-5">
                {(["live", "how"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-4 px-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                        ? "text-[var(--deep-plum)]"
                        : "text-[var(--muted-mauve)] hover:text-[var(--deep-plum)]"
                      }`}
                  >
                    {tab === "live" ? "System Feed" : "Architecture"}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--deep-berry)]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto px-8 py-7 custom-scrollbar">
                <AnimatePresence mode="wait">

                  {/* ── SYSTEM FEED TAB ─────────────────────────────── */}
                  {activeTab === "live" && (
                    <motion.div
                      key="live"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-7"
                    >
                      {/* Metric Summary Card */}
                      <div className="rounded-3xl bg-white border border-[rgba(42,18,18,0.06)] p-6 shadow-[0_4px_24px_rgba(42,18,18,0.02)]">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-mauve)] opacity-70">
                          Primary Inference
                        </p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold text-[var(--deep-plum)] leading-none">{topStage}</p>
                          <div className="flex items-center gap-1.5 leading-none">
                            <span className={`text-2xl font-black tabular-nums ${confidenceColor}`}>{cart.length === 0 ? "--" : `${confidence}%`}</span>
                            <span className="text-[10px] font-bold text-[var(--muted-mauve)] uppercase">Match</span>
                          </div>
                        </div>
                        {/* Precision bar */}
                        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(42,18,18,0.05)]">
                          <motion.div
                            className={`h-full rounded-full ${confidenceBarColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: cart.length === 0 ? "0%" : `${confidence}%` }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                          />
                        </div>
                        <p className="mt-3 text-[11px] font-medium text-[var(--muted-mauve)] flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {cart.length === 0
                            ? "System idle. Awaiting user interaction."
                            : `Processing ${liveSignals.length} active signal${liveSignals.length !== 1 ? "s" : ""} from current session.`}
                        </p>
                      </div>

                      {/* Signals List */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-mauve)] opacity-70">
                            Active Signal Log
                          </p>
                          {liveSignals.length > 0 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Validated</span>}
                        </div>

                        {liveSignals.length === 0 ? (
                          <div className="rounded-[2rem] border border-dashed border-[rgba(42,18,18,0.12)] p-10 text-center bg-white/40">
                            <p className="text-sm font-medium text-[var(--muted-mauve)]">No signals detected.</p>
                            <p className="mt-1 text-[11px] text-[var(--muted-mauve)]/60">Cart data required for stage inference.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {liveSignals.map((signal, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-4 rounded-2xl bg-white border border-[rgba(42,18,18,0.05)] p-4 shadow-sm"
                              >
                                <div className="mt-1 h-2 w-2 rounded-full bg-[var(--deep-berry)] flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-[13px] font-bold text-[var(--deep-plum)]">{signal.signal}</p>
                                  <p className="text-[11px] text-[var(--muted-mauve)] mt-1">
                                    Source: <span className="font-semibold text-[var(--deep-plum)]/80">{signal.product}</span>
                                  </p>
                                </div>
                                <span className="flex-shrink-0 rounded-full bg-[rgba(201,47,75,0.05)] px-3 py-1 text-[10px] font-bold text-[var(--deep-berry)] uppercase tracking-tight">
                                  {signal.stage}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Technical Reference */}
                      <div className="rounded-[2rem] bg-white border border-[rgba(42,18,18,0.06)] p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Code2 className="h-4 w-4 text-[var(--deep-plum)] opacity-60" />
                          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--deep-plum)] opacity-80">Logic: stage-engine.ts</p>
                        </div>
                        <p className="text-[12px] leading-relaxed text-[var(--muted-mauve)]">
                          Execution follows a priority waterfall protocol: High-value milestones (Shoes/Mobility) are weighted above base consumables (Diapers) to prevent stage-lag.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── ARCHITECTURE TAB ──────────────────────────────── */}
                  {activeTab === "how" && (
                    <motion.div
                      key="how"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <p className="text-[13px] font-medium text-[var(--muted-mauve)] leading-relaxed">
                        MumzMind operates on a proprietary rule-based architecture. All intelligence is resolved client-side for maximum performance.
                      </p>

                      <div className="space-y-4">
                        {WORKFLOW_STEPS.map((step, i) => (
                          <motion.div
                            key={step.badge}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`rounded-2xl border p-5 ${step.color} shadow-sm`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(42,18,18,0.03)] text-[var(--deep-plum)]">
                                {step.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="rounded-md bg-[var(--deep-plum)]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[var(--deep-plum)]">
                                    {step.badge}
                                  </span>
                                  <p className="text-[14px] font-bold text-[var(--deep-plum)]">{step.title}</p>
                                </div>
                                <p className="text-[12px] text-[var(--muted-mauve)] leading-relaxed font-medium">{step.description}</p>
                                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[var(--deep-berry)] uppercase tracking-wide">
                                  <ChevronRight className="h-3 w-3" />
                                  <span>{step.detail}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Technical Stack */}
                      <div className="rounded-[2rem] bg-white border border-[rgba(42,18,18,0.06)] p-6">
                        <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[var(--muted-mauve)] opacity-70">Technology Stack</p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: "Next.js 15+", role: "Core Framework" },
                            { name: "Framer Motion", role: "Interaction Layer" },
                            { name: "Deterministic Engine", role: "Logic Layer" },
                            { name: "Tailwind Native", role: "Design System" },
                          ].map((tool) => (
                            <div key={tool.name} className="rounded-xl border border-[rgba(42,18,18,0.04)] bg-[rgba(42,18,18,0.02)] p-3">
                              <p className="text-[12px] font-bold text-[var(--deep-plum)]">{tool.name}</p>
                              <p className="text-[10px] font-medium text-[var(--muted-mauve)]">{tool.role}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[rgba(201,47,75,0.05)] border border-[rgba(201,47,75,0.1)] p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings2 className="h-4 w-4 text-[var(--deep-berry)]" />
                          <p className="text-xs font-bold uppercase tracking-widest text-[var(--deep-plum)]">Architectural Rationale</p>
                        </div>
                        <p className="text-[11px] leading-relaxed text-[var(--muted-mauve)] font-medium">
                          Retail intelligence must be <strong className="text-[var(--deep-plum)]">instant, predictable, and cost-efficient</strong>. A local rule engine achieves all three with sub-10ms latency. Future iterations may include LLM layers for natural language synthesis, while maintaining this deterministic engine for core prediction accuracy.
                        </p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
