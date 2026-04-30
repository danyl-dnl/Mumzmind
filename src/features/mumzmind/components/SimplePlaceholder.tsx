"use client";

import { motion } from "motion/react";
import { Sparkles, Construction } from "lucide-react";
import { usePageMotion } from "../hooks/usePageMotion";

export default function SimplePlaceholder({ title, message }: { title: string; message: string }) {
  const motionConfig = usePageMotion();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[rgba(248,216,213,0.5)] text-[var(--deep-berry)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Construction className="h-10 w-10" />
      </motion.div>
      <motion.h1
        className="text-[2.5rem] text-[var(--deep-plum)]"
        {...motionConfig.getReveal({ direction: "up", duration: 0.5 })}
      >
        {title}
      </motion.h1>
      <motion.p
        className="mt-4 max-w-md text-lg text-[var(--muted-mauve)]"
        {...motionConfig.getReveal({ delay: 0.1, direction: "up", duration: 0.5 })}
      >
        {message}
      </motion.p>
      <motion.div
        className="mt-8 flex items-center gap-2 rounded-full bg-white/60 px-6 py-3 text-sm text-[var(--deep-plum)] shadow-sm backdrop-blur-md"
        {...motionConfig.getReveal({ delay: 0.2, direction: "up", duration: 0.5 })}
      >
        <Sparkles className="h-4 w-4 text-[var(--deep-berry)]" />
        Coming soon to MumzMind
      </motion.div>
    </div>
  );
}
