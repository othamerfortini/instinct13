"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * LogoReveal
 *
 * Renders the Instinct 13 wordmark with a cinematic letter-by-letter
 * stagger reveal. Each character slides up from behind a clip mask.
 *
 * - Pure presentational; no navigation or business logic.
 * - Respects prefers-reduced-motion (instant reveal).
 * - Uses semantic HTML and ARIA for accessibility.
 */

export interface LogoRevealProps {
  /** Whether to trigger the reveal animation */
  animate: boolean;
  /** Optional className for the outer wrapper */
  className?: string;
  /** Callback when the reveal animation completes */
  onAnimationComplete?: () => void;
}

const WORDMARK = "Instinct 13";

const CHAR_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const charVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.6, ease: CHAR_EASE },
  },
};

export function LogoReveal({
  animate,
  className,
  onAnimationComplete,
}: LogoRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        role="img"
        aria-label="Instinct 13 logo"
        className={className}
      >
        <span className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          {WORDMARK}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      role="img"
      aria-label="Instinct 13 logo"
      variants={containerVariants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      onAnimationComplete={animate ? onAnimationComplete : undefined}
      className={className}
    >
      <span
        aria-hidden="true"
        className="flex overflow-hidden text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
      >
        {WORDMARK.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={charVariants}
            className={char === " " ? "w-[0.3em]" : ""}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </motion.div>
  );
}

