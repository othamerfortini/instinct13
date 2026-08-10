export type IntentState = "explorer" | "thinker" | "collaborator" | "observer";

export interface IntentSignals {
  pageDiversity: number;
  navigationDepth: number;
  discoveryEngagement: number;
  reflectionEngagement: number;
  contactEngagement: number;
  quietEngagement: number;
  returnVisits: number;
  premiumLinkEngagement: number;
}

export interface IntentSnapshot {
  intent: IntentState;
  confidence: number;
  signals: IntentSignals;
}

export const EMPTY_INTENT_SIGNALS: IntentSignals = {
  pageDiversity: 0,
  navigationDepth: 0,
  discoveryEngagement: 0,
  reflectionEngagement: 0,
  contactEngagement: 0,
  quietEngagement: 0,
  returnVisits: 0,
  premiumLinkEngagement: 0,
};
