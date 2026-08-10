import {
  EMPTY_INTENT_SIGNALS,
  type IntentSignals,
  type IntentSnapshot,
  type IntentState,
} from "./types";

const INTENT_ORDER: IntentState[] = [
  "explorer",
  "thinker",
  "collaborator",
  "observer",
];

const WEIGHTS: Record<IntentState, IntentSignals> = {
  explorer: {
    pageDiversity: 0.3,
    navigationDepth: 0.2,
    discoveryEngagement: 0.75,
    reflectionEngagement: 0,
    contactEngagement: 0,
    quietEngagement: 0,
    returnVisits: 0.1,
    premiumLinkEngagement: 0.35,
  },
  thinker: {
    pageDiversity: 0.1,
    navigationDepth: 0.1,
    discoveryEngagement: 0.1,
    reflectionEngagement: 0.85,
    contactEngagement: 0,
    quietEngagement: 0.25,
    returnVisits: 0.15,
    premiumLinkEngagement: 0,
  },
  collaborator: {
    pageDiversity: 0,
    navigationDepth: 0.1,
    discoveryEngagement: 0,
    reflectionEngagement: 0.1,
    contactEngagement: 0.95,
    quietEngagement: 0,
    returnVisits: 0.2,
    premiumLinkEngagement: 0.1,
  },
  observer: {
    pageDiversity: 0,
    navigationDepth: 0,
    discoveryEngagement: 0,
    reflectionEngagement: 0.2,
    contactEngagement: 0,
    quietEngagement: 0.9,
    returnVisits: 0.25,
    premiumLinkEngagement: 0,
  },
};

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function normalizeSignals(
  signals: Partial<IntentSignals>,
): IntentSignals {
  return {
    pageDiversity: clamp(signals.pageDiversity ?? 0),
    navigationDepth: clamp(signals.navigationDepth ?? 0),
    discoveryEngagement: clamp(signals.discoveryEngagement ?? 0),
    reflectionEngagement: clamp(signals.reflectionEngagement ?? 0),
    contactEngagement: clamp(signals.contactEngagement ?? 0),
    quietEngagement: clamp(signals.quietEngagement ?? 0),
    returnVisits: clamp(signals.returnVisits ?? 0),
    premiumLinkEngagement: clamp(signals.premiumLinkEngagement ?? 0),
  };
}

export function scoreIntent(
  signals: IntentSignals,
  intent: IntentState,
): number {
  return Object.entries(WEIGHTS[intent]).reduce((score, [key, weight]) => {
    return score + signals[key as keyof IntentSignals] * weight;
  }, 0);
}

export function inferIntent(
  partialSignals: Partial<IntentSignals> = EMPTY_INTENT_SIGNALS,
): IntentSnapshot {
  const signals = normalizeSignals(partialSignals);
  const scores = INTENT_ORDER.map((intent) => ({
    intent,
    score: scoreIntent(signals, intent),
  })).sort((a, b) => b.score - a.score);

  const strongest = scores[0];
  const runnerUp = scores[1];

  if (strongest.score === 0) {
    return { intent: "observer", confidence: 0, signals };
  }

  return {
    intent: strongest.intent,
    confidence: Math.round(
      clamp((strongest.score - runnerUp.score) / strongest.score) * 100,
    ),
    signals,
  };
}
