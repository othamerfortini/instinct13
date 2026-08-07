"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * AnimatedBackground
 *
 * Full-viewport dynamic gradient that reacts to cursor movement.
 *
 * - A slow-breathing radial gradient orb follows the cursor with a
 *   heavy spring (very lazy), creating a subtle glow that implies depth.
 * - A second, fixed large orb pulses at the top to anchor the composition.
 * - Respects prefers-reduced-motion (static gradient only).
 * - Zero layout impact: position fixed, pointer-events none, z-index 0.
 */
export function AnimatedBackground() {
  const prefersReduced = usePrefersReducedMotion();

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.3);

  const springX = useSpring(rawX, { stiffness: 18, damping: 14, mass: 1.5 });
  const springY = useSpring(rawY, { stiffness: 18, damping: 14, mass: 1.5 });

  // Map 0–1 viewport fractions → pixel positions
  const x = useTransform(
    springX,
    [0, 1],
    ["0vw", "100vw"],
  );
  const y = useTransform(
    springY,
    [0, 1],
    ["0vh", "100vh"],
  );

  useEffect(() => {
    if (prefersReduced) return;

    function onMove(e: PointerEvent) {
      rawX.set(e.clientX / window.innerWidth);
      rawY.set(e.clientY / window.innerHeight);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY, prefersReduced]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Ambient top-center glow — always present */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: "70vw",
          height: "55vh",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.032) 0%, transparent 70%)",
        }}
      />

      {/* Cursor-reactive orb */}
      {!prefersReduced && (
        <motion.div
          style={{
            position: "absolute",
            left: x,
            top: y,
            translateX: "-50%",
            translateY: "-50%",
            width: "50vw",
            height: "50vw",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 65%)",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
