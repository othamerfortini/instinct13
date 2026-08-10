import type { Metadata } from "next";
import { ContentPage } from "@/components/ui";
import {
  Section,
  SectionHeading,
  BodyText,
  PremiumLink,
  ContactForm,
  AdaptiveContactIntro,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact — Instinct 13",
  description: "Contact Instinct 13 and explore the project repository.",
};

export default function ContactPage() {
  return (
    <ContentPage>
      <h1 className="mb-12 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Contact
      </h1>

      <div className="space-y-10">
        <Section>
          <SectionHeading>Get in Touch</SectionHeading>
          <AdaptiveContactIntro />
          <ContactForm />
        </Section>

        <Section>
          <SectionHeading>Repository</SectionHeading>
          <BodyText>
            The Instinct 13 repository is the canonical source of all approved
            documentation, constitutional architecture, and implementation work.
          </BodyText>
          <PremiumLink
            href="https://github.com/othamerfortini/instinct13"
            external
          >
            github.com/othamerfortini/instinct13 →
          </PremiumLink>
        </Section>

        <Section>
          <SectionHeading>Current Roadmap Status</SectionHeading>
          <BodyText>
            <strong className="font-medium text-neutral-200">
              Architectural Baseline:
            </strong>{" "}
            v1.0
          </BodyText>
          <BodyText>
            <strong className="font-medium text-neutral-200">
              Current Phase:
            </strong>{" "}
            Phase II — Validation
          </BodyText>
          <BodyText>
            <strong className="font-medium text-neutral-200">
              Active Validation:
            </strong>{" "}
            VE-001 — Website implementation
          </BodyText>
        </Section>

        <Section>
          <SectionHeading>Documentation</SectionHeading>
          <BodyText>
            All approved documentation is version-controlled in the repository.
            The Constitution, Canon, and approved framework documents are the
            authoritative sources for all Instinct 13 content.
          </BodyText>
          <BodyText>Nothing is official until documented.</BodyText>
        </Section>
      </div>
    </ContentPage>
  );
}
