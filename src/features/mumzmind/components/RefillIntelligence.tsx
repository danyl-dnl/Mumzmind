"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, AlertTriangle, CheckCircle2, TrendingDown, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "../CartContext";
import { calculateRefillForecast, type RefillForecast } from "../lib/refill-engine";

interface RefillIntelligenceProps {
  babyAgeMonths: number;
}

function ReorderButton({ productName, onAdd }: { productName: string, onAdd: (name: string) => void }) {
  const [isAdded, setIsAdded] = useState(false);
  const handleReorder = () => {
    onAdd(productName);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };
  return (
    <button 
      onClick={handleReorder}
      className={`text-[11px] font-bold transition-all ${isAdded ? "text-emerald-500" : "text-[var(--rose)] hover:underline"}`}
    >
      {isAdded ? "Added to Cart!" : "Re-order Now"}
    </button>
  );
}

export default function RefillIntelligence({ babyAgeMonths }: RefillIntelligenceProps) {
  const { cart, addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  const forecasts: RefillForecast[] = cart
    .map(item => calculateRefillForecast(item.name, 1, babyAgeMonths))
    .filter((f): f is RefillForecast => f !== null);

  const handleTriggerAddToCart = (name: string) => {
    const itemToReorder = cart.find(i => i.name === name);
    if (itemToReorder) {
      addToCart({
        id: itemToReorder.id,
        name: itemToReorder.name,
        price: itemToReorder.price,
        iconName: itemToReorder.iconName
      });
    }
  };

  if (forecasts.length === 0) return null;

  const criticalCount = forecasts.filter(f => f.status === "Critical").length;

  return (
    <div className="mt-8">
      {/* Collapsible Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-3xl border px-6 py-5 transition-all ${
          isOpen 
            ? "bg-white border-[var(--rose)] shadow-lg" 
            : "bg-white border-[rgba(42,18,18,0.08)] hover:border-[var(--rose)]"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`rounded-xl p-2.5 ${isOpen ? "bg-[var(--rose)] text-white" : "bg-[rgba(143,16,37,0.05)] text-[var(--rose)]"}`}>
            <RefreshCw className={`h-5 w-5 ${isOpen ? "animate-spin-slow" : ""}`} />
          </div>
          <div className="text-left">
            <h3 className="text-[15px] font-bold text-[var(--deep-plum)]">
              AI Inventory Forecast
            </h3>
            <p className="text-[11px] text-[var(--muted-mauve)]">
              {forecasts.length} item{forecasts.length > 1 ? 's' : ''} analyzed • {criticalCount > 0 ? `${criticalCount} critical refill needed` : 'Inventory healthy'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isOpen && criticalCount > 0 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black text-white uppercase animate-pulse">
              Alert
            </span>
          )}
          {isOpen ? <ChevronUp className="h-5 w-5 opacity-40" /> : <ChevronDown className="h-5 w-5 opacity-40" />}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-[2.5rem] bg-white p-8 border border-[rgba(201,47,75,0.1)] shadow-xl">
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {forecasts.map((forecast, idx) => (
                  <motion.div
                    key={forecast.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative overflow-hidden rounded-2xl bg-[rgba(143,16,37,0.02)] border border-[rgba(143,16,37,0.05)] p-5 group hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-mauve)]">{forecast.productName}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-[var(--deep-plum)]">Stock lasts until {forecast.runOutDate}</span>
                        </div>
                        <p className="text-[10px] text-[var(--muted-mauve)] font-bold uppercase tracking-widest mt-1">
                          You are safe for {forecast.daysRemaining} more days
                        </p>
                      </div>
                      <div className={`rounded-full p-2 ${
                        forecast.status === "Critical" ? "bg-rose-500/10 text-rose-500" : 
                        forecast.status === "Warning" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                      }`}>
                        {forecast.status === "Critical" ? <AlertTriangle className="h-5 w-5" /> : 
                         forecast.status === "Warning" ? <Clock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-3.5 w-3.5 text-[var(--muted-mauve)]/30" />
                          <span className="text-sm font-bold text-[var(--deep-plum)]">{forecast.burnRate}</span>
                        </div>
                        <ReorderButton productName={forecast.productName} onAdd={handleTriggerAddToCart} />
                      </div>
                      <p className="text-[10px] text-[var(--muted-mauve)] ml-5">
                        Average consumption: {forecast.dailyRateText}
                      </p>
                    </div>

                    <div className="mt-4 h-1.5 w-full rounded-full bg-[rgba(143,16,37,0.05)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(forecast.daysRemaining / 30) * 100}%` }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className={`h-full rounded-full ${
                          forecast.status === "Critical" ? "bg-rose-500" : 
                          forecast.status === "Warning" ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-2xl bg-[rgba(143,16,37,0.03)] p-5 border border-[rgba(143,16,37,0.05)] text-center">
                <p className="text-sm text-[var(--muted-mauve)] italic leading-relaxed">
                  "AI estimates based on baby's {babyAgeMonths}m developmental rhythm. Accuracy improves with every order."
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
