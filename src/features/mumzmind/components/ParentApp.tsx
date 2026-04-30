"use client";

import { motion } from "motion/react";
import {
  Home,
  TrendingUp,
  ShoppingBag,
  BookOpen,
  User,
  Sparkles,
  Calendar,
  Heart,
  Edit,
} from "lucide-react";
import { useState } from "react";

import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";
import familiesData from "../data/families.json";
import { usePageMotion } from "../hooks/usePageMotion";
import { generateJourneyCard } from "../lib/journey-templates";
import { predictBabyStage } from "../lib/stage-engine";
import type { FamilyProfile } from "../types";

const CATEGORY_VISUALS = [
  { icon: "🥣", color: "var(--pale-peach)" },
  { icon: "🥄", color: "var(--soft-mint)" },
  { icon: "👕", color: "var(--blush-pink)" },
  { icon: "🪑", color: "var(--mist-lavender)" },
  { icon: "🍼", color: "var(--powder-blue)" },
  { icon: "🧸", color: "var(--warm-sand)" },
];

const CATEGORY_PREMIUM_ICON_MAP: Record<string, PremiumBabyIconName> = {
  "Baby cereal": "cereal",
  "Soft spoons": "spoon",
  Bibs: "bib",
  "High chair": "chair",
  "Sippy cup": "cup",
  "Feeding bottle": "bottle",
  "Size 3 diapers": "diaper",
  "Crawling toys": "teddy",
  "Play mat": "playmat",
  "Baby-proofing essentials": "safety",
  "First walker shoes": "shoe",
  "Toddler socks": "socks",
  "Outdoor stroller accessories": "stroller",
};

const CATEGORY_FALLBACK_ICONS: PremiumBabyIconName[] = ["cereal", "spoon", "bib", "chair", "cup", "teddy"];

export default function ParentApp({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [activeTab, setActiveTab] = useState("home");
  const motionConfig = usePageMotion();

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

  const categories = prediction.recommendedCategories.map((name, index) => ({
    name,
    iconName: CATEGORY_PREMIUM_ICON_MAP[name] ?? CATEGORY_FALLBACK_ICONS[index % CATEGORY_FALLBACK_ICONS.length],
    color: CATEGORY_VISUALS[index % CATEGORY_VISUALS.length].color,
  }));

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "timeline", icon: TrendingUp, label: "Timeline" },
    { id: "shop", icon: ShoppingBag, label: "Shop" },
    { id: "guides", icon: BookOpen, label: "Guides" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--warm-ivory)] pb-24">
      {/* Ambient Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <motion.div
          className="absolute right-0 top-0 h-72 w-72 rounded-full sm:h-96 sm:w-96"
          style={{ background: "radial-gradient(circle, rgba(244, 178, 176, 0.3), transparent)" }}
          animate={motionConfig.floatAmbient}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-72 w-72 rounded-full sm:h-96 sm:w-96"
          style={{ background: "radial-gradient(circle, rgba(222, 58, 87, 0.16), transparent)" }}
          animate={motionConfig.floatAmbient}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 px-4 pb-6 pt-8 sm:px-6"
        {...motionConfig.getReveal({ direction: "down", duration: 0.6 })}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <motion.h1
              className="mb-1 text-2xl text-[var(--deep-plum)] sm:text-3xl"
              {...motionConfig.getReveal({ delay: 0.2, duration: 0.5 })}
            >
              Good morning, {family.parentName}
            </motion.h1>
            <motion.p
              className="text-[var(--muted-mauve)]"
              {...motionConfig.getReveal({ delay: 0.3, duration: 0.5 })}
            >
              MumzMind has prepared {family.babyName}&rsquo;s next chapter
            </motion.p>
          </div>
          <motion.button
            aria-label="Open parent profile"
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white/60 backdrop-blur-sm"
            whileHover={motionConfig.iconButtonHover}
            whileTap={motionConfig.iconTap}
          >
            <User className="w-5 h-5 text-[var(--deep-plum)]" />
          </motion.button>
        </div>

        {/* Baby Profile Chip */}
        <motion.div
          className="inline-flex flex-wrap items-center gap-3 px-5 py-3 rounded-full bg-white/80 backdrop-blur-md border border-[var(--border)] shadow-lg"
          {...motionConfig.getReveal({ delay: 0.4, direction: "scale", scale: 0.94 })}
          whileHover={motionConfig.buttonHover}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--coral)]">
            <PremiumBabyIcon name="newborn" className="h-6 w-6" />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-[var(--deep-plum)]">{family.babyName}</span>
            <span className="text-[var(--muted-mauve)]">&middot;</span>
            <span className="text-[var(--muted-mauve)]">Predicted age: {prediction.predictedAgeMonths} months</span>
            <span className="text-[var(--muted-mauve)]">&middot;</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[var(--soft-teal)]" />
              <span className="text-[var(--soft-teal)]">{prediction.confidence}% confidence</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6 px-4 sm:px-6">
        {/* Main Next Chapter Card */}
        <motion.div
          className="mumz-card relative overflow-hidden rounded-3xl p-6 sm:p-8"
          {...motionConfig.getReveal({ delay: 0.5 })}
          whileHover={motionConfig.cardHover}
        >
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(244,178,176,0.42),transparent_62%)] opacity-80 sm:h-64 sm:w-64" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6 gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[var(--rose)]" />
                  <span className="text-sm text-[var(--rose)]">Your baby&rsquo;s next chapter</span>
                  <span className="mumz-badge rounded-full px-3 py-1 text-xs text-[var(--deep-plum)]">
                    Prepared with local lifecycle rules
                  </span>
                </div>
                <h2 className="text-2xl text-[var(--deep-plum)] mb-3">{journeyCard.title}</h2>
                <p className="text-[var(--muted-mauve)] leading-relaxed mb-4">{journeyCard.body}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-4 py-2 rounded-full bg-[var(--warm-ivory)] text-[var(--deep-plum)]">
                    Current stage: {prediction.currentStage}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-[var(--warm-ivory)] text-[var(--deep-plum)]">
                    Next stage: {prediction.nextStage}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-[var(--warm-ivory)] text-[var(--deep-plum)]">
                    Window: {prediction.nextStageWindow}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3 py-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {categories.map((category, idx) => (
                <motion.div
                  key={category.name}
                  className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] p-4 sm:p-6"
                  style={{ backgroundColor: category.color }}
                  {...motionConfig.getReveal({ delay: 0.7 + idx * 0.1, direction: "scale", scale: 0.9 })}
                  whileHover={motionConfig.cardHoverScale}
                >
                  <PremiumBabyIcon name={category.iconName} className="mb-2 h-10 w-10 sm:h-12 sm:w-12" />
                  <span className="text-sm text-center text-[var(--deep-plum)]">{category.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                className="mumz-primary-button flex-1 rounded-full px-6 py-3 text-white"
                whileHover={motionConfig.buttonHoverStrong}
                whileTap={motionConfig.gentleTap}
                onClick={() => onNavigate("stage")}
              >
                Explore This Stage
              </motion.button>
              <motion.button
                className="mumz-secondary-button rounded-full px-6 py-3 text-[var(--deep-plum)]"
                whileHover={motionConfig.buttonHover}
                whileTap={motionConfig.gentleTap}
              >
                {journeyCard.gentleCTA}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Recommended Categories Card */}
        <motion.div
          className="mumz-card rounded-3xl p-6"
          {...motionConfig.getReveal({ delay: 0.7 })}
          whileHover={motionConfig.cardHoverSoft}
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[var(--coral)]" />
            <h3 className="text-lg text-[var(--deep-plum)]">Helpful essentials for {prediction.nextStage}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 pb-1 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, idx) => (
              <motion.div
                key={category.name}
                className="rounded-2xl border border-[var(--border)] px-4 py-3 text-center"
                style={{ backgroundColor: category.color }}
                {...motionConfig.getReveal({ delay: 0.8 + idx * 0.1, direction: "left", distance: 20 })}
                whileHover={motionConfig.cardHoverScale}
              >
                <div className="mb-2 flex justify-center">
                  <PremiumBabyIcon name={category.iconName} className="h-9 w-9" />
                </div>
                <p className="text-sm text-[var(--deep-plum)]">{category.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Best Action Card */}
        <motion.div
          className="rounded-3xl border border-[rgba(165,13,37,0.08)] bg-[linear-gradient(160deg,rgba(255,248,245,0.98),rgba(244,178,176,0.36))] p-6"
          {...motionConfig.getReveal({ delay: 0.9 })}
          whileHover={motionConfig.cardHoverSoft}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-[var(--coral)]" />
            </div>
            <div>
              <h3 className="text-lg text-[var(--deep-plum)] mb-2">A calmer way to prepare</h3>
              <p className="text-[var(--deep-plum)] mb-2">{prediction.nextBestAction}</p>
              <p className="text-[var(--muted-mauve)]">
                {prediction.nextStage} may be coming in the next {prediction.nextStageWindow}. You&rsquo;ll always be able to adjust this if it doesn&rsquo;t feel right.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why We Think This Card */}
        <motion.div
          className="mumz-card rounded-3xl p-6"
          {...motionConfig.getReveal({ delay: 1.1 })}
          whileHover={motionConfig.cardHoverSoft}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--soft-mint)] to-[var(--powder-blue)] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[var(--soft-teal)]" />
                </div>
                <div>
                  <h3 className="text-lg text-[var(--deep-plum)]">Why this may be the right time</h3>
                  <p className="text-[var(--muted-mauve)]">Gentle signals based on {family.parentName} and {family.babyName}&rsquo;s recent shopping history</p>
                </div>
              </div>
              <div className="space-y-3">
                {prediction.explanationSignals.map((signal, index) => (
                  <motion.div
                    key={signal}
                    className="flex items-start gap-3 rounded-2xl bg-[var(--warm-ivory)] px-4 py-3"
                    {...motionConfig.getReveal({ delay: 1.15 + index * 0.08, direction: "left", distance: 20 })}
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-[var(--rose)]" />
                    <p className="text-[var(--muted-mauve)]">{signal}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Correction Card */}
        <motion.div
          className="mumz-card rounded-3xl p-6"
          {...motionConfig.getReveal({ delay: 1.3 })}
          whileHover={motionConfig.cardHoverSoft}
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Edit className="w-5 h-5 text-[var(--muted-mauve)] mt-0.5" />
              <div>
                <p className="text-[var(--deep-plum)] mb-1">This doesn&rsquo;t match my baby?</p>
                <p className="text-[var(--muted-mauve)]">
                  You&rsquo;re always in control. You can correct this stage anytime.
                </p>
              </div>
            </div>
            <motion.button
              className="mumz-subtle-button w-full rounded-full px-5 py-2 text-sm text-[var(--deep-plum)] sm:w-auto"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
            >
              Edit baby age
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-white/80 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4"
        {...motionConfig.getReveal({ delay: 0.6 })}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-1 sm:justify-around sm:gap-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-colors sm:flex-none sm:px-4 ${
                activeTab === item.id ? "text-[var(--rose)]" : "text-[var(--muted-mauve)]"
              }`}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === "timeline") {
                  onNavigate("timeline");
                }
              }}
              whileHover={motionConfig.iconButtonHover}
              whileTap={motionConfig.iconTap}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[11px] sm:text-xs">{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  className="w-1 h-1 rounded-full bg-[var(--rose)]"
                  layoutId="activeTab"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.nav>
    </div>
  );
}
