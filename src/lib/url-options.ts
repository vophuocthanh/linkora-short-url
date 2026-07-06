import type { UtmParams } from "./utm";

// ---------------------------------------------------------------------------
// Expiry
// ---------------------------------------------------------------------------

export type ExpiryChoice = "none" | "1d" | "7d" | "30d";

export const EXPIRY_CHOICES: ExpiryChoice[] = ["none", "1d", "7d", "30d"];

/** Number of days for each expiry choice (0 = never). */
export const EXPIRY_DAYS: Record<ExpiryChoice, number> = {
  none: 0,
  "1d": 1,
  "7d": 7,
  "30d": 30,
};

/** Maps each expiry choice to its i18n key in the `Advanced` namespace. */
export const EXPIRY_LABEL_KEY: Record<ExpiryChoice, string> = {
  none: "expiryNone",
  "1d": "expiry1d",
  "7d": "expiry7d",
  "30d": "expiry30d",
};

/** Convert an expiry choice into an ISO timestamp (or undefined = never). */
export function expiryToIso(choice: ExpiryChoice): string | undefined {
  const days = EXPIRY_DAYS[choice];
  if (!days) return undefined;
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

// ---------------------------------------------------------------------------
// Link advanced options
// ---------------------------------------------------------------------------

export interface LinkAdvanced {
  customSlug: string;
  password: string;
  maxClicks: string;
  expiry: ExpiryChoice;
  safePreview: boolean;
  utm: UtmParams;
}

export const DEFAULT_ADVANCED: LinkAdvanced = {
  customSlug: "",
  password: "",
  maxClicks: "",
  expiry: "none",
  safePreview: false,
  utm: {},
};

// ---------------------------------------------------------------------------
// UTM fields (UI helpers)
// ---------------------------------------------------------------------------

export const UTM_FIELDS: { key: keyof UtmParams; label: string }[] = [
  { key: "source", label: "Source" },
  { key: "medium", label: "Medium" },
  { key: "campaign", label: "Campaign" },
  { key: "term", label: "Term" },
  { key: "content", label: "Content" },
];
