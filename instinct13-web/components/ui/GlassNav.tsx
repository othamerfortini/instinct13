"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";
import { useMagnetic } from "@/lib/motion/magnetic";
import { useIntent } from "@/components/providers/IntentProvider";

/**
 * GlassNav
 *
 * Premium glassmorphism navigation bar with:
 * - Scroll-aware compact mode (shrinks on scroll).
 * - Magnetic hover effect on each nav link.
 * - AnimatePresence-compatible shared layout active indicator.
 * - Accessible: semantic nav landmark, aria-current on active link.
 * - Respects prefers-reduced-motion.
 */

export interface GlassNavProps {
  /** Whether the nav is visible (e.g. after homepage sequence) */
  visible?: boolean;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/the-circle", label: "The Circle" },
  { href: "/the-mirror", label: "The Mirror" },
  { href: "/contact", label: "Contact" },
] as const;

const NAV_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: NAV_EASE },
  },
};

const reducedNavVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

function MagneticNavLink({
  href,
  label,
  isActive,
  reduced,
  emphasized,
}: {
  href: string;
  label: string;
  isActive: boolean;
  reduced: boolean;
  emphasized: boolean;
}) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(8);

  return (
    <li className="shrink-0">
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={reduced ? {} : { x, y }}
        onMouseMove={reduced ? undefined : handleMouseMove}
        onMouseLeave={reduced ? undefined : handleMouseLeave}
        className="relative"
      >
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
          className={[
            "relative inline-flex min-h-[36px] items-center rounded-xl px-3 py-1.5",
            "text-sm font-medium tracking-wide",
            "transition-colors duration-200",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
            isActive
              ? "text-white"
              : emphasized
                ? "text-neutral-200 hover:text-white"
                : "text-neutral-400 hover:text-white",
          ].join(" ")}
        >
          {isActive && (
            <motion.span
              layoutId="nav-active-pill"
              className="absolute inset-0 rounded-xl bg-white/10"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          )}
          {label}
        </Link>
      </motion.div>
    </li>
  );
}

export function GlassNav({ visible = true }: GlassNavProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { intent } = useIntent();
  const calmExperience = prefersReducedMotion || intent === "observer";
  const variants = calmExperience ? reducedNavVariants : navVariants;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      variants={variants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        aria-label="Primary navigation"
        className={[
          "glass mx-4 mt-4 rounded-2xl sm:mx-6 lg:mx-8",
          "transition-[padding] duration-300",
          scrolled ? "py-1" : "",
        ].join(" ")}
      >
        <ul className="flex items-center justify-center gap-1 overflow-x-auto px-4 py-3 sm:gap-2 sm:px-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <MagneticNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isActive}
                reduced={calmExperience}
                emphasized={intent === "collaborator" && link.href === "/contact"}
              />
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}
