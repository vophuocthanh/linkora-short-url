export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

export const localeDetails: Record<Locale, { label: string; flag: string }> = {
  vi: { label: "Tiếng Việt", flag: "🇻🇳" },
  en: { label: "English", flag: "🇬🇧" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}
