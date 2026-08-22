"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";
import {
  BeginObservationButton,
  LayoutContainer,
  LogoReveal,
  ManifestationField,
} from "@/components/ui";

type ExperienceStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const DURATIONS: Record<ExperienceStage, number> = {
  0: 2600,
  1: 3000,
  2: 3400,
  3: 3800,
  4: 3800,
  5: 3200,
  6: 2400,
  7: 2800,
  8: 3400,
  9: 0,
};

function next(stage: ExperienceStage): ExperienceStage {
  return stage < 9 ? ((stage + 1) as ExperienceStage) : 9;
}

export default function HomePage() {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState<ExperienceStage>(0);
  const [navigationVisible, setNavigationVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setStage(5);
      const timer = window.setTimeout(() => setStage(6), 1200);
      return () => window.clearTimeout(timer);
    }

    if (stage === 9) {
      setNavigationVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setStage(next(stage)), DURATIONS[stage]);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, stage]);

  const advance = useCallback(() => {
    if (stage < 5) setStage(next(stage));
  }, [stage]);

  const handleBeginObservation = useCallback(() => {
    router.push("/manifestations");
  }, [router]);

  return (
    <LayoutContainer navigationVisible={navigationVisible}>
      <main
        className="relative min-h-dvh w-full overflow-hidden bg-black text-white"
        onClick={stage < 5 ? advance : undefined}
        onKeyDown={(event) => {
          if (stage < 5 && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
            event.preventDefault();
            advance();
          }
        }}
        tabIndex={stage < 5 ? 0 : -1}
        aria-label="Instinct 13 manifestation experience"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <ManifestationField stage={stage >= 5 ? 5 : (stage as 0 | 1 | 2 | 3 | 4 | 5)} />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          {stage === 6 && (
            <p className="max-w-3xl text-center text-[clamp(2rem,5vw,4rem)] font-light tracking-[-0.03em]">
              You Are Not a Type.
            </p>
          )}
          {stage === 7 && (
            <p className="text-center text-xs uppercase tracking-[0.34em] text-neutral-300 sm:text-sm">
              What is manifesting now?
            </p>
          )}
          {stage === 8 && (
            <p className="max-w-3xl text-center text-[clamp(1.35rem,3vw,2.35rem)] font-light leading-[1.18] tracking-[-0.025em] text-neutral-200">
              Reality is always greater than the framework used to observe it.
            </p>
          )}
          {stage === 9 && (
            <div className="flex flex-col items-center gap-8">
              <LogoReveal animate />
              <p className="text-center text-xl font-light tracking-tight text-neutral-200 sm:text-2xl">
                Begin Observation
              </p>
              <div className="pointer-events-auto">
                <BeginObservationButton onActivate={handleBeginObservation} />
              </div>
            </div>
          )}
        </div>
      </main>
    </LayoutContainer>
  );
}
