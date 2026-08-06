"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * ExperienceState
 *
 * Manages the four-state homepage cognitive sequence (States 0–3).
 *
 * Architecture:
 * - State machine logic lives here (timer management, user interrupts).
 * - UI rendering is delegated to `children` render prop for each state.
 * - No content text, routing, or business decisions embedded.
 * - Respects prefers-reduced-motion (skips to final state).
 * - Keyboard, pointer, and screen-reader accessible.
 *
 * Props accept render functions for each state so that content
 * is injected by the parent — keeping this component reusable
 * and free of domain-specific content.
 */

export type HomepageState = 0 | 1 | 2 | 3;

export interface ExperienceStateProps {
  /** Render function for State 0 content */
  renderState0: () => ReactNode;
  /** Render function for State 1 content */
  renderState1: () => ReactNode;
  /** Render function for State 2 content */
  renderState2: () => ReactNode;
  /** Render function for State 3 content */
  renderState3: () => ReactNode;
  /** Auto-advance interval in ms per state (default 4000) */
  autoAdvanceInterval?: number;
  /** Called when the sequence reaches State 3 */
  onSequenceComplete?: () => void;
  /** Called on each state change */
  onStateChange?: (state: HomepageState) => void;
  /** Optional className for the outer container */
  className?: string;
}

const stateRenderers: Record<
  HomepageState,
  keyof Pick<
    ExperienceStateProps,
    "renderState0" | "renderState1" | "renderState2" | "renderState3"
  >
> = {
  0: "renderState0",
  1: "renderState1",
  2: "renderState2",
  3: "renderState3",
};

/**
 * Get the next state in the sequence.
 * State 3 is terminal (sequence complete).
 */
function nextState(current: HomepageState): HomepageState {
  return current < 3 ? ((current + 1) as HomepageState) : 3;
}

export function ExperienceState({
  renderState0,
  renderState1,
  renderState2,
  renderState3,
  autoAdvanceInterval = 4000,
  onSequenceComplete,
  onStateChange,
  className,
}: ExperienceStateProps) {
  const [currentState, setCurrentState] = useState<HomepageState>(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCalledComplete = useRef(false);

  // If reduced motion is preferred, skip to final state immediately
  useEffect(() => {
    if (prefersReducedMotion && currentState !== 3) {
      setCurrentState(3);
      onStateChange?.(3);
      if (!hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onSequenceComplete?.();
      }
    }
  }, [prefersReducedMotion, currentState, onSequenceComplete, onStateChange]);

  // Auto-advance timer management
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Don't auto-advance past State 3 or if reduced motion
    if (currentState === 3 || prefersReducedMotion) {
      return;
    }

    timerRef.current = setTimeout(() => {
      const next = nextState(currentState);
      setCurrentState(next);
      onStateChange?.(next);
      if (next === 3 && !hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onSequenceComplete?.();
      }
    }, autoAdvanceInterval);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    currentState,
    autoAdvanceInterval,
    prefersReducedMotion,
    onSequenceComplete,
    onStateChange,
  ]);

  // User-initiated advance (click, tap, key)
  const advanceState = useCallback(() => {
    if (currentState === 3) return;
    // Clear timer on user interaction (User Sovereignty principle)
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const next = nextState(currentState);
    setCurrentState(next);
    onStateChange?.(next);
    if (next === 3 && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onSequenceComplete?.();
    }
  }, [currentState, onSequenceComplete, onStateChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        advanceState();
      }
    },
    [advanceState],
  );

  const handleClick = useCallback(() => {
    advanceState();
  }, [advanceState]);

  const renderers: Record<HomepageState, () => ReactNode> = {
    0: renderState0,
    1: renderState1,
    2: renderState2,
    3: renderState3,
  };

  const fadeVariants = prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  return (
    <section
      role="region"
      aria-label="Homepage introduction sequence"
      aria-live="polite"
      tabIndex={0}
      onClick={currentState < 3 ? handleClick : undefined}
      onKeyDown={currentState < 3 ? handleKeyDown : undefined}
      className={[
        "flex min-h-dvh w-full cursor-pointer select-none items-center justify-center",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`state-${currentState}`}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex w-full items-center justify-center px-4"
        >
          {renderers[currentState]()}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
