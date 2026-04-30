"use client";

import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, AlertCircle, ChevronRight, ArrowRight, ShieldAlert } from "lucide-react";
import { SAFETY_ROADMAP } from "../lib/safety-engine";

interface SafetyGuardProps {
  stage: string;
}

export default function SafetyGuard({ stage }: SafetyGuardProps) {
  const safetyChecks = SAFETY_ROADMAP[stage] || SAFETY_ROADMAP["Newborn Care"];

  const handleDownload = () => {
    // We use window.print() with a print-specific CSS to simulate a PDF download
    // This is the cleanest way without adding heavy external libraries for a demo
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
        <div className="bg-[var(--deep-berry)] px-8 py-6 text-white print:bg-white print:text-[var(--deep-plum)] print:border-b-2 print:border-[var(--deep-berry)] print:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2 backdrop-blur-md print:bg-[var(--deep-berry)]/5 print:text-[var(--deep-berry)]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">AI Safety Shield Report</h3>
                <p className="text-xs text-white/70 font-medium uppercase tracking-widest print:text-[var(--deep-berry)]">Verified Proactive Audit</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border border-white/20 print:border-[var(--deep-berry)]/20 print:text-[var(--deep-berry)]">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 print:px-0">
          <div className="mb-8 flex items-start gap-4 rounded-2xl bg-[rgba(143,16,37,0.03)] p-5 border border-[rgba(143,16,37,0.08)]">
            <ShieldAlert className="h-6 w-6 text-[var(--deep-berry)] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-[var(--deep-plum)]">Proactive Safety Recommendation</h4>
              <p className="mt-1 text-sm text-[var(--muted-mauve)] leading-relaxed">
                Based on the <span className="font-bold text-[var(--deep-berry)]">{stage}</span> stage, our intelligence identifies new environmental hazards. This report details priority actions for your home environment.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {safetyChecks.map((check, idx) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className="group flex items-center justify-between rounded-2xl border border-[rgba(42,18,18,0.03)] bg-[rgba(42,18,18,0.01)] p-5 transition-all hover:bg-white hover:shadow-md hover:border-[rgba(143,16,37,0.15)] print:break-inside-avoid print:bg-white print:border-[rgba(42,18,18,0.1)]"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                    check.priority === "High" ? "bg-[var(--deep-berry)]" : "bg-amber-500"
                  }`} />
                  <div>
                    <h5 className="font-bold text-[var(--deep-plum)] flex items-center gap-2">
                      {check.title}
                      {check.priority === "High" && (
                        <span className="text-[9px] uppercase tracking-tighter bg-[var(--deep-berry)]/10 text-[var(--deep-berry)] px-2 py-0.5 rounded-full">High Priority</span>
                      )}
                    </h5>
                    <p className="mt-1 text-sm text-[var(--muted-mauve)] leading-snug max-w-md">
                      {check.description}
                    </p>
                  </div>
                </div>
                <button className="rounded-full bg-[rgba(42,18,18,0.04)] p-2 text-[var(--muted-mauve)] group-hover:bg-[var(--deep-berry)] group-hover:text-white transition-all no-print">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={handleDownload}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--deep-plum)] py-4 text-sm font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-xl no-print"
          >
            Download Full Safety Checklist (PDF)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
