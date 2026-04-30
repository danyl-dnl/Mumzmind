"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Lock, ShoppingBag, Sparkles, CheckCircle2, Plus, Minus, CheckCircle, Edit3, X } from "lucide-react";
import { useState, useEffect } from "react";
import { PremiumBabyIcon, type PremiumBabyIconName } from "./PremiumBabyIcons";
import { useCart } from "../CartContext";

const STORE_ITEMS = [
  { id: 1, name: "Premium Diapers Size 3", price: 24.99, iconName: "diaper" as PremiumBabyIconName, desc: "Ultra-absorbent for active babies" },
  { id: 2, name: "Soft Silicone Spoons", price: 12.99, iconName: "spoon" as PremiumBabyIconName, desc: "Gentle on developing gums" },
  { id: 3, name: "First Foods Cereal Kit", price: 18.50, iconName: "cereal" as PremiumBabyIconName, desc: "Organic iron-fortified starter" },
  { id: 4, name: "Ergonomic High Chair", price: 129.99, iconName: "chair" as PremiumBabyIconName, desc: "Grows with your little one" },
  { id: 5, name: "Silicone Catch Bibs", price: 15.00, iconName: "bib" as PremiumBabyIconName, desc: "Mess-free feeding made easy" },
  { id: 6, name: "Crawling Bear Toy", price: 22.00, iconName: "teddy" as PremiumBabyIconName, desc: "Encourages movement and exploration" },
  { id: 7, name: "Luxury Play Mat", price: 45.00, iconName: "playmat" as PremiumBabyIconName, desc: "Non-toxic, soft tummy time surface" },
  { id: 8, name: "Anti-Colic Bottle Set", price: 34.00, iconName: "bottle" as PremiumBabyIconName, desc: "Natural flow for easy transition" },
  { id: 9, name: "First Walker Shoes", price: 29.99, iconName: "shoe" as PremiumBabyIconName, desc: "Flexible support for first steps" },
  { id: 10, name: "No-Spill Sippy Cup", price: 11.50, iconName: "cup" as PremiumBabyIconName, desc: "Perfect for independent drinking" },
];

const MILESTONES = [
  { month: 0, title: "Newborn", desc: "Care & Comfort", image: "/mumzmind/timeline/baby_stage_0.png", stageKey: "Newborn Care" },
  { month: 2, title: "Early Smiles", desc: "Discovery", image: "/mumzmind/timeline/baby_stage_2.png", stageKey: "Feeding Routine" },
  { month: 4, title: "Rolling", desc: "Movement", image: "/mumzmind/timeline/baby_stage_4.png", stageKey: "Crawling Prep" },
  { month: 6, title: "Sitting Up", desc: "Personality", image: "/mumzmind/timeline/baby_stage_6.png", stageKey: "Starting Solids" },
  { month: 8, title: "Crawling", desc: "Exploring", image: "/mumzmind/timeline/baby_stage_8.png", stageKey: "Crawling Prep" },
  { month: 12, title: "First Steps", desc: "Milestones", image: "/mumzmind/timeline/baby_stage_12.png", stageKey: "First Steps" },
];

export default function HeroLanding({ onNavigate, initialView = "store" }: { onNavigate: (screen: string) => void, initialView?: "store" | "cart" }) {
  const { cart, addToCart, decrementCart, clearCart, totalPrice, totalItems } = useCart();
  const [currentView, setCurrentView] = useState<"store" | "cart" | "extension">(initialView);
  const [isAdding, setIsAdding] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [manualAge, setManualAge] = useState<number | null>(null);
  const [showAgeInput, setShowAgeInput] = useState(false);

  const handleAddToCart = (item: typeof STORE_ITEMS[0]) => {
    setIsAdding(item.id);
    addToCart(item);
    setTimeout(() => setIsAdding(null), 800);
  };

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        setIsSuccess(false);
        setCurrentView("store");
      }, 3000);
    }, 2000);
  };

  const startCheckout = () => {
    setCurrentView("extension");
  };

  // Dynamic Prediction Logic
  const getPrediction = () => {
    // If manual age is set, use it to find the stage
    if (manualAge !== null) {
      if (manualAge < 2) return { stage: "Newborn Care", items: ["Personal Input"], source: "manual" };
      if (manualAge < 4) return { stage: "Feeding Routine", items: ["Personal Input"], source: "manual" };
      if (manualAge < 6) return { stage: "Crawling Prep", items: ["Personal Input"], source: "manual" };
      if (manualAge < 10) return { stage: "Starting Solids", items: ["Personal Input"], source: "manual" };
      return { stage: "First Steps", items: ["Personal Input"], source: "manual" };
    }

    if (cart.length === 0) return { stage: "Newborn Care", items: [], source: "cart" };

    const stages = [
      { name: "Newborn Care", keywords: ["Diaper"], priority: 1 },
      { name: "Feeding Routine", keywords: ["Bottle"], priority: 2 },
      { name: "Starting Solids", keywords: ["Spoon", "Cereal", "Chair", "Bib"], priority: 3 },
      { name: "Crawling Prep", keywords: ["Bear", "Play Mat"], priority: 4 },
      { name: "First Steps", keywords: ["Shoes", "Cup"], priority: 5 },
    ];

    let bestStage = stages[0];
    const triggeringItems: string[] = [];

    cart.forEach(item => {
      stages.forEach(s => {
        if (s.keywords.some(k => item.name.includes(k))) {
          if (s.priority >= bestStage.priority) {
            bestStage = s;
          }
          if (!triggeringItems.includes(item.name)) {
            triggeringItems.push(item.name);
          }
        }
      });
    });

    return { 
      stage: bestStage.name, 
      items: triggeringItems.slice(0, 2),
      source: "cart"
    };
  };

  const prediction = getPrediction();

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--warm-ivory)] pb-24">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 18% 20%, rgba(248,216,213,0.34), transparent 38%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 82% 72%, rgba(243,230,220,0.75), transparent 34%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping rounded-full bg-[var(--deep-berry)]/20" />
                <div className="relative rounded-full bg-white p-10 shadow-xl ring-1 ring-[rgba(42,18,18,0.05)]">
                  <CheckCircle className="h-20 w-20 text-[var(--deep-berry)]" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-[var(--deep-plum)]">Order Successful!</h1>
              <p className="mt-4 text-xl text-[var(--muted-mauve)]">Your baby's journey is off to a great start.</p>
              <p className="mt-8 text-sm font-medium text-[var(--deep-berry)] animate-pulse">Redirecting to store...</p>
            </motion.div>
          ) : isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-[rgba(201,47,75,0.1)] border-t-[var(--deep-berry)]" />
              <p className="mt-6 text-xl font-medium text-[var(--deep-plum)]">Processing your order...</p>
            </motion.div>
          ) : currentView === "store" ? (
            <motion.div
              key="store"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-[2.8rem] text-[var(--deep-plum)] leading-tight">Baby Essentials Store</h1>
                  <p className="mt-2 text-lg text-[var(--muted-mauve)]">Premium products for every stage of your baby's journey.</p>
                </div>
                {totalItems > 0 && (
                  <button 
                    onClick={() => setCurrentView("cart")}
                    className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[var(--deep-plum)] shadow-sm ring-1 ring-[rgba(42,18,18,0.05)] hover:shadow-md transition-shadow"
                  >
                    <ShoppingBag className="h-5 w-5 text-[var(--deep-berry)]" />
                    <span className="font-medium">View Cart ({totalItems})</span>
                  </button>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {STORE_ITEMS.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="mumz-card-soft group flex flex-col rounded-[2rem] p-4 bg-white/60 hover:bg-white transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem] bg-[rgba(255,251,247,0.94)] mb-4">
                      <PremiumBabyIcon name={item.iconName} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-base font-medium text-[var(--deep-plum)] line-clamp-1">{item.name}</h3>
                      <p className="mt-1 text-xs text-[var(--muted-mauve)] line-clamp-2 leading-relaxed flex-1">{item.desc}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-semibold text-[var(--deep-plum)]">${item.price}</span>
                        {(() => {
                          const cartItem = cart.find(i => i.id === item.id);
                          if (cartItem) {
                            return (
                              <div className="flex items-center gap-3 rounded-full bg-[rgba(248,216,213,0.3)] px-3 py-1 ring-1 ring-[rgba(201,47,75,0.08)]">
                                <button
                                  onClick={() => decrementCart(item.id)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[var(--deep-berry)] shadow-sm hover:scale-110 active:scale-95 transition-all"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[1.2rem] text-center text-sm font-bold text-[var(--deep-plum)]">
                                  {cartItem.qty}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[var(--deep-berry)] shadow-sm hover:scale-110 active:scale-95 transition-all"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            );
                          }
                          return (
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={isAdding === item.id}
                              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-all ${
                                isAdding === item.id 
                                  ? "bg-[rgba(221,239,229,0.84)] text-[var(--soft-espresso)]" 
                                  : "bg-[var(--deep-plum)] text-white hover:scale-110"
                              }`}
                            >
                              {isAdding === item.id ? <CheckCircle2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : currentView === "cart" ? (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="mb-8 flex items-center justify-between">
                <h1 className="text-[2.5rem] text-[var(--deep-plum)]">Your Cart</h1>
                <div className="flex items-center gap-2 text-[var(--muted-mauve)]">
                  <ShoppingBag className="h-5 w-5" />
                  <span>{totalItems} items</span>
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-6 rounded-full bg-white p-8 shadow-sm ring-1 ring-[rgba(42,18,18,0.05)]">
                    <ShoppingBag className="h-12 w-12 text-[var(--muted-mauve)]/40" />
                  </div>
                  <h2 className="text-2xl text-[var(--deep-plum)] font-medium">Your cart is empty</h2>
                  <p className="mt-2 text-[var(--muted-mauve)]">Browse our store to find something special.</p>
                  <button 
                    onClick={() => onNavigate("/")}
                    className="mt-8 rounded-full bg-[var(--deep-plum)] px-8 py-3 text-white font-medium hover:scale-105 transition-transform"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                  {/* Cart Items List */}
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div key={item.id} className="mumz-card-soft flex items-center gap-6 rounded-[1.5rem] p-5">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1rem] bg-[rgba(255,251,247,0.94)] shadow-sm border border-[rgba(42,18,18,0.02)]">
                          <PremiumBabyIcon name={item.iconName} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-[var(--deep-plum)]">{item.name}</h3>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center gap-3 rounded-full bg-[rgba(248,216,213,0.3)] px-2 py-1 ring-1 ring-[rgba(201,47,75,0.08)]">
                              <button
                                onClick={() => decrementCart(item.id)}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[var(--deep-berry)] shadow-sm hover:scale-110 active:scale-95 transition-all"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-[1rem] text-center text-xs font-bold text-[var(--deep-plum)]">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[var(--deep-berry)] shadow-sm hover:scale-110 active:scale-95 transition-all"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-xs text-[var(--muted-mauve)]">Quantity</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl text-[var(--deep-plum)]">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="h-fit">
                    <div className="mumz-card rounded-[2rem] p-8 bg-white border border-[rgba(42,18,18,0.05)]">
                      <h2 className="text-xl font-medium text-[var(--deep-plum)]">Order Summary</h2>
                      <div className="mt-6 flex flex-col gap-4 border-b border-[rgba(42,18,18,0.06)] pb-6">
                        <div className="flex justify-between text-[var(--muted-mauve)]">
                          <span>Subtotal</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--muted-mauve)]">
                          <span>Shipping</span>
                          <span className="text-[var(--deep-berry)]">Free</span>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-between text-xl font-medium text-[var(--deep-plum)]">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={startCheckout}
                        className="mumz-primary-button mt-8 w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-white text-lg font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      >
                        <Lock className="h-4 w-4" /> Checkout Securely
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="extension"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mx-auto max-w-5xl"
            >
              <div className="mumz-card overflow-hidden rounded-[2.5rem] p-8 sm:p-12 relative bg-white shadow-2xl border border-[rgba(201,47,75,0.05)]">
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(248,216,213,0.55),transparent_70%)]" />
                <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(243,230,220,0.86),transparent_70%)]" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(248,216,213,0.5)] px-4 py-2 text-sm text-[var(--deep-berry)] mb-8 border border-[rgba(201,47,75,0.1)]">
                    <Lock className="h-4 w-4" />
                    <span>MumzMind AI Intelligence</span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-[2.5rem] sm:text-[3.2rem] leading-[1.1] text-[var(--deep-plum)] max-w-2xl">
                      Wait! Your cart tells a beautiful story.
                    </h1>
                    <p className="mt-4 text-lg text-[var(--muted-mauve)] max-w-xl leading-relaxed">
                      {prediction.source === "cart" ? (
                        <>
                          Based on your selection, our AI predicts your baby is entering the <span className="relative inline-block">
                            <span className="relative z-10 text-[var(--deep-plum)] font-semibold">{prediction.stage}</span>
                            <motion.span 
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ delay: 0.8, duration: 0.6 }}
                              className="absolute bottom-1 left-0 h-2 bg-[var(--deep-berry)]/10 -z-10" 
                            />
                          </span> stage.
                        </>
                      ) : (
                        <>
                          Personalized for your <span className="text-[var(--deep-plum)] font-semibold">{manualAge} month old</span>. We've updated your journey to the <span className="text-[var(--deep-berry)] font-bold">{prediction.stage}</span> stage.
                        </>
                      )}
                    </p>
                  </motion.div>

                  <div className="mt-16 relative">
                    <h3 className="text-sm uppercase tracking-widest text-[var(--muted-mauve)] mb-14 font-bold">The Journey Ahead</h3>
                    
                    {/* Horizontal Timeline Line */}
                    <div className="absolute left-0 top-[110px] h-[3px] w-full bg-[rgba(201,47,75,0.08)] hidden lg:block" />
                    
                    <div className="grid gap-12 lg:flex lg:justify-between lg:gap-0">
                      {MILESTONES.map((milestone, idx) => {
                        const isPredicted = milestone.stageKey === prediction.stage;
                        return (
                          <motion.div
                            key={milestone.month}
                            className="relative flex flex-col items-center lg:w-[150px]"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            {/* Milestone Image and Effect */}
                            <div className="relative mb-6">
                              {isPredicted && (
                                <>
                                  {/* PROFESSIONAL ROTATING HIGHLIGHT RING */}
                                  <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-3 rounded-full border-[3px] border-transparent border-t-[var(--deep-berry)] border-r-[var(--deep-berry)]/30 z-0"
                                  />
                                  <div className="absolute -inset-10 rounded-full bg-[var(--deep-berry)]/5 blur-3xl" />
                                </>
                              )}
                              <div className={`relative h-28 w-28 overflow-hidden rounded-full border-4 shadow-xl transition-all duration-700 ${
                                isPredicted 
                                  ? "border-[var(--deep-berry)] scale-125 z-20 grayscale-0" 
                                  : "border-white opacity-30 grayscale z-10"
                              }`}>
                                <img src={milestone.image} alt={milestone.title} className="h-full w-full object-cover" />
                              </div>
                              
                              {/* Dot on the Line - ULTIMATE FLUID RESONANCE EFFECT */}
                              <div className="absolute -bottom-[54px] left-1/2 -translate-x-1/2 hidden lg:block z-30">
                                {isPredicted ? (
                                  <div className="relative flex items-center justify-center">
                                    {[0, 0.4, 0.8].map((delay, i) => (
                                      <motion.div
                                        key={i}
                                        initial={{ scale: 0.8, opacity: 0.5 }}
                                        animate={{ scale: [0.8, 3.5], opacity: [0.5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, delay, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute h-6 w-6 rounded-full border border-[var(--deep-berry)]/40 bg-[var(--deep-berry)]/5 blur-[1px]"
                                      />
                                    ))}
                                    <motion.div 
                                      animate={{ scale: [1, 1.15, 1] }}
                                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                      className="relative h-7 w-7 rounded-full border-[2.5px] border-white bg-[var(--deep-berry)] shadow-[0_0_20px_rgba(201,47,75,0.6),inset_0_0_8px_rgba(255,255,255,0.4)]"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-6 w-6 rounded-full border-2 border-white bg-[rgba(201,47,75,0.15)] opacity-40 transition-opacity" />
                                )}
                              </div>
                            </div>

                            <div className={`text-center transition-all duration-500 ${isPredicted ? "translate-y-4" : ""}`}>
                              <p className={`text-xs font-black uppercase tracking-widest ${isPredicted ? "text-[var(--deep-berry)]" : "text-[var(--muted-mauve)]/30"}`}>
                                {milestone.month}M
                              </p>
                              <h4 className={`mt-1 text-sm font-bold ${isPredicted ? "text-[var(--deep-plum)] text-base" : "text-[var(--muted-mauve)]/30"}`}>
                                {milestone.title}
                              </h4>
                              <p className={`mt-1 text-[10px] leading-tight transition-opacity duration-500 ${isPredicted ? "text-[var(--muted-mauve)] opacity-100" : "text-[var(--muted-mauve)]/10"}`}>
                                {milestone.desc}
                              </p>
                            </div>

                            {isPredicted && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -top-12 rounded-full bg-white/80 backdrop-blur-md px-5 py-2 text-[10px] text-[var(--deep-plum)] font-black uppercase tracking-widest shadow-xl border border-[var(--deep-berry)]/20 flex items-center gap-2 z-30"
                              >
                                <Sparkles className="h-3 w-3 text-[var(--deep-berry)]" />
                                {prediction.source === "cart" ? "Prediction Found" : "Personalized"}
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Interactive Feedback Loop */}
                    <div className="mt-20 flex flex-col items-center border-t border-[rgba(201,47,75,0.08)] pt-12">
                      <AnimatePresence mode="wait">
                        {!showAgeInput ? (
                          <motion.div 
                            key="prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center text-center"
                          >
                            <p className="text-sm text-[var(--muted-mauve)] flex items-center gap-2">
                              Is our prediction wrong? 
                              <button 
                                onClick={() => setShowAgeInput(true)}
                                className="text-[var(--deep-berry)] font-bold hover:underline flex items-center gap-1"
                              >
                                <Edit3 className="h-3 w-3" />
                                Enter exact age for better offers
                              </button>
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 bg-[rgba(248,216,213,0.05)] p-6 rounded-[2rem] border border-[rgba(201,47,75,0.1)] w-full max-w-sm shadow-sm"
                          >
                            <div className="flex items-center justify-between w-full">
                              <h4 className="text-sm font-bold text-[var(--deep-plum)]">Enter Baby's Age (Months)</h4>
                              <button onClick={() => setShowAgeInput(false)} className="text-[var(--muted-mauve)] hover:text-[var(--deep-plum)]">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex w-full gap-2">
                              <input 
                                type="number" 
                                min="0" 
                                max="24"
                                placeholder="Age in months"
                                className="flex-1 rounded-full bg-white px-4 py-2 text-sm border border-[rgba(42,18,18,0.1)] focus:outline-none focus:ring-2 focus:ring-[var(--deep-berry)]/20"
                                onChange={(e) => setManualAge(Number(e.target.value) || 0)}
                                value={manualAge || ""}
                              />
                              <button 
                                onClick={() => setShowAgeInput(false)}
                                className="rounded-full bg-[var(--deep-plum)] px-6 py-2 text-sm text-white font-bold"
                              >
                                Update
                              </button>
                            </div>
                            <p className="text-[10px] text-[var(--muted-mauve)] italic text-center">
                              Entering the exact age helps us unlock personalized bundles and loyalty offers.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-16 rounded-[2rem] bg-[rgba(248,216,213,0.1)] p-6 sm:p-8 border border-[rgba(201,47,75,0.15)]">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                      <div>
                        <h3 className="text-xl font-medium text-[var(--deep-plum)] flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-[var(--deep-berry)]" />
                          {prediction.source === "cart" ? "AI-Recommended Prep Kit" : "Personalized Prep Kit"}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted-mauve)] max-w-sm leading-relaxed">
                          {prediction.source === "cart" 
                            ? `Bundle these essentials specifically for the upcoming "${prediction.stage}" chapter.`
                            : `Selected for your ${manualAge} month old's current "${prediction.stage}" needs.`}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-semibold text-[var(--deep-plum)]">+$144.00</p>
                        <p className="text-xs text-[var(--deep-berry)] font-medium mt-1">Save 15% with this bundle</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 mb-8">
                      <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-[rgba(42,18,18,0.03)] shadow-sm hover:shadow-md transition-all">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[1rem] bg-[rgba(255,251,247,0.94)]">
                          <PremiumBabyIcon name="chair" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--deep-plum)]">High Chair</p>
                          <p className="text-xs text-[var(--muted-mauve)] mt-0.5">Ergonomic design</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-[rgba(42,18,18,0.03)] shadow-sm hover:shadow-md transition-all">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[1rem] bg-[rgba(255,251,247,0.94)]">
                          <PremiumBabyIcon name="bib" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--deep-plum)]">Silicone Bibs</p>
                          <p className="text-xs text-[var(--muted-mauve)] mt-0.5">Set of 2, mess-free</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleCompleteOrder}
                        className="mumz-primary-button flex-1 rounded-full px-6 py-4 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_10px_20px_rgba(143,16,37,0.15)]"
                      >
                        Add Kit & Complete Order
                      </button>
                      <button
                        onClick={handleCompleteOrder}
                        className="mumz-secondary-button sm:flex-1 rounded-full px-6 py-4 text-[var(--deep-plum)] font-semibold hover:bg-white transition-all border border-[rgba(42,18,18,0.08)]"
                      >
                        Checkout Current Only
                      </button>
                    </div>

                    <p className="mt-6 text-center text-[10px] text-[var(--muted-mauve)] italic leading-tight">
                      Note: This is a demo prediction based on cart items. Live AI integration is pending; accuracy may vary.
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
