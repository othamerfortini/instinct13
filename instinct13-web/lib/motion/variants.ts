import type { Variants } from "framer-motion";

/**
 * Variants used when the user prefers reduced motion.
 * All states resolve to the same visible appearance — no positional or opacity changes.
 */
export const reducedMotionVariants: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};
