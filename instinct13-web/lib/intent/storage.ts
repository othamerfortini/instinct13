import { normalizeSignals } from "./engine";
import { type IntentSignals } from "./types";

const STORAGE_KEY = "instinct13.intent-signals";

/**
 * Intent data is anonymous, non-sensitive, local to this browser tab, and
 * discarded when the browser session ends. It is never sent to a service.
 */
export function loadIntentSignals(): IntentSignals | null {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    return value ? normalizeSignals(JSON.parse(value) as IntentSignals) : null;
  } catch {
    return null;
  }
}

export function saveIntentSignals(signals: IntentSignals): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}
