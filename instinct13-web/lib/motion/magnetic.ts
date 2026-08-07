"use client";

import { useRef, useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * useMagnetic
 *
 * Returns spring-based x/y motion values and pointer event handlers
 * that pull an element toward the cursor when hovered.
 *
 * @param strength - How many pixels the element shifts toward the cursor (default: 12)
 * @param springConfig - Framer Motion spring config
 */
export function useMagnetic(
  strength = 12,
  springConfig = { stiffness: 200, damping: 20, mass: 0.6 },
) {
  const ref = useRef<HTMLElement | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = ((e.clientX - cx) / rect.width) * strength * 2;
      const dy = ((e.clientY - cy) / rect.height) * strength * 2;

      rawX.set(dx);
      rawY.set(dy);
    },
    [rawX, rawY, strength],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, x, y, handleMouseMove, handleMouseLeave };
}
