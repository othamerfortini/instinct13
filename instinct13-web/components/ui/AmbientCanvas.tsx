"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * AmbientCanvas
 *
 * Renders a full-viewport Canvas 2D particle system that creates a subtle,
 * breathing ambient background. Particles drift slowly and connect via
 * translucent lines when nearby — evoking a living, conscious field.
 *
 * - GPU-friendly: uses requestAnimationFrame with delta-time clamping.
 * - Respects prefers-reduced-motion (renders static particles only).
 * - Automatically resizes to window via ResizeObserver.
 * - Zero layout impact: position fixed, pointer-events none, z-index 0.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const PARTICLE_COUNT = 60; // O(n²) connection check; keep ≤ 80 for smooth 60 fps
const CONNECTION_DISTANCE = 140;
const PARTICLE_OPACITY_BASE = 0.18;
const LINE_OPACITY_BASE = 0.06;

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    radius: Math.random() * 1.2 + 0.4,
    opacity: Math.random() * 0.5 + PARTICLE_OPACITY_BASE,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: (Math.random() * 0.4 + 0.2) * 0.01,
  };
}

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    function init() {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(w, h),
      );
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    }

    resize();

    // Static render for reduced-motion
    if (prefersReduced) {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity * 0.5})`;
        ctx.fill();
      }
      return;
    }

    let lastTime = 0;

    function animate(time: number) {
      if (!canvas || !ctx) return;
      const dt = Math.min(time - lastTime, 50); // clamp delta
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Update & draw particles
      for (const p of particles) {
        p.pulse += p.pulseSpeed;
        const scale = 1 + Math.sin(p.pulse) * 0.3;

        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha =
              LINE_OPACITY_BASE * (1 - dist / CONNECTION_DISTANCE);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.6 }}
    />
  );
}
