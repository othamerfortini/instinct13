"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { reducedMotionVariants } from "@/lib/motion/variants";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * FadeTransition
 *
 * Presentational component that wraps children in a Framer Motion
 * AnimatePresence-driven fade transition.
 *
 * - No business logic; caller controls visibility via `show`.
 * - Respects prefers-reduced-motion (instant swap when reduced).
 * - Exposes `onExitComplete` for sequencing callbacks.
 */

export interface FadeTransitionProps {
  /** Whether the child content is currently visible */
  show: boolean;
  /** Content to render inside the transition */
  children: ReactNode;
  /** Duration override in ms (default 600 = --duration-slow token) */
  duration?: number;
  /** Called when the exit animation has completed */
  onExitComplete?: () => void;
  /** Optional className applied to the motion wrapper */
  className?: string;
  /** Unique key for AnimatePresence identity */
  transitionKey: string;
}

export function FadeTransition({
  show,
  children,
  duration = 600,
  onExitComplete,
  className,
  transitionKey,
}: FadeTransitionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {show && (
        <motion.div
          key={transitionKey}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: duration / 1000, ease: "easeInOut" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
