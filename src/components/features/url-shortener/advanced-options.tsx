"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { LinkAdvanced } from "@/lib/url-options";
import { EXPIRY_CHOICES, EXPIRY_LABEL_KEY, UTM_FIELDS } from "@/lib/url-options";
import { cn } from "@/lib/utils";
import { GlassInput } from "@/components/ui/glass-input";

interface AdvancedOptionsProps {
  value: LinkAdvanced;
  onChange: (value: LinkAdvanced) => void;
}

export function AdvancedOptions({ value, onChange }: AdvancedOptionsProps) {
  const t = useTranslations("Advanced");
  const [open, setOpen] = useState(false);

  function set<K extends keyof LinkAdvanced>(key: K, val: LinkAdvanced[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
      >
        {t("toggle")}
        <span className={cn("transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 border-t border-foreground/10 p-4">
          <Field label={t("customSlug")}>
            <GlassInput
              type="text"
              placeholder={t("customSlugPlaceholder")}
              value={value.customSlug}
              onChange={(e) => set("customSlug", e.target.value)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("expiry")}>
              <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-foreground/10 bg-foreground/5 p-1.5">
                {EXPIRY_CHOICES.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => set("expiry", choice)}
                    className={cn(
                      "h-9 rounded-xl text-xs font-semibold transition-all duration-200",
                      value.expiry === choice
                        ? "bg-linear-to-r from-brand-500 to-accent-500 text-white"
                        : "text-foreground/55 hover:text-foreground/85",
                    )}
                  >
                    {t(EXPIRY_LABEL_KEY[choice])}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={t("maxClicks")}>
              <GlassInput
                type="number"
                inputMode="numeric"
                min={1}
                placeholder={t("maxClicksPlaceholder")}
                value={value.maxClicks}
                onChange={(e) => set("maxClicks", e.target.value)}
              />
            </Field>
          </div>

          <Field label={t("password")}>
            <GlassInput
              type="password"
              autoComplete="off"
              placeholder={t("passwordPlaceholder")}
              value={value.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </Field>

          <label className="flex items-center gap-3 text-sm text-foreground/70">
            <input
              type="checkbox"
              checked={value.safePreview}
              onChange={(e) => set("safePreview", e.target.checked)}
              className="size-4 accent-brand-500"
            />
            {t("safePreview")}
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground/70">
              {t("utm")}
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {UTM_FIELDS.map((field) => (
                <GlassInput
                  key={field.key}
                  type="text"
                  placeholder={field.label}
                  value={value.utm[field.key] ?? ""}
                  onChange={(e) =>
                    set("utm", { ...value.utm, [field.key]: e.target.value })
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground/70">{label}</span>
      {children}
    </label>
  );
}
