import { create } from "zustand";
import {
  applyTheme,
  readAppliedTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  // The no-flash script sets data-theme before hydration, so we start from it.
  theme: readAppliedTheme(),
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures (private mode, quota) — theme still applies.
    }
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));

// Follow the OS preference until the user makes an explicit choice.
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (event) => {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      const theme: Theme = event.matches ? "light" : "dark";
      applyTheme(theme);
      useThemeStore.setState({ theme });
    });
}
