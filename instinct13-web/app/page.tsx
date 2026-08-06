"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BeginObservationButton,
  ExperienceState,
  LayoutContainer,
  LogoReveal,
} from "@/components/ui";

export default function HomePage() {
  const router = useRouter();
  const [navigationVisible, setNavigationVisible] = useState(false);

  const handleSequenceComplete = useCallback(() => {
    setNavigationVisible(true);
  }, []);

  const handleBeginObservation = useCallback(() => {
    router.push("/manifestations");
  }, [router]);

  return (
    <LayoutContainer navigationVisible={navigationVisible}>
      <ExperienceState
        onSequenceComplete={handleSequenceComplete}
        renderState0={() => (
          <p className="text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            You Are Not a Type.
          </p>
        )}
        renderState1={() => (
          <p className="text-center text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            What is manifesting now?
          </p>
        )}
        renderState2={() => (
          <p className="max-w-2xl text-center text-xl font-medium tracking-tight sm:text-2xl md:text-3xl">
            Reality is always greater than the framework used to observe it.
          </p>
        )}
        renderState3={() => (
          <div className="flex flex-col items-center gap-8">
            <LogoReveal animate />
            <BeginObservationButton onActivate={handleBeginObservation} />
          </div>
        )}
      />
    </LayoutContainer>
  );
}
