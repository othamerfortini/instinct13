"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * PageLoader
 *
 * Full-viewport cinematic loading screen that mounts on first render
 * and exits once the page is ready.
 *
 * - Renders a centered wordmark with a subtle reveal animation.
 * - Exits with a vertical split/slide reveal (two curtains).
 * - Respects prefers-reduced-motion (immediate dismiss).
 * - Blocks scroll during display via `overflow: hidden` on body.
 *
 * Usage: Render once in RootLayout. It self-dismisses after ~1.2 s.
 */

const DISMISS_DELAY = 1100;

const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const wordmarkVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.9, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const delay = prefersReduced ? 0 : DISMISS_DELAY;
    const id = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(id);
  }, [prefersReduced]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          aria-hidden="true"
        >
          {/* Top curtain */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "-100%", transition: { duration: 0.75, ease: CURTAIN_EASE } }}
            className="absolute inset-x-0 top-0 h-1/2 bg-[#080808]"
          />

          {/* Bottom curtain */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "100%", transition: { duration: 0.75, ease: CURTAIN_EASE } }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#080808]"
          />

          {/* Wordmark */}
          <motion.span
            variants={wordmarkVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 text-xl font-semibold tracking-[0.4em] text-white/90 uppercase"
          >
            Instinct 13
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
