"use client";

import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";

import familiesData from "../data/families.json";
import { usePageMotion } from "../hooks/usePageMotion";
import { predictBabyStage } from "../lib/stage-engine";
import type { FamilyProfile } from "../types";
import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";

const RECOMMENDED_PRODUCTS = [
  {
    name: "Ergonomic High Chair",
    description: "Comfortable, easy-to-clean design that grows with your baby.",
    price: "$129.99",
    iconName: "chair" as PremiumBabyIconName,
  },
  {
    name: "Silicone Catch Bibs",
    description: "Set of 2 food-grade silicone bibs to catch all the mess.",
    price: "$18.50",
    iconName: "bib" as PremiumBabyIconName,
  },
  {
    name: "Soft-Tip Feeding Spoons",
    description: "Gentle on gums and perfect for tiny mouths.",
    price: "$12.99",
    iconName: "spoon" as PremiumBabyIconName,
  },
  {
    name: "Organic Baby Rice Cereal",
    description: "The perfect gentle first food, fortified with iron.",
    price: "$9.99",
    iconName: "cereal" as PremiumBabyIconName,
  },
];

const EXPERT_TIPS = [
  "Start slowly with just one simple puree at a time.",
  "Expect a mess! Exploring food with their hands is part of learning.",
  "If they reject a food, try again in a few days. Taste buds change rapidly.",
];

export default function StageDetail({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const motionConfig = usePageMotion();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const families = familiesData as FamilyProfile[];
  const family =
    families.find((entry) => entry.parentName === "Sara" && entry.babyName === "Baby") ??
    families[0];
  const prediction = predictBabyStage(family);

  const toggleItem = (name: string) => {
    setAddedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--warm-ivory)] pb-24">
      {/* Premium Background */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div
          className="absolute left-0 top-0 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(248,216,213,0.6), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(243,230,220,0.8), transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-12">

        {/* Navigation */}
        <button
          onClick={() => onNavigate("timeline")}
          className="flex items-center gap-2 text-[var(--muted-mauve)] hover:text-[var(--deep-plum)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Timeline
        </button>

        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          {...motionConfig.getReveal({ direction: "down", duration: 0.5 })}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(248,216,213,0.5)] px-4 py-2 text-sm text-[var(--deep-berry)] mb-6 border border-[rgba(201,47,75,0.08)]">
            <Sparkles className="h-4 w-4" />
            <span>Milestone Guide</span>
          </div>

          <h1 className="text-[3rem] sm:text-[4rem] text-[var(--deep-plum)] leading-tight">
            {prediction.nextStage}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted-mauve)] max-w-2xl mx-auto leading-relaxed">
            Your baby is getting ready for a whole new world of flavors and textures. Here is your curated guide to make the transition smooth, clean, and fun.
          </p>
        </motion.div>

        {/* The Essentials Shop */}
        <motion.section
          className="mb-16"
          {...motionConfig.getReveal({ delay: 0.1, duration: 0.5 })}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium text-[var(--deep-plum)]">The Essentials Checklist</h2>
            <div className="text-sm text-[var(--muted-mauve)]">
              {addedItems.size} of {RECOMMENDED_PRODUCTS.length} added to cart
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {RECOMMENDED_PRODUCTS.map((product, index) => {
              const isAdded = addedItems.has(product.name);
              return (
                <motion.div
                  key={product.name}
                  className={`relative flex flex-col p-5 rounded-[1.5rem] border transition-all duration-300 ${isAdded
                      ? "bg-white border-[rgba(201,47,75,0.2)] shadow-[0_8px_20px_rgba(201,47,75,0.06)]"
                      : "bg-[rgba(255,251,247,0.8)] border-[rgba(42,18,18,0.05)] hover:shadow-md"
                    }`}
                  {...motionConfig.getReveal({ delay: 0.15 + index * 0.05, direction: "up", distance: 10 })}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm border border-[rgba(42,18,18,0.02)] p-2">
                      <PremiumBabyIcon name={product.iconName} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--deep-plum)] text-lg">{product.name}</h3>
                      <p className="text-[var(--deep-berry)] font-semibold mt-1">{product.price}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-mauve)] mb-5 flex-grow">
                    {product.description}
                  </p>
                  <button
                    onClick={() => toggleItem(product.name)}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-colors ${isAdded
                        ? "bg-[rgba(201,47,75,0.08)] text-[var(--deep-berry)]"
                        : "bg-[var(--deep-plum)] text-white hover:bg-[#2A1212]"
                      }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Add to Cart
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Quick Tips */}
        <motion.section
          className="rounded-[2rem] bg-white border border-[rgba(42,18,18,0.04)] p-8 sm:p-10 shadow-[0_20px_40px_rgba(42,18,18,0.03)]"
          {...motionConfig.getReveal({ delay: 0.3, duration: 0.5 })}
        >
          <h2 className="text-2xl font-medium text-[var(--deep-plum)] mb-6 text-center">
            Quick Tips for {prediction.nextStage}
          </h2>
          <div className="grid gap-4">
            {EXPERT_TIPS.map((tip, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-[rgba(255,251,247,0.8)] border border-[rgba(42,18,18,0.03)]">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(248,216,213,0.5)] text-[var(--deep-berry)] font-medium">
                  {index + 1}
                </div>
                <p className="text-[var(--deep-plum)] pt-1">{tip}</p>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
