"use client";

import React from "react";
import { motion } from "motion/react";
import { Sparkles, Lightbulb, CheckCircle2, ArrowRight, BookOpen, Star } from "lucide-react";
import { PRODUCT_MASTERY_TIPS, type ProductTip } from "../lib/product-tips-engine";
import { useCart } from "../CartContext";

export default function ProductExpertise() {
  const { cart } = useCart();
  
  // Get all tips for products currently in the cart
  const allTips: ProductTip[] = [];
  cart.forEach(item => {
    if (PRODUCT_MASTERY_TIPS[item.name]) {
      allTips.push(...PRODUCT_MASTERY_TIPS[item.name]);
    }
  });

  // If cart is empty or no tips found, show some generic "Mastery" tips or hide
  if (allTips.length === 0) return null;

  // Limit to top 4 tips to keep UI clean
  const displayTips = allTips.slice(0, 4);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 overflow-hidden rounded-[2.5rem] bg-white border border-[rgba(42,18,18,0.05)] shadow-[0_20px_50px_rgba(42,18,18,0.04)] print:shadow-none print:border-none print:m-0 print:p-0"
    >
      {/* PRINT-ONLY HEADER STYLES */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 40px !important;
            background: white !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="print-section">
        <div className="bg-[var(--rose)] px-8 py-6 text-white print:bg-white print:text-[var(--deep-plum)] print:border-b-2 print:border-[var(--rose)] print:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2 backdrop-blur-md print:bg-[var(--rose)]/5 print:text-[var(--rose)]">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">AI Product Mastery Guide</h3>
                <p className="text-xs text-white/70 font-medium uppercase tracking-widest print:text-[var(--rose)]">Expert Tips for Your Selection</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border border-white/20 print:border-[var(--rose)]/20 print:text-[var(--rose)]">
                Intelligence Premium
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 print:px-0">
          <div className="mb-8 flex items-start gap-4 rounded-2xl bg-[rgba(201,47,75,0.03)] p-5 border border-[rgba(201,47,75,0.08)]">
            <BookOpen className="h-6 w-6 text-[var(--rose)] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-[var(--deep-plum)]">Mastering Your Gear</h4>
              <p className="mt-1 text-sm text-[var(--muted-mauve)] leading-relaxed">
                Our AI has analyzed your cart selection. To help you get the most out of these premium items, we've generated these expert usage and maintenance tips.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {displayTips.map((tip, idx) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className="group flex items-center justify-between rounded-2xl border border-[rgba(42,18,18,0.03)] bg-[rgba(42,18,18,0.01)] p-5 transition-all hover:bg-white hover:shadow-md hover:border-[rgba(201,47,75,0.15)] print:break-inside-avoid print:bg-white print:border-[rgba(42,18,18,0.1)]"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1.5 flex h-6 w-6 items-center justify-center rounded-full flex-shrink-0 text-white text-[10px] font-bold ${
                    tip.category === "Usage" ? "bg-[var(--rose)]" : 
                    tip.category === "Development" ? "bg-emerald-500" : "bg-blue-500"
                  }`}>
                    {tip.category[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-[var(--deep-plum)] flex items-center gap-2">
                      {tip.tipTitle}
                      <span className="text-[9px] uppercase tracking-tighter bg-[rgba(42,18,18,0.05)] text-[var(--muted-mauve)] px-2 py-0.5 rounded-full">{tip.productName}</span>
                    </h5>
                    <p className="mt-1 text-sm text-[var(--muted-mauve)] leading-snug max-w-md">
                      {tip.tipDescription}
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-[rgba(42,18,18,0.04)] p-2 text-[var(--muted-mauve)] group-hover:bg-[var(--rose)] group-hover:text-white transition-all no-print">
                  <Lightbulb className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={handlePrint}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--deep-plum)] py-4 text-sm font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-xl no-print"
          >
            Download Mastery Guide (PDF)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
