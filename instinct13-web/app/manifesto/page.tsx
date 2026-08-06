import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";

export const metadata: Metadata = {
  title: "Manifesto — Instinct 13",
  description:
    "The official Instinct 13 Manifesto. Why Instinct 13 exists and what it is not.",
};

export default function ManifestoPage() {
  return (
    <ContentPage>
      <h1 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
        Manifesto
      </h1>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Why Instinct 13 Exists
        </h2>
        <p className="leading-relaxed text-neutral-300">
          Most frameworks for understanding human behavior end in classification.
          You answer a set of questions and receive a type, a label, a box. The
          box is meant to explain you. It often constrains you instead.
        </p>
        <p className="leading-relaxed text-neutral-300">
          Instinct 13 exists because people deserve something different: a way
          to observe what is actually happening within them, understand why it
          may be emerging, and consciously decide what they want to cultivate
          next.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          What Instinct 13 Is Not
        </h2>
        <ul className="list-none space-y-2 text-neutral-300">
          <li>
            — It is not a personality test.
          </li>
          <li>
            — It is not a brand built around types.
          </li>
          <li>
            — It is not a system that tells you who you are.
          </li>
          <li>
            — It is not certainty dressed as insight.
          </li>
        </ul>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Organizational Identity
        </h2>
        <p className="leading-relaxed text-neutral-300">
          Instinct 13 is building an operating system for understanding human
          behavior.
        </p>
        <p className="leading-relaxed text-neutral-300">
          We do not exist to classify people. We exist to create frameworks that
          help people observe what is manifesting, understand why it may be
          emerging, and consciously decide what they want to cultivate next.
        </p>
        <p className="leading-relaxed text-neutral-300">
          Our goal is not certainty. Our goal is greater awareness, better
          decisions, and intentional development.
        </p>
        <p className="mt-4 font-medium">
          Principles are permanent. Manifestations are not.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Explore the Frameworks
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Circle and The Mirror are the first frameworks through which
          Instinct 13 creates conditions for observation, reflection, and
          intentional cultivation.
        </p>
        <nav aria-label="Framework links" className="mt-4 flex gap-6">
          <a
            href="/the-circle"
            className="text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            The Circle →
          </a>
          <a
            href="/the-mirror"
            className="text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            The Mirror →
          </a>
        </nav>
      </section>
    </ContentPage>
  );
}
