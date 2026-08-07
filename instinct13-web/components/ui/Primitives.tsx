import { type ReactNode } from "react";
import { clsx } from "clsx";

/**
 * Section
 *
 * Reusable section wrapper with consistent vertical spacing and optional border.
 */

export interface SectionProps {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function Section({ children, className, bordered }: SectionProps) {
  return (
    <section
      className={clsx(
        "space-y-4",
        bordered && "border-t border-white/5 pt-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * SectionHeading
 *
 * Consistent h2 styling for content page sections.
 */

export interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2
      className={clsx(
        "text-lg font-semibold tracking-wide text-neutral-200",
        className,
      )}
    >
      {children}
    </h2>
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
 * Styled anchor with arrow indicator for inline navigation.
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
      className={clsx(
        "inline-block text-sm font-medium text-neutral-300",
        "underline-offset-4 hover:text-white hover:underline",
        "transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
    >
      {children}
    </a>
  );
}
