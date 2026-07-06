import { useTranslations } from "next-intl";
import type { ShortLink } from "@/lib/types";
import { CopyButton } from "@/components/ui/copy-button";
import { ExternalLinkIcon, QrIcon } from "@/components/ui/icons";

interface ShortUrlResultProps {
  link: ShortLink;
  onCreateQr?: (value: string) => void;
}

export function ShortUrlResult({ link, onCreateQr }: ShortUrlResultProps) {
  const t = useTranslations("Shortener");

  return (
    <div className="animate-fade-up rounded-2xl border border-white/12 bg-white/5 p-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent-400">
        <span className="size-1.5 rounded-full bg-accent-400" />
        {t("resultTitle")}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={link.shortUrl}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 flex-1 truncate font-mono text-lg font-semibold text-white transition-colors hover:text-brand-400"
          title={link.shortUrl}
        >
          {link.shortUrl}
        </a>

        <div className="flex shrink-0 items-center gap-2">
          <CopyButton value={link.shortUrl} />
          {onCreateQr && (
            <button
              type="button"
              onClick={() => onCreateQr(link.shortUrl)}
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-white/85 transition-all duration-200 hover:bg-white/14 hover:text-white active:scale-[0.98]"
              aria-label={t("createQrAria")}
            >
              <QrIcon className="size-4" />
            </button>
          )}
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-white/85 transition-all duration-200 hover:bg-white/14 hover:text-white active:scale-[0.98]"
            aria-label={t("openAria")}
          >
            <ExternalLinkIcon className="size-4" />
          </a>
        </div>
      </div>

      <p className="mt-3 truncate text-xs text-white/40" title={link.originalUrl}>
        ↳ {link.originalUrl}
      </p>
    </div>
  );
}
