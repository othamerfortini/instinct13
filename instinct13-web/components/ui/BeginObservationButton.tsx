"use client";

import { type ReactNode, useCallback } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * BeginObservationButton
 *
 * Presentational CTA button for the homepage sequence (State 3).
 *
 * - Pure presentational; caller provides `onActivate` handler.
 * - No routing logic; parent decides navigation target.
 * - Meets WCAG 2.1 AA: 44×44px minimum touch target, visible focus.
 * - Respects prefers-reduced-motion for entry animation.
 */

export interface BeginObservationButtonProps {
  /** Handler called when the button is activated (click/keyboard) */
  onActivate: () => void;
  /** Button label text (default: "Begin Observation") */
  children?: ReactNode;
  /** Whether the button is currently visible/animatable */
  visible?: boolean;
  /** Optional className for additional styling */
  className?: string;
}

const buttonVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.2 },
  },
};

const reducedButtonVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export function BeginObservationButton({
  onActivate,
  children = "Begin Observation",
  visible = true,
  className,
}: BeginObservationButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = prefersReducedMotion
    ? reducedButtonVariants
    : buttonVariants;

  const handleClick = useCallback(() => {
    onActivate();
  }, [onActivate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    },
    [onActivate],
  );

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label="Begin Observation \u2014 navigate to Manifestations"
        className={[
          "min-h-[44px] min-w-[44px] px-8 py-3",
          "text-base font-medium tracking-wide",
          "rounded-sm border border-current",
          "transition-colors duration-150",
          "hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </button>
    </motion.div>
  );
}
