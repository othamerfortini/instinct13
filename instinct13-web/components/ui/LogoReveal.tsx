"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * LogoReveal
 *
 * Presentational component that renders the Instinct 13 logo
 * with a subtle reveal animation.
 *
 * - Pure presentational; no navigation or business logic.
 * - Accepts `animate` boolean to trigger the reveal.
 * - Respects prefers-reduced-motion.
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

const logoVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

const reducedLogoVariants = {
  hidden: { opacity: 1, scale: 1 },
  visible: { opacity: 1, scale: 1 },
};

export function LogoReveal({
  animate,
  className,
  onAnimationComplete,
}: LogoRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = prefersReducedMotion ? reducedLogoVariants : logoVariants;

  return (
    <motion.div
      role="img"
      aria-label="Instinct 13 logo"
      variants={variants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      onAnimationComplete={animate ? onAnimationComplete : undefined}
      className={className}
    >
      <span className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        Instinct 13
      </span>
    </motion.div>
  );
}
