"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BeginObservationButton,
  ExperienceState,
  LayoutContainer,
  ManifestationEmergence,
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
        autoAdvanceInterval={3000}
        onSequenceComplete={handleSequenceComplete}
        renderState0={() => (
          <div className="flex items-center justify-center">
            <ManifestationEmergence stage={0} />
          </div>
        )}
        renderState1={() => (
          <div className="flex flex-col items-center justify-center gap-8">
            <ManifestationEmergence stage={1} />
            <p className="text-center text-xs uppercase tracking-[0.28em] text-neutral-500">
              What is manifesting now?
            </p>
          </div>
        )}
        renderState2={() => (
          <div className="flex flex-col items-center justify-center gap-8">
            <ManifestationEmergence stage={2} />
            <p className="max-w-xl text-center text-lg font-medium leading-relaxed tracking-tight text-neutral-200 sm:text-xl md:text-2xl">
              Reality is always greater than the framework used to observe it.
            </p>
          </div>
        )}
        renderState3={() => (
          <div className="flex flex-col items-center justify-center gap-7">
            <ManifestationEmergence stage={3} />
            <p className="text-center text-xl font-medium tracking-tight text-neutral-100 sm:text-2xl">
              You Are Not a Type.
            </p>
            <BeginObservationButton onActivate={handleBeginObservation} />
          </div>
        )}
      />
    </LayoutContainer>
  );
}
