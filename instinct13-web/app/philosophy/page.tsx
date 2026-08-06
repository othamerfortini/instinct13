import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";

export const metadata: Metadata = {
  title: "Philosophy — Instinct 13",
  description:
    "The Constitutional Philosophy and Foundational Principles of Instinct 13.",
};

export default function PhilosophyPage() {
  return (
    <ContentPage>
      <h1 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
        Philosophy
      </h1>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Organizational Identity
        </h2>
        <p className="leading-relaxed text-neutral-300">
          Instinct 13 is not building a brand. Instinct 13 is building an
          operating system for understanding human behavior.
        </p>
        <p className="leading-relaxed text-neutral-300">
          Every framework, methodology, product, and decision created by
          Instinct 13 must strengthen this purpose.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Constitutional Philosophy
        </h2>
        <p className="leading-relaxed text-neutral-300">
          We do not exist to classify people. We exist to create frameworks that
          help people observe what is manifesting, understand why it may be
          emerging, and consciously decide what they want to cultivate next.
        </p>
        <p className="leading-relaxed text-neutral-300">
          Our goal is not certainty. Our goal is greater awareness, better
          decisions, and intentional development.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Foundational Principles
        </h2>
        <ul className="list-none space-y-3 text-neutral-300">
          <li>
            <strong className="font-medium text-neutral-100">
              Observation over classification.
            </strong>{" "}
            Frameworks observe what is manifesting. They do not define what a
            person is.
          </li>
          <li>
            <strong className="font-medium text-neutral-100">
              Awareness over certainty.
            </strong>{" "}
            Greater awareness and better decisions are the measure of success,
            not conclusive answers.
          </li>
          <li>
            <strong className="font-medium text-neutral-100">
              Intentional development.
            </strong>{" "}
            The goal is to help people consciously decide what they want to
            cultivate next.
          </li>
          <li>
            <strong className="font-medium text-neutral-100">
              Principles are permanent. Manifestations are not.
            </strong>{" "}
            Structural principles endure. What manifests in a given moment is
            always subject to change.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">
          Architectural Baseline
        </h2>
        <p className="leading-relaxed text-neutral-300">
          The Constitution governs all of Instinct 13. No framework,
          methodology, product, or decision may contradict it. Nothing is
          official until documented.
        </p>
        <p className="leading-relaxed text-neutral-300">
          Reality is always greater than the framework used to observe it.
        </p>
      </section>
    </ContentPage>
  );
}
