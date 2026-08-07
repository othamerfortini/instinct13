"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * PageTransition
 *
 * Wraps page content with a cinematic entry: fade + upward motion with
 * a staggered child reveal for sections.
 *
 * - Respects prefers-reduced-motion.
 * - Uses custom cubic-bezier matching the design's premium motion language.
 */

export interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PAGE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: PAGE_EASE,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const reducedPageVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
};

export function PageTransition({ children, className }: PageTransitionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = prefersReducedMotion ? reducedPageVariants : pageVariants;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
}

