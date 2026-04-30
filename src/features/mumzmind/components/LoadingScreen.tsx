"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dancing_Script } from "next/font/google";

const cursiveFont = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
});

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initial delay for the "blank white" phase
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, 800);

    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 1000); 
          }, 800);
          return 100;
        }
        const increment = prev > 85 ? 0.3 : prev > 60 ? 0.8 : 1.5;
        return Math.min(prev + increment, 100);
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isStarted, onComplete]);

  // Prevent SSR flicker
  if (!isMounted) return <div className="fixed inset-0 z-[999] bg-white" />;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1, backgroundColor: "#FFFFFF" }}
          animate={{ 
              backgroundColor: isStarted ? "var(--warm-ivory)" : "#FFFFFF"
          }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Central Cursive Animation */}
          {isStarted && (
            <div className="relative">
              <svg 
                viewBox="0 0 600 200" 
                className="w-[340px] sm:w-[700px] h-auto drop-shadow-[0_10px_30px_rgba(201,47,75,0.05)]"
              >
                 {/* Stroke Drawing Path */}
                 <motion.text
                   x="50%"
                   y="50%"
                   dominantBaseline="middle"
                   textAnchor="middle"
                   className={`${cursiveFont.className} italic`}
                   style={{
                      fontSize: '110px',
                      fill: 'transparent',
                      stroke: 'var(--rose)',
                      strokeWidth: '1.2',
                      strokeDasharray: '1200',
                   }}
                   initial={{ strokeDashoffset: 1200 }}
                   animate={{ 
                      strokeDashoffset: 1200 - (progress * 12) 
                   }}
                   transition={{ duration: 0.1, ease: "linear" }}
                 >
                   MumzMind
                 </motion.text>
                 
                 {/* Solid Reveal Overlay */}
                 <motion.text
                   x="50%"
                   y="50%"
                   dominantBaseline="middle"
                   textAnchor="middle"
                   className={`${cursiveFont.className} italic`}
                   style={{
                      fontSize: '110px',
                      fill: 'var(--rose)',
                   }}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: progress > 90 ? (progress - 90) / 10 : 0 }}
                   transition={{ duration: 0.3 }}
                 >
                   MumzMind
                 </motion.text>
              </svg>

              {/* Minimalist progress line */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-[var(--rose)]/10 overflow-hidden"
              >
                <motion.div 
                   className="h-full bg-[var(--rose)]/40"
                   animate={{ width: `${progress}%` }}
                   transition={{ ease: "linear", duration: 0.1 }}
                />
              </motion.div>
            </div>
          )}

          {/* Footer Tagline */}
          {isStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 1 }}
              className="absolute bottom-12 text-[10px] font-bold text-[var(--deep-plum)] uppercase tracking-[0.8em]"
            >
               Personalized Intelligence
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
