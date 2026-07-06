"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { setUserLocale } from "@/i18n/locale";
import { localeDetails, locales, type Locale } from "@/i18n/config";
import { GlobeIcon } from "@/components/ui/icons";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const activeLocale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function selectLocale(locale: Locale) {
    setOpen(false);
    if (locale === activeLocale) return;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-2.5 py-1.5 text-sm text-white/70 backdrop-blur transition-colors hover:text-white disabled:opacity-60"
      >
        <GlobeIcon className="size-4 text-white/45" />
        <span>{localeDetails[activeLocale].flag}</span>
        <span className="hidden sm:inline">
          {localeDetails[activeLocale].label}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="glass-surface absolute right-0 z-20 mt-2 min-w-40 overflow-hidden rounded-xl p-1"
          >
            {locales.map((locale) => (
              <li key={locale}>
                <button
                  type="button"
                  role="option"
                  aria-selected={locale === activeLocale}
                  onClick={() => selectLocale(locale)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    locale === activeLocale
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span>{localeDetails[locale].flag}</span>
                  <span>{localeDetails[locale].label}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
