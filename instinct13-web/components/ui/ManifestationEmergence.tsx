"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

export type ManifestationStage = 0 | 1 | 2 | 3;

const left = [0, 1, 2, 3, 4, 5];
const right = [0, 1, 2, 3, 4, 5];

const transition = { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const };

function Stroke({
  side,
  index,
  stage,
}: {
  side: "left" | "right";
  index: number;
  stage: ManifestationStage;
}) {
  const isVisible = stage >= 1 + Math.floor(index / 2);
  const isResolved = stage >= 3;
  const x = side === "left" ? -1 : 1;
  const y = (index - 2.5) * 18;

  return (
    <motion.span
      aria-hidden="true"
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? x * 36 : x * 10,
        scaleX: isVisible ? (isResolved ? 1 : 0.84) : 0.35,
        rotate: isResolved ? x * 0.5 : x * 3,
      }}
      transition={{ ...transition, delay: index * 0.035 }}
      className="absolute left-1/2 top-1/2 h-px w-[clamp(2.5rem,8vw,5rem)] origin-center bg-white/75"
      style={{ marginTop: y, marginLeft: x < 0 ? "calc(clamp(2.5rem, 8vw, 5rem) * -1)" : 0 }}
    />
  );
}

export function ManifestationEmergence({ stage }: { stage: ManifestationStage }) {
  const reduced = usePrefersReducedMotion();
  const effectiveStage = reduced ? 3 : stage;

  return (
    <div
      className="relative h-[min(48vw,20rem)] w-[min(82vw,34rem)]"
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: effectiveStage >= 3 ? 1 : 0.96 }}
        transition={transition}
      >
        {left.map((index) => (
          <Stroke key={`l-${index}`} side="left" index={index} stage={effectiveStage} />
        ))}
        {right.map((index) => (
          <Stroke key={`r-${index}`} side="right" index={index} stage={effectiveStage} />
        ))}

        <motion.span
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          initial={false}
          animate={{
            opacity: effectiveStage >= 3 ? 1 : 0,
            scale: effectiveStage >= 3 ? 1 : 0,
            backgroundColor: effectiveStage >= 3 ? "#c1121f" : "#f2f2f2",
          }}
          transition={{ ...transition, delay: effectiveStage >= 3 ? 0.15 : 0 }}
        />

        <motion.div
          className="absolute left-1/2 top-1/2 h-[clamp(7rem,28vw,12rem)] w-[clamp(7rem,28vw,12rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/0"
          initial={false}
          animate={{
            borderColor: effectiveStage >= 3 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0)",
            scale: effectiveStage >= 3 ? 1 : 0.82,
            opacity: effectiveStage >= 3 ? 1 : 0,
          }}
          transition={{ ...transition, delay: 0.22 }}
        />
      </motion.div>
    </div>
  );
}
