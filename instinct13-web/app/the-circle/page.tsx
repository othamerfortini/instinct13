import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";
import {
  Section,
  SectionHeading,
  BodyText,
  PremiumLink,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "The Circle — Instinct 13",
  description:
    "The Circle is the first symbolic framework for observing Manifestations.",
};

export default function TheCirclePage() {
  return (
    <ContentPage>
      <h1 className="mb-12 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        The Circle
      </h1>

      <div className="space-y-10">
        <Section>
          <SectionHeading>Overview</SectionHeading>
          <BodyText>
            The Circle is the first symbolic framework within the Instinct 13
            universe. It provides a structured language for observing
            Manifestations — the patterns of behavior, thought, and energy that
            emerge in a person at a given moment.
          </BodyText>
          <BodyText>
            The Circle does not classify people. It offers a symbolic vocabulary
            for observing what is present now.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Constitutional Role</SectionHeading>
          <BodyText>
            The Circle operates under the authority of the Instinct 13
            Constitution. All content derived from The Circle must strengthen
            the foundational purpose: greater awareness, better decisions, and
            intentional development.
          </BodyText>
          <BodyText>
            Principles are permanent. The Manifestations observed through The
            Circle are not.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Relationship with Manifestations</SectionHeading>
          <BodyText>
            The Circle provides the symbolic language through which
            Manifestations are observed. It does not produce a fixed type for a
            person — it surfaces what is present and active at a given moment,
            enabling reflection and intentional cultivation.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Collections</SectionHeading>
          <BodyText>
            The Circle organizes Manifestations into Collections — groupings
            that share symbolic and observational characteristics. Collections
            are a tool for navigation, not for permanent categorization.
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Symbolic Language</SectionHeading>
          <BodyText>
            The Circle uses symbolic language to describe Manifestations.
            Symbols are observational tools. They carry meaning without
            prescribing identity. They enable the observer to see more clearly
            without confining the observed.
          </BodyText>
          <nav aria-label="Related framework" className="mt-4">
            <PremiumLink href="/the-mirror">Explore The Mirror →</PremiumLink>
          </nav>
        </Section>
      </div>
    </ContentPage>
  );
}
