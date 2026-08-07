"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";
import { staggerContainerVariants, scrollRevealVariants } from "@/lib/motion/scroll";

/**
 * Footer
 *
 * Premium modern footer for the Instinct 13 website.
 *
 * - Staggered scroll-triggered reveal for brand and nav.
 * - Minimal, elegant layout matching the brand tone.
 * - Responsive: stacks on mobile, horizontal on desktop.
 * - Accessible: proper landmarks and link labels.
 */

const FOOTER_LINKS = [
  { href: "/philosophy", label: "Philosophy" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/the-circle", label: "The Circle" },
  { href: "/the-mirror", label: "The Mirror" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <footer
      className="relative z-10 mt-auto border-t border-white/5"
      role="contentinfo"
    >
      <motion.div
        variants={prefersReducedMotion ? {} : staggerContainerVariants}
        initial={prefersReducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10"
      >
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <motion.div
            variants={prefersReducedMotion ? {} : scrollRevealVariants}
            className="space-y-1"
          >
            <Link
              href="/"
              aria-label="Instinct 13 — Home"
              className="text-base font-semibold tracking-tight text-white transition-opacity duration-150 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Instinct 13
            </Link>
            <p className="text-xs text-neutral-600">
              An operating system for understanding human behavior.
            </p>
          </motion.div>

          {/* Nav links */}
          <motion.nav
            variants={prefersReducedMotion ? {} : scrollRevealVariants}
            aria-label="Footer navigation"
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors duration-150 hover:text-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* Bottom row */}
        <motion.div
          variants={prefersReducedMotion ? {} : scrollRevealVariants}
          className="mt-10 flex flex-col items-start gap-2 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs text-neutral-700">
            &copy; {new Date().getFullYear()} Instinct 13. All rights reserved.
          </p>
          <p className="text-xs text-neutral-700">
            Principles are permanent. Manifestations are not.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

