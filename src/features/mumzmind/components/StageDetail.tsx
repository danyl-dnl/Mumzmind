"use client";

import { motion } from "motion/react";
import { ArrowLeft, Star, Heart, TrendingUp, ShoppingCart, MessageCircle, Globe, Sparkles } from "lucide-react";

import familiesData from "../data/families.json";
import recommendationsData from "../data/recommendations.json";
import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";
import { usePageMotion } from "../hooks/usePageMotion";
import { generateJourneyCard } from "../lib/journey-templates";
import { predictBabyStage } from "../lib/stage-engine";
import type { FamilyProfile, StageRecommendation } from "../types";

type EssentialCard = {
  name: string;
  iconName: PremiumBabyIconName;
  color: string;
};

type ProductCard = {
  name: string;
  rating: number;
  reviews: number;
  price: string;
  reason: string;
  iconName: PremiumBabyIconName;
};

const CATEGORY_VISUALS: Record<string, { icon: string; color: string; productName: string; price: string }> = {
  "Baby cereal": {
    icon: "🥣",
    color: "var(--soft-mint)",
    productName: "Organic Baby Rice Cereal",
    price: "AED 42",
  },
  "Soft spoons": {
    icon: "🥄",
    color: "var(--pale-peach)",
    productName: "Soft Silicone Feeding Spoons",
    price: "AED 28",
  },
  Bibs: {
    icon: "👕",
    color: "var(--blush-pink)",
    productName: "Waterproof Feeding Bibs",
    price: "AED 35",
  },
  "High chair": {
    icon: "🪑",
    color: "var(--mist-lavender)",
    productName: "Adjustable High Chair",
    price: "AED 385",
  },
  "Sippy cup": {
    icon: "🍼",
    color: "var(--powder-blue)",
    productName: "First Sips Training Cup",
    price: "AED 32",
  },
  "Feeding bottle": {
    icon: "🍼",
    color: "var(--powder-blue)",
    productName: "Anti-Colic Feeding Bottle Set",
    price: "AED 74",
  },
  "Crawling toys": {
    icon: "🧸",
    color: "var(--warm-sand)",
    productName: "Crawling Sensory Toy Set",
    price: "AED 67",
  },
  "Play mat": {
    icon: "🧩",
    color: "var(--soft-mint)",
    productName: "Comfort Play Mat",
    price: "AED 129",
  },
  "Baby-proofing essentials": {
    icon: "🏠",
    color: "var(--mist-lavender)",
    productName: "Starter Safety Kit",
    price: "AED 88",
  },
  "First walker shoes": {
    icon: "👟",
    color: "var(--powder-blue)",
    productName: "Soft Sole First Walker Shoes",
    price: "AED 79",
  },
  "Toddler socks": {
    icon: "🧦",
    color: "var(--pale-peach)",
    productName: "Soft Grip Socks",
    price: "AED 26",
  },
  "Outdoor stroller accessories": {
    icon: "🌤️",
    color: "var(--warm-sand)",
    productName: "Stroller Travel Caddy",
    price: "AED 54",
  },
  "Everyday essentials": {
    icon: "✨",
    color: "var(--blush-pink)",
    productName: "Parent Favorites Bundle",
    price: "AED 96",
  },
};

const CATEGORY_PREMIUM_ICON_MAP: Record<string, PremiumBabyIconName> = {
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
  "Everyday essentials": "newborn",
};

function buildEssentials(categories: string[]): EssentialCard[] {
  return categories.map((name, index) => {
    const fallbackColors = [
      "var(--pale-peach)",
      "var(--soft-mint)",
      "var(--blush-pink)",
      "var(--mist-lavender)",
      "var(--powder-blue)",
      "var(--warm-sand)",
    ];
    const visual = CATEGORY_VISUALS[name] ?? {
      icon: "✨",
      color: fallbackColors[index % fallbackColors.length],
      productName: name,
      price: "AED 49",
    };

    return {
      name,
      iconName: CATEGORY_PREMIUM_ICON_MAP[name] ?? "newborn",
      color: visual.color,
    };
  });
}

function buildProducts(categories: string[], nextStage: string): ProductCard[] {
  return categories.slice(0, 4).map((category, index) => {
    const visual = CATEGORY_VISUALS[category] ?? CATEGORY_VISUALS["Everyday essentials"];

    return {
      name: visual.productName,
      rating: 4.7 + (index % 3) * 0.1,
      reviews: 980 + index * 620,
      price: visual.price,
      reason:
        index === 0
          ? `Frequently chosen for ${nextStage.toLowerCase()}`
          : index === 1
            ? "Often picked by parents preparing ahead"
            : index === 2
              ? "A practical favorite for this chapter"
              : "Helpful for a calm transition",
      iconName: CATEGORY_PREMIUM_ICON_MAP[category] ?? "newborn",
    };
  });
}

export default function StageDetail({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const motionConfig = usePageMotion();
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

  const recommendedCategories =
    recommendation?.recommendedCategories.map((category) =>
      category
        .split(" ")
        .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
        .join(" "),
    ) ?? prediction.recommendedCategories;
  const essentials = buildEssentials(recommendedCategories);
  const products = buildProducts(recommendedCategories, prediction.nextStage);

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--warm-ivory)]">
      {/* Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <motion.div
          className="absolute left-0 top-0 h-[340px] w-[340px] rounded-full sm:h-[600px] sm:w-[600px]"
          style={{ background: "radial-gradient(circle, rgba(244, 178, 176, 0.3), transparent)" }}
          animate={motionConfig.prefersReducedMotion ? undefined : { scale: [1, 1.3, 1], x: [0, 50, 0] }}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full sm:h-[500px] sm:w-[500px]"
          style={{ background: "radial-gradient(circle, rgba(222, 58, 87, 0.16), transparent)" }}
          animate={motionConfig.prefersReducedMotion ? undefined : { scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
          transition={motionConfig.prefersReducedMotion ? undefined : { duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 px-4 pb-6 pt-8 sm:px-6"
        {...motionConfig.getReveal({ direction: "down" })}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex items-start gap-4">
            <motion.button
              aria-label="Back to timeline"
              className="w-10 h-10 rounded-full bg-white/60 border border-[var(--border)] flex items-center justify-center"
              whileHover={motionConfig.iconButtonHover}
              whileTap={motionConfig.iconTap}
              onClick={() => onNavigate("timeline")}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--deep-plum)]" />
            </motion.button>
            <div>
              <h1 className="text-2xl text-[var(--deep-plum)] sm:text-3xl">Next Chapter: {prediction.nextStage}</h1>
              <p className="text-[var(--muted-mauve)]">
                {family.babyName}&rsquo;s predicted window is {prediction.nextStageWindow} with {prediction.confidence}% confidence
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 pb-16 sm:px-6">
        {/* Why This Matters */}
        <motion.div
          className="mumz-card rounded-3xl p-6 sm:p-8"
          {...motionConfig.getReveal({ delay: 0.2 })}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--blush-pink)] to-[var(--mist-lavender)] flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-[var(--rose)]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h2 className="text-xl text-[var(--deep-plum)]">Why this matters</h2>
                <span className="px-3 py-1 rounded-full bg-[var(--blush-pink)]/50 text-xs text-[var(--deep-plum)]">
                  Powered by local lifecycle rules — no AI API
                </span>
              </div>
              <p className="text-[var(--muted-mauve)] leading-relaxed mb-4">
                {recommendation?.message ??
                  `${family.babyName}&rsquo;s next chapter looks like ${prediction.nextStage.toLowerCase()}. Gentle preparation can make the transition feel calmer and easier.`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prediction.explanationSignals.map((signal, index) => (
                  <motion.div
                    key={signal}
                    className="flex items-start gap-3 rounded-2xl bg-[var(--warm-ivory)] px-4 py-3"
                    {...motionConfig.getReveal({ delay: 0.3 + index * 0.08, direction: "left", distance: 20 })}
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-[var(--rose)]" />
                    <p className="text-sm text-[var(--muted-mauve)]">{signal}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommended Essentials */}
        <motion.div
          className="mumz-card rounded-3xl p-6 sm:p-8"
          {...motionConfig.getReveal({ delay: 0.3 })}
        >
          <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl text-[var(--deep-plum)]">Recommended essentials</h2>
            <span className="text-sm text-[var(--muted-mauve)]">Next best action: {prediction.nextBestAction}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {essentials.map((item, idx) => (
              <motion.div
                key={item.name}
                className="cursor-pointer rounded-2xl border border-[var(--border)] p-4 text-center sm:p-6"
                style={{ backgroundColor: item.color }}
                {...motionConfig.getReveal({ delay: 0.4 + idx * 0.1, direction: "scale", scale: 0.9 })}
                whileHover={motionConfig.cardHoverScale}
              >
                <div className="mb-3 flex justify-center">
                  <PremiumBabyIcon name={item.iconName} className="h-12 w-12 sm:h-14 sm:w-14" />
                </div>
                <p className="text-sm text-[var(--deep-plum)]">{item.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Parent-Loved Picks */}
        <motion.div
          className="rounded-3xl border border-white/40 bg-gradient-to-br from-[var(--pale-peach)] to-[var(--blush-pink)] p-6 sm:p-8"
          {...motionConfig.getReveal({ delay: 0.5 })}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
              <Star className="w-5 h-5 text-[var(--coral)]" fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl text-[var(--deep-plum)]">Parent-loved picks</h2>
              <p className="text-sm text-[var(--muted-mauve)]">{family.babyName}&rsquo;s likely stage: {prediction.nextStage}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={product.name}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/60"
                {...motionConfig.getReveal({ delay: 0.6 + idx * 0.1, direction: "left", distance: 20 })}
                whileHover={motionConfig.cardHover}
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--blush-pink)] to-[var(--mist-lavender)] sm:flex-shrink-0">
                    <PremiumBabyIcon name={product.iconName} className="h-12 w-12" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[var(--deep-plum)] mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-[var(--coral)]" : "text-gray-300"}`}
                            fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[var(--muted-mauve)]">
                        {product.rating.toFixed(1)} ({product.reviews.toLocaleString()})
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted-mauve)] mb-3">{product.reason}</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg text-[var(--rose)]">{product.price}</p>
                      <motion.button
                        aria-label={`Add ${product.name}`}
                        className="mumz-primary-button rounded-full px-4 py-2 text-sm text-white"
                        whileHover={motionConfig.buttonHoverStrong}
                        whileTap={motionConfig.gentleTap}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Helpful Guide */}
        <motion.div
          className="mumz-card rounded-3xl p-6 sm:p-8"
          {...motionConfig.getReveal({ delay: 0.8 })}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-1 items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--soft-mint)] to-[var(--powder-blue)] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-[var(--soft-teal)]" />
              </div>
              <div>
                <h2 className="text-xl text-[var(--deep-plum)] mb-2">Helpful guide</h2>
                <p className="text-[var(--muted-mauve)] mb-4">
                  {prediction.nextBestAction}. A few calm steps can make {prediction.nextStage.toLowerCase()} feel more manageable.
                </p>
                <ul className="space-y-2 text-[var(--muted-mauve)]">
                  {prediction.explanationSignals.slice(0, 4).map((signal) => (
                    <li key={signal} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--soft-teal)]" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <motion.button
              className="mumz-subtle-button w-full rounded-full px-6 py-3 text-[var(--deep-plum)] lg:w-auto"
              whileHover={motionConfig.buttonHover}
              whileTap={motionConfig.gentleTap}
            >
              Read Full Guide
            </motion.button>
          </div>
        </motion.div>

        {/* English-Only Template Journey Card */}
        <motion.div
          className="rounded-3xl border border-white/40 bg-gradient-to-br from-[var(--mist-lavender)] to-[var(--powder-blue)] p-6 sm:p-8"
          {...motionConfig.getReveal({ delay: 1 })}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
              <Globe className="w-6 h-6 text-[var(--deep-plum)]" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <h2 className="text-xl text-[var(--deep-plum)]">Next Chapter journey card</h2>
                <span className="px-3 py-1 rounded-full bg-white/70 text-xs text-[var(--deep-plum)]">English-only template</span>
              </div>
              <div className="space-y-4">
                <div className="bg-white/90 rounded-2xl p-5 border border-white/60">
                  <p className="text-sm text-[var(--muted-mauve)] mb-1">Journey preview</p>
                  <p className="text-lg text-[var(--deep-plum)] mb-2">{journeyCard.title}</p>
                  <p className="text-[var(--deep-plum)] leading-relaxed mb-4">{journeyCard.body}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {journeyCard.recommendedCategories.map((category) => (
                      <span key={category} className="px-3 py-1 rounded-full bg-[var(--warm-ivory)] text-xs text-[var(--deep-plum)]">
                        {category}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--rose)]">{journeyCard.gentleCTA}</p>
                </div>
                <div className="bg-white/90 rounded-2xl p-5 border border-white/60">
                  <p className="text-sm text-[var(--muted-mauve)] mb-1">Future scope</p>
                  <p className="text-[var(--deep-plum)] leading-relaxed">
                    Arabic localization can be added later with verified translations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          {...motionConfig.getReveal({ delay: 1.2, distance: 20 })}
        >
          <motion.button
            className="mumz-primary-button flex-1 rounded-full px-8 py-4 text-lg text-white"
            whileHover={motionConfig.buttonHoverStrong}
            whileTap={motionConfig.gentleTap}
          >
            Add starter bundle
          </motion.button>
          <motion.button
            className="mumz-secondary-button flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[var(--deep-plum)]"
            whileHover={motionConfig.buttonHover}
            whileTap={motionConfig.gentleTap}
          >
            <MessageCircle className="w-5 h-5" />
            Send to WhatsApp
          </motion.button>
          <motion.button
            className="mumz-secondary-button flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[var(--deep-plum)]"
            whileHover={motionConfig.buttonHover}
            whileTap={motionConfig.gentleTap}
          >
            <Sparkles className="w-5 h-5" />
            Review template preview
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
