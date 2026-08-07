import type { Variants } from "framer-motion";

const EASE_SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_DEFAULT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * textRevealVariants
 *
 * Variants for a word/character that slides up from below its container.
 * Pair with a parent that has `overflow: hidden`.
 */
export const textRevealVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: EASE_SPRING,
    },
  },
};

/**
 * fadeUpVariants
 *
 * Subtle fade + upward motion, suitable for body text reveals.
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_DEFAULT,
    },
  },
};

/**
 * lineVariants
 *
 * Variants for a decorative horizontal rule that expands from zero width.
 */
export const lineVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: EASE_SPRING,
      delay: 0.2,
    },
  },
};
