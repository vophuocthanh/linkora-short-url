"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ShortLink } from "@/lib/types";
import { isValidUrl, normalizeUrl } from "@/lib/utils";
import { appendUtm } from "@/lib/utm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "@/components/ui/icons";
import { ShortUrlResult } from "./short-url-result";
import {
  AdvancedOptions,
} from "./advanced-options";
import {
  DEFAULT_ADVANCED,
  expiryToIso,
  type LinkAdvanced,
} from "@/lib/url-options";

export function UrlShortenerPanel({
  onCreateQr,
}: {
  onCreateQr?: (value: string) => void;
}) {
  const t = useTranslations("Shortener");
  const tValidation = useTranslations("Validation");
  const router = useRouter();
  const [value, setValue] = useState("");
  const [advanced, setAdvanced] = useState<LinkAdvanced>(DEFAULT_ADVANCED);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortLink | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isValidUrl(value)) {
      setError(tValidation("invalidUrl"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: appendUtm(normalizeUrl(value), advanced.utm),
          customSlug: advanced.customSlug.trim() || undefined,
          password: advanced.password.trim() || undefined,
          maxClicks: advanced.maxClicks ? Number(advanced.maxClicks) : undefined,
          expiresAt: expiryToIso(advanced.expiry),
          safePreview: advanced.safePreview,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? t("genericError"));
        return;
      }

      setResult(data as ShortLink);
      router.refresh();
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="long-url" className="text-sm font-medium text-foreground/70">
          {t("inputLabel")}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="long-url"
            type="text"
            inputMode="url"
            placeholder={t("placeholder")}
            value={value}
            invalid={Boolean(error)}
            icon={<LinkIcon className="size-5" />}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            className="sm:flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            size="glass-lg"
            loading={loading}
            className="sm:w-auto"
          >
            {loading ? t("submitting") : t("submit")}
          </Button>
        </div>

        {error && (
          <p className="animate-fade-up text-sm text-rose-400">{error}</p>
        )}

        <AdvancedOptions value={advanced} onChange={setAdvanced} />
      </form>

      {result && <ShortUrlResult link={result} onCreateQr={onCreateQr} />}
    </div>
  );
}
