"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BeginObservationButton,
  ExperienceState,
  LayoutContainer,
  LogoReveal,
} from "@/components/ui";
import type { HomepageState } from "@/components/ui/ExperienceState";

function SequenceText({
  children,
}: {
  children: string;
}) {
  return (
    <p className="max-w-3xl text-center text-3xl font-light tracking-wide sm:text-4xl md:text-5xl">
      {children}
    </p>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [currentState, setCurrentState] = useState<HomepageState>(0);

  const handleBeginObservation = useCallback(() => {
    router.push("/manifestations");
  }, [router]);

  return (
    <LayoutContainer navigationVisible={currentState >= 3}>
      <ExperienceState
        onStateChange={setCurrentState}
        renderState0={() => (
          <SequenceText>Instinct 13 is building an operating system for understanding human behavior.</SequenceText>
        )}
        renderState1={() => (
          <SequenceText>We do not exist to classify people.</SequenceText>
        )}
        renderState2={() => (
          <SequenceText>We exist to create frameworks that help people observe what is manifesting.</SequenceText>
        )}
        renderState3={() => (
          <div className="flex flex-col items-center gap-8 text-center">
            <LogoReveal animate />
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
              A visual philosophy of human nature.
            </p>
            <BeginObservationButton onActivate={handleBeginObservation} />
          </div>
        )}
      />
    </LayoutContainer>
  );
}
