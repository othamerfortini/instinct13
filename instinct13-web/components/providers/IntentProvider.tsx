"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { inferIntent, normalizeSignals } from "@/lib/intent/engine";
import { loadIntentSignals, saveIntentSignals } from "@/lib/intent/storage";
import {
  EMPTY_INTENT_SIGNALS,
  type IntentSignals,
  type IntentSnapshot,
} from "@/lib/intent/types";

interface IntentContextValue extends IntentSnapshot {
  recordContactEngagement: () => void;
}

const IntentContext = createContext<IntentContextValue | null>(null);
const MAX_HISTORY_ENTRIES = 8;

function engagementForPath(pathname: string): keyof IntentSignals | null {
  if (pathname === "/manifesto" || pathname === "/philosophy") {
    return "reflectionEngagement";
  }

  if (
    pathname === "/manifestations" ||
    pathname === "/the-circle" ||
    pathname === "/the-mirror"
  ) {
    return "discoveryEngagement";
  }

  return null;
}

function increment(value: number, amount: number): number {
  return Math.min(1, value + amount);
}

function signalsMatch(current: IntentSignals, next: IntentSignals): boolean {
  return Object.keys(current).every(
    (key) =>
      current[key as keyof IntentSignals] ===
      next[key as keyof IntentSignals],
  );
}

function snapshotsMatch(
  current: IntentSnapshot,
  next: IntentSnapshot,
): boolean {
  return (
    current.intent === next.intent &&
    current.confidence === next.confidence &&
    Object.keys(current.signals).every(
      (key) =>
        current.signals[key as keyof IntentSignals] ===
        next.signals[key as keyof IntentSignals],
    )
  );
}

export function IntentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [snapshot, setSnapshot] = useState<IntentSnapshot>(() =>
    inferIntent(EMPTY_INTENT_SIGNALS),
  );
  const signalsRef = useRef<IntentSignals>(EMPTY_INTENT_SIGNALS);
  const pathHistoryRef = useRef<string[]>([]);
  const hydratedRef = useRef(false);
  const highestScrollRef = useRef(0);

  const updateSignals = useCallback(
    (updater: (current: IntentSignals) => IntentSignals) => {
      const currentSignals = signalsRef.current;
      const nextSignals = normalizeSignals(updater(currentSignals));
      if (signalsMatch(currentSignals, nextSignals)) return;

      const nextSnapshot = inferIntent(nextSignals);
      signalsRef.current = nextSignals;
      saveIntentSignals(nextSignals);

      setSnapshot((current) => {
        if (snapshotsMatch(current, nextSnapshot)) return current;
        return nextSnapshot;
      });
    },
    [],
  );

  useEffect(() => {
    const stored = loadIntentSignals();
    if (stored) {
      signalsRef.current = stored;
      setSnapshot(inferIntent(stored));
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;

    const history = pathHistoryRef.current;
    const returningToPage = history.includes(pathname);
    pathHistoryRef.current = [...history, pathname].slice(-MAX_HISTORY_ENTRIES);
    highestScrollRef.current = 0;

    updateSignals((current) => ({
      ...current,
      pageDiversity: increment(
        current.pageDiversity,
        history.includes(pathname) ? 0 : 0.2,
      ),
      navigationDepth: increment(current.navigationDepth, 0.16),
      contactEngagement:
        pathname === "/contact"
          ? increment(current.contactEngagement, 0.25)
          : current.contactEngagement,
      returnVisits: returningToPage
        ? increment(current.returnVisits, 0.25)
        : current.returnVisits,
    }));
  }, [pathname, updateSignals]);

  useEffect(() => {
    let frame: number | null = null;

    function captureScroll() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable <= 0) return;

        const depth = Math.min(1, window.scrollY / scrollable);
        if (depth - highestScrollRef.current < 0.25) return;
        highestScrollRef.current = depth;
        const signal = engagementForPath(pathname);
        if (!signal) return;

        updateSignals((current) => ({
          ...current,
          [signal]: Math.max(current[signal], depth),
        }));
      });
    }

    window.addEventListener("scroll", captureScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", captureScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [pathname, updateSignals]);

  useEffect(() => {
    const signal = engagementForPath(pathname);
    if (!signal) return;

    const timeout = window.setTimeout(() => {
      if (!document.hidden) {
        updateSignals((current) => ({
          ...current,
          [signal]: increment(current[signal], 0.2),
          quietEngagement: increment(current.quietEngagement, 0.1),
        }));
      }
    }, 12_000);

    return () => window.clearTimeout(timeout);
  }, [pathname, updateSignals]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-intent-premium]")) {
        updateSignals((current) => ({
          ...current,
          premiumLinkEngagement: increment(current.premiumLinkEngagement, 0.25),
        }));
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [updateSignals]);

  const recordContactEngagement = useCallback(() => {
    updateSignals((current) => ({
      ...current,
      contactEngagement: increment(current.contactEngagement, 0.2),
    }));
  }, [updateSignals]);

  const value = useMemo(
    () => ({ ...snapshot, recordContactEngagement }),
    [recordContactEngagement, snapshot],
  );

  return <IntentContext.Provider value={value}>{children}</IntentContext.Provider>;
}

export function useIntent(): IntentContextValue {
  const context = useContext(IntentContext);
  if (!context) {
    throw new Error("useIntent must be used within an IntentProvider.");
  }
  return context;
}
