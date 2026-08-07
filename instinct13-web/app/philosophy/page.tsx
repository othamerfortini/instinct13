import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";
import {
  Section,
  SectionHeading,
  BodyText,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Philosophy — Instinct 13",
  description:
    "The Constitutional Philosophy and Foundational Principles of Instinct 13.",
};

export default function PhilosophyPage() {
  return (
    <ContentPage>
      <h1 className="mb-12 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Philosophy
      </h1>

      <div className="space-y-10">
        <Section>
          <SectionHeading>Organizational Identity</SectionHeading>
          <BodyText>
            Instinct 13 is not building a brand. Instinct 13 is building an
            operating system for understanding human behavior.
          </BodyText>
          <BodyText>
            Every framework, methodology, product, and decision created by
            Instinct 13 must strengthen this purpose.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Constitutional Philosophy</SectionHeading>
          <BodyText>
            We do not exist to classify people. We exist to create frameworks
            that help people observe what is manifesting, understand why it may
            be emerging, and consciously decide what they want to cultivate
            next.
          </BodyText>
          <BodyText>
            Our goal is not certainty. Our goal is greater awareness, better
            decisions, and intentional development.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Foundational Principles</SectionHeading>
          <ul className="list-none space-y-3 text-neutral-400">
            <li>
              <strong className="font-medium text-neutral-200">
                Observation over classification.
              </strong>{" "}
              Frameworks observe what is manifesting. They do not define what a
              person is.
            </li>
            <li>
              <strong className="font-medium text-neutral-200">
                Awareness over certainty.
              </strong>{" "}
              Greater awareness and better decisions are the measure of success,
              not conclusive answers.
            </li>
            <li>
              <strong className="font-medium text-neutral-200">
                Intentional development.
              </strong>{" "}
              The goal is to help people consciously decide what they want to
              cultivate next.
            </li>
            <li>
              <strong className="font-medium text-neutral-200">
                Principles are permanent. Manifestations are not.
              </strong>{" "}
              Structural principles endure. What manifests in a given moment is
              always subject to change.
            </li>
          </ul>
        </Section>

        <Section>
          <SectionHeading>Architectural Baseline</SectionHeading>
          <BodyText>
            The Constitution governs all of Instinct 13. No framework,
            methodology, product, or decision may contradict it. Nothing is
            official until documented.
          </BodyText>
          <BodyText>
            Reality is always greater than the framework used to observe it.
          </BodyText>
        </Section>
      </div>
    </ContentPage>
  );
}
