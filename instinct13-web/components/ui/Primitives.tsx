"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { clsx } from "clsx";
import { fadeUpVariants, lineVariants } from "@/lib/motion/text";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

/**
 * Section
 *
 * Reusable section wrapper with consistent vertical spacing and
 * scroll-triggered fade-up reveal.
 */

export interface SectionProps {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function Section({ children, className, bordered }: SectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    amount: 0.12,
  });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      variants={prefersReduced ? {} : fadeUpVariants}
      initial={prefersReduced ? "visible" : "hidden"}
      animate={isInView || prefersReduced ? "visible" : "hidden"}
      className={clsx(
        "space-y-4",
        bordered && "border-t border-white/5 pt-8",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

/**
 * SectionHeading
 *
 * Consistent h2 with a decorative expanding line beneath it.
 */

export interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    amount: 0.5,
  });

  return (
    <div className="space-y-2">
      <h2
        ref={ref}
        className={clsx(
          "text-lg font-semibold tracking-wide text-neutral-200",
          className,
        )}
      >
        {children}
      </h2>
      <motion.div
        variants={prefersReduced ? {} : lineVariants}
        initial={prefersReduced ? "visible" : "hidden"}
        animate={isInView || prefersReduced ? "visible" : "hidden"}
        className="h-px w-12 bg-white/15"
      />
    </div>
  );
}

/**
 * BodyText
 *
 * Consistent body paragraph styling.
 */

export interface BodyTextProps {
  children: ReactNode;
  className?: string;
}

export function BodyText({ children, className }: BodyTextProps) {
  return (
    <p className={clsx("leading-relaxed text-neutral-400", className)}>
      {children}
    </p>
  );
}

/**
 * PremiumLink
 *
 * Styled anchor with hover underline grow effect.
 */

export interface PremiumLinkProps {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}

export function PremiumLink({
  href,
  children,
  external,
  className,
}: PremiumLinkProps) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      data-intent-premium=""
      className={clsx(
        "group inline-block text-sm font-medium text-neutral-300",
        "transition-colors duration-150 hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "relative",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white/60 transition-all duration-300 group-hover:w-full" />
      </span>
    </a>
  );
}
