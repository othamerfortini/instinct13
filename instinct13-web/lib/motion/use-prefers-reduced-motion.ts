"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * usePrefersReducedMotion
 *
 * Returns `true` when the user's OS/browser preference indicates reduced motion.
 * Hydrates to `false` on the server, updates on mount via `matchMedia`.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    // Set initial value
    setPrefersReduced(mql.matches);

    // Listen for changes
    function handleChange(event: MediaQueryListEvent) {
      setPrefersReduced(event.matches);
    }

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
