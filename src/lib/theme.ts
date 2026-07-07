export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "linkora-theme";

/** Reads the theme the no-flash script already applied to <html>. */
export function readAppliedTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Reflects the theme onto <html> so CSS variables and `color-scheme` flip. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
