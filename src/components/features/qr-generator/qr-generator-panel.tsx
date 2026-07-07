"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { QrErrorCorrection, QrOptions } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ImageIcon, LinkIcon } from "@/components/ui/icons";
import { QrCodePreview } from "./qr-code-preview";

const ERROR_LEVELS: QrErrorCorrection[] = ["L", "M", "Q", "H"];

/** Maps each error-correction level to its `Qr` translation key. */
const LEVEL_LABEL_KEY: Record<QrErrorCorrection, string> = {
  L: "levelLow",
  M: "levelMedium",
  Q: "levelHigh",
  H: "levelMax",
};

const DEFAULT_OPTIONS: QrOptions = {
  value: "",
  size: 300,
  color: "#0b1020",
  background: "#ffffff",
  errorCorrection: "M",
};

/** `seedValue` prefills the content, e.g. a freshly shortened URL (Dynamic QR). */
export function QrGeneratorPanel({ seedValue }: { seedValue?: string }) {
  const t = useTranslations("Qr");
  const [options, setOptions] = useState<QrOptions>(DEFAULT_OPTIONS);

  function update<K extends keyof QrOptions>(key: K, value: QrOptions[K]) {
    setOptions((prev) => ({ ...prev, [key]: value }));
  }

  // Apply an incoming seed (only when it actually changes) without locking the
  // field — the user can still edit afterwards.
  const lastSeed = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (seedValue && seedValue !== lastSeed.current) {
      lastSeed.current = seedValue;
      setOptions((prev) => ({ ...prev, value: seedValue }));
    }
  }, [seedValue]);

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
      {/* Controls */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <label htmlFor="qr-value" className="text-sm font-medium text-foreground/70">
            {t("contentLabel")}
          </label>
          <Input
            id="qr-value"
            type="text"
            placeholder={t("contentPlaceholder")}
            value={options.value}
            icon={<LinkIcon className="size-5" />}
            onChange={(e) => update("value", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ColorField
            label={t("colorLabel")}
            value={options.color}
            onChange={(v) => update("color", v)}
          />
          <ColorField
            label={t("bgLabel")}
            value={options.background}
            onChange={(v) => update("background", v)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground/70">
            {t("errorLevel")}
          </span>
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-foreground/10 bg-foreground/5 p-1.5">
            {ERROR_LEVELS.map((level) => {
              const active = options.errorCorrection === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => update("errorCorrection", level)}
                  className={cn(
                    "h-9 rounded-xl text-xs font-semibold transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow shadow-brand-500/30"
                      : "text-foreground/55 hover:text-foreground/85",
                  )}
                >
                  {t(LEVEL_LABEL_KEY[level])}
                </button>
              );
            })}
          </div>
        </div>

        <LogoField
          value={options.logo ?? null}
          onChange={(logo) => update("logo", logo)}
        />
      </div>

      {/* Preview */}
      <div className="md:w-64">
        <QrCodePreview options={options} />
      </div>
    </div>
  );
}

interface LogoFieldProps {
  value: string | null;
  onChange: (logo: string | null) => void;
}

/** Optional center-logo upload (read to a data URL, PNG output only). */
function LogoField({ value, onChange }: LogoFieldProps) {
  const t = useTranslations("Qr");

  function handleFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground/70">
        {t("logoLabel")}
      </span>
      <div className="flex items-center gap-3">
        <label className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-foreground/12 bg-foreground/5 text-sm font-medium text-foreground/80 transition-colors hover:bg-foreground/10">
          <ImageIcon className="size-4" />
          {value ? t("changeLogo") : t("uploadLogo")}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        {value && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={t("logoAlt")}
              className="size-11 rounded-xl border border-foreground/15 object-contain"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-sm text-foreground/50 transition-colors hover:text-rose-300"
            >
              {t("removeLogo")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Compact color swatch + hex input pair. */
function ColorField({ label, value, onChange }: ColorFieldProps) {
  const t = useTranslations("Qr");

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground/70">{label}</span>
      <div className="flex items-center gap-2 rounded-2xl border border-foreground/12 bg-foreground/5 p-1.5 pl-3">
        <span
          className="size-7 shrink-0 rounded-lg border border-foreground/20"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full min-w-0 bg-transparent font-mono text-sm text-foreground outline-none"
          aria-label={label}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
          aria-label={t("colorPickerAria", { label })}
        />
      </div>
    </label>
  );
}
