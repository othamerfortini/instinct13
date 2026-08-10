"use client";

import { useIntent } from "@/components/providers/IntentProvider";

const COPY = {
  explorer:
    "Found a thread worth following? Send us a message and we'll get back to you.",
  thinker:
    "If a question or reflection is still unfolding, send us a message and we'll get back to you.",
  collaborator:
    "Ready to begin a conversation? Send us a message and we'll get back to you.",
  observer:
    "Have a question or want to connect? Send us a message and we'll get back to you.",
} as const;

export function AdaptiveContactIntro() {
  const { intent } = useIntent();

  return <p className="leading-relaxed text-neutral-400">{COPY[intent]}</p>;
}
