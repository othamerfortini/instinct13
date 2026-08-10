"use client";

import { useIntent } from "@/components/providers/IntentProvider";
import { type IntentState } from "@/lib/intent/types";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

const ATMOSPHERE: Record<IntentState, string> = {
  explorer:
    "bg-[radial-gradient(ellipse_at_68%_28%,rgba(255,255,255,0.045),transparent_58%)]",
  thinker:
    "bg-[radial-gradient(ellipse_at_42%_18%,rgba(255,255,255,0.035),transparent_62%)]",
  collaborator:
    "bg-[radial-gradient(ellipse_at_50%_72%,rgba(255,255,255,0.05),transparent_60%)]",
  observer:
    "bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.018),transparent_58%)]",
};

export function AdaptiveExperience() {
  const { intent } = useIntent();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none fixed inset-0 z-[1] transition-opacity duration-[1200ms]",
        ATMOSPHERE[intent],
        prefersReducedMotion || intent === "observer" ? "opacity-60" : "opacity-100",
      ].join(" ")}
    />
  );
}
