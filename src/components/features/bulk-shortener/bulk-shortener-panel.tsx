"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { isValidUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { DownloadIcon } from "@/components/ui/icons";

interface BulkResult {
  input: string;
  shortUrl?: string;
  error?: string;
}

/** Localized fallbacks for when the API returns no message / the request fails. */
interface BulkFallbacks {
  rowError: string;
  connectionError: string;
}

async function shortenOne(
  url: string,
  fallbacks: BulkFallbacks,
): Promise<BulkResult> {
  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    if (!response.ok)
      return { input: url, error: data?.error ?? fallbacks.rowError };
    return { input: url, shortUrl: data.shortUrl as string };
  } catch {
    return { input: url, error: fallbacks.connectionError };
  }
}

function toCsv(results: BulkResult[]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = results
    .filter((r) => r.shortUrl)
    .map((r) => `${escape(r.input)},${escape(r.shortUrl!)}`);
  return ["Original URL,Short URL", ...rows].join("\n");
}

export function BulkShortenerPanel() {
  const t = useTranslations("Bulk");
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const urls = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      setError(t("emptyError"));
      return;
    }
    const invalid = urls.filter((url) => !isValidUrl(url));
    if (invalid.length > 0) {
      setError(t("invalidError", { count: invalid.length }));
      return;
    }

    setLoading(true);
    const fallbacks: BulkFallbacks = {
      rowError: t("rowError"),
      connectionError: t("connectionError"),
    };
    const shortened = await Promise.all(
      urls.map((url) => shortenOne(url, fallbacks)),
    );
    setResults(shortened);
    setLoading(false);
    router.refresh();
  }

  function downloadCsv() {
    const blob = new Blob([toCsv(results)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "linkora-bulk.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const successCount = results.filter((r) => r.shortUrl).length;

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="bulk-urls" className="text-sm font-medium text-foreground/70">
          {t("label")}
        </label>
        <textarea
          id="bulk-urls"
          rows={6}
          placeholder={t("placeholder")}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          className="w-full resize-y rounded-2xl border border-foreground/12 bg-foreground/5 p-4 font-mono text-sm text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-brand-400/70 focus:bg-foreground/10"
        />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <Button type="submit" variant="primary" size="glass-lg" loading={loading}>
          {loading ? t("submitting") : t("submit")}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/60">
              {t("successCount", {
                success: successCount,
                total: results.length,
              })}
            </p>
            <Button
              variant="glass-outline"
              size="glass-sm"
              onClick={downloadCsv}
            >
              <DownloadIcon className="size-4" />
              {t("exportCsv")}
            </Button>
          </div>

          <ul className="flex flex-col gap-2">
            {results.map((result, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-foreground/40" title={result.input}>
                    {result.input}
                  </p>
                  {result.shortUrl ? (
                    <p className="truncate font-mono text-sm text-foreground">
                      {result.shortUrl}
                    </p>
                  ) : (
                    <p className="text-sm text-rose-400">{result.error}</p>
                  )}
                </div>
                {result.shortUrl && <CopyButton value={result.shortUrl} />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
