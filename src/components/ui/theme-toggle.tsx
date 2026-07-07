"use client";

import { useTranslations } from "next-intl";
import { useThemeStore } from "@/stores/theme-store";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const label = t(theme === "dark" ? "switchToLight" : "switchToDark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      // aria-label depends on the client-resolved theme; the icons themselves are
      // driven by CSS (below), so only this attribute may differ from the SSR HTML.
      suppressHydrationWarning
      className="inline-flex size-9 items-center justify-center rounded-xl border border-foreground/12 bg-foreground/5 text-foreground/70 backdrop-blur transition-colors hover:text-foreground disabled:opacity-60"
    >
      {/* Both icons render identically on server and client; data-theme reveals one. */}
      <SunIcon className="hidden size-4.5 in-data-[theme=dark]:block" />
      <MoonIcon className="hidden size-4.5 in-data-[theme=light]:block" />
    </button>
  );
}
