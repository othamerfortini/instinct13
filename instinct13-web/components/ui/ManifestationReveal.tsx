"use client";

import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

const RED_FINAL = "rgba(252, 113, 113, 0.95)";
const RED_RESTRAINED = "rgba(252, 113, 113, 0.72)";

export const manifestationRevealVariants: Variants = {
  restrained: {
    color: RED_RESTRAINED,
    scale: 1,
    textShadow: "0 0 0 rgba(239, 68, 68, 0)",
  },
  revealed: {
    color: RED_FINAL,
    scale: [1, 1.012, 1],
    textShadow: [
      "0 0 0 rgba(239, 68, 68, 0)",
      "0 0 28px rgba(239, 68, 68, 0.42)",
      "0 0 12px rgba(239, 68, 68, 0.18)",
    ],
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const reducedMotionVariants: Variants = {
  restrained: manifestationRevealVariants.revealed,
  revealed: manifestationRevealVariants.revealed,
};

export function ManifestationReveal() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : manifestationRevealVariants;

  return (
    <motion.h1
      variants={variants}
      initial={prefersReducedMotion ? "revealed" : "restrained"}
      animate={prefersReducedMotion ? "revealed" : undefined}
      whileInView={prefersReducedMotion ? undefined : "revealed"}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              scale: 1.006,
              textShadow: "0 0 18px rgba(239, 68, 68, 0.36)",
            }
      }
      viewport={{ once: true, amount: 0.6 }}
      className="mb-12 origin-left text-4xl font-semibold tracking-tight sm:text-5xl"
    >
      Manifestations
    </motion.h1>
  );
}
