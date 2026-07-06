"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { QrOptions } from "@/lib/types";
import { generateQrPng, generateQrSvg } from "@/lib/qr-code";
import { GlassButton } from "@/components/ui/glass-button";
import { CopyButton } from "@/components/ui/copy-button";
import { CopyImageButton } from "@/components/ui/copy-image-button";
import { DownloadIcon, QrIcon } from "@/components/ui/icons";

interface QrCodePreviewProps {
  options: QrOptions;
}

function triggerDownload(href: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
}

/** Live client-rendered QR with PNG/SVG download and copy actions. */
export function QrCodePreview({ options }: QrCodePreviewProps) {
  const t = useTranslations("Qr");
  const hasValue = options.value.trim().length > 0;
  const [pngUrl, setPngUrl] = useState<string | null>(null);

  useEffect(() => {
    // Render gates on `hasValue`, so a stale PNG never shows — no sync reset.
    if (!hasValue) return;
    let active = true;
    generateQrPng(options)
      .then((url) => {
        if (active) setPngUrl(url);
      })
      .catch(() => {
        if (active) setPngUrl(null);
      });
    return () => {
      active = false;
    };
  }, [options, hasValue]);

  function downloadPng() {
    if (pngUrl) triggerDownload(pngUrl, "linkora-qr.png");
  }

  async function downloadSvg() {
    const svg = await generateQrSvg(options);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "linkora-qr.svg");
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex aspect-square w-full max-w-60 items-center justify-center overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-4">
        {hasValue && pngUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pngUrl}
            alt={t("previewAlt")}
            className="h-full w-full rounded-xl object-contain"
          />
        ) : hasValue ? (
          <span className="size-8 animate-spin-slow rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center text-white/35">
            <QrIcon className="size-10" />
            <p className="text-sm">{t("placeholder")}</p>
          </div>
        )}
      </div>

      <div className="flex w-full max-w-60 flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <GlassButton disabled={!pngUrl} onClick={downloadPng}>
            <DownloadIcon className="size-4" />
            PNG
          </GlassButton>
          <GlassButton
            variant="outline"
            disabled={!hasValue}
            onClick={downloadSvg}
          >
            <DownloadIcon className="size-4" />
            SVG
          </GlassButton>
        </div>
        <CopyImageButton
          imageUrl={pngUrl ?? ""}
          disabled={!pngUrl}
          className="w-full"
        />
        <CopyButton
          value={options.value}
          label={t("copyContent")}
          disabled={!hasValue}
          className="w-full justify-center"
        />
      </div>
    </div>
  );
}
