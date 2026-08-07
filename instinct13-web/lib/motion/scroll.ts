"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

const EASE_DEFAULT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * useScrollReveal
 *
 * Returns a ref and a boolean indicating whether the element has entered
 * the viewport. Intended for scroll-driven reveal animations.
 *
 * @param once - Whether the reveal fires only once (default: true)
 * @param amount - Fraction of element that must be visible (default: 0.15)
 */
export function useScrollReveal(once = true, amount = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once, amount });
  return { ref, isInView };
}

/**
 * scrollRevealVariants
 *
 * Common Framer Motion variants for scroll-triggered reveals.
 */
export const scrollRevealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_DEFAULT },
  },
} as const;

/**
 * staggerContainerVariants
 *
 * Parent variants that stagger child reveal animations.
 */
export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
} as const;
