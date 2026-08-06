import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Circle — Instinct 13",
  description:
    "The Circle is the first symbolic framework for observing Manifestations.",
};

export default function TheCirclePage() {
  return (
    <ContentPage>
      <h1 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
        The Circle
      </h1>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">Overview</h2>
        <p className="leading-relaxed text-neutral-300">
          The Circle is the first symbolic framework within the Instinct 13
          universe. It provides a structured language for observing
          Manifestations — the patterns of behavior, thought, and energy that
          emerge in a person at a given moment.
        </p>
        <p className="leading-relaxed text-neutral-300">
          The Circle does not classify people. It offers a symbolic vocabulary
          for observing what is present now.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Constitutional Role
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Circle operates under the authority of the Instinct 13
          Constitution. All content derived from The Circle must strengthen the
          foundational purpose: greater awareness, better decisions, and
          intentional development.
        </p>
        <p className="leading-relaxed text-neutral-300">
          Principles are permanent. The Manifestations observed through The
          Circle are not.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Relationship with Manifestations
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Circle provides the symbolic language through which Manifestations
          are observed. It does not produce a fixed type for a person — it
          surfaces what is present and active at a given moment, enabling
          reflection and intentional cultivation.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">Collections</h2>
        <p className="leading-relaxed text-neutral-300">
          The Circle organizes Manifestations into Collections — groupings that
          share symbolic and observational characteristics. Collections are a
          tool for navigation, not for permanent categorization.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Symbolic Language
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Circle uses symbolic language to describe Manifestations. Symbols
          are observational tools. They carry meaning without prescribing
          identity. They enable the observer to see more clearly without
          confining the observed.
        </p>
        <nav aria-label="Related framework" className="mt-4">
          <a
            href="/the-mirror"
            className="text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Explore The Mirror →
          </a>
        </nav>
      </section>
    </ContentPage>
  );
}
