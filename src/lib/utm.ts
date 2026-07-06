export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

const UTM_KEYS: Record<keyof UtmParams, string> = {
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
  term: "utm_term",
  content: "utm_content",
};

/** True when at least one UTM field has a value. */
export function hasUtm(utm: UtmParams): boolean {
  return Object.values(utm).some((value) => value?.trim());
}

/**
 * Append non-empty UTM params to a URL, preserving existing query params.
 * Returns the input unchanged when it isn't a valid absolute URL.
 */
export function appendUtm(rawUrl: string, utm: UtmParams): string {
  if (!hasUtm(utm)) return rawUrl;
  try {
    const url = new URL(rawUrl);
    for (const key of Object.keys(UTM_KEYS) as (keyof UtmParams)[]) {
      const value = utm[key]?.trim();
      if (value) url.searchParams.set(UTM_KEYS[key], value);
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}
