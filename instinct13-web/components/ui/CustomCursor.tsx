"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * CustomCursor
 *
 * Renders a 2-layer custom cursor:
 * 1. A small dot that tracks the pointer exactly (fast spring).
 * 2. A larger ring that follows with a gentle lag (slow spring).
 *
 * Interactions:
 * - Expands the ring when hovering interactive elements (buttons, links).
 * - Hides on touch devices (pointer: coarse).
 * - Hidden via CSS when `prefers-reduced-motion` is set.
 *
 * Usage: Render once inside RootLayout. The native cursor is hidden via globals.css.
 */
export function CustomCursor() {
  const prefersReduced = usePrefersReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX = useSpring(mouseX, { stiffness: 800, damping: 40, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 40, mass: 0.2 });

  const ringX = useSpring(mouseX, { stiffness: 100, damping: 20, mass: 0.8 });
  const ringY = useSpring(mouseY, { stiffness: 100, damping: 20, mass: 0.8 });

  const isHovering = useRef(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on pointer:fine (mouse/trackpad) — not touch
    const mql = window.matchMedia("(pointer: coarse)");
    if (mql.matches) return;

    function onMove(e: PointerEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }

    function onOver(e: PointerEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, label",
      );
      const next = !!interactive;
      if (next !== isHovering.current) {
        isHovering.current = next;
        if (ringRef.current) {
          ringRef.current.style.width = next ? "48px" : "28px";
          ringRef.current.style.height = next ? "48px" : "28px";
          ringRef.current.style.borderColor = next
            ? "rgba(255,255,255,0.7)"
            : "rgba(255,255,255,0.35)";
        }
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [mouseX, mouseY]);

  if (prefersReduced) return null;

  return (
    <>
      {/* Outer ring — slow lag */}
      <motion.div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999] rounded-full border border-white/35"
        style={{
          x: ringX,
          y: ringY,
          width: 28,
          height: 28,
          translateX: "-50%",
          translateY: "-50%",
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.2s ease",
        }}
      />

      {/* Inner dot — fast */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999] h-1.5 w-1.5 rounded-full bg-white"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
