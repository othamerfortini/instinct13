"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * GlassNav
 *
 * Premium glassmorphism navigation bar.
 *
 * - Fixed at top with backdrop blur and subtle border.
 * - Active link is visually highlighted.
 * - Accessible: semantic nav landmark, aria-current on active link.
 * - Responsive: scrollable on small screens.
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

const navVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

const reducedNavVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export function GlassNav({ visible = true }: GlassNavProps) {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = prefersReducedMotion ? reducedNavVariants : navVariants;

  return (
    <motion.header
      variants={variants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        aria-label="Primary navigation"
        className="glass mx-4 mt-4 rounded-2xl sm:mx-6 lg:mx-8"
      >
        <ul className="flex items-center justify-center gap-1 overflow-x-auto px-4 py-3 sm:gap-2 sm:px-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "relative inline-flex min-h-[36px] items-center rounded-xl px-3 py-1.5",
                    "text-sm font-medium tracking-wide",
                    "transition-all duration-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-xl bg-white/10"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}
