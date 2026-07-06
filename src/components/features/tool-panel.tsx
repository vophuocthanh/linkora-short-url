"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ToolTab } from "@/lib/types";
import { GlassCard } from "@/components/ui/glass-card";
import { TabSwitcher, type TabItem } from "@/components/ui/tab-switcher";
import { LayersIcon, LinkIcon, QrIcon } from "@/components/ui/icons";
import { UrlShortenerPanel } from "./url-shortener/url-shortener-panel";
import { BulkShortenerPanel } from "./bulk-shortener/bulk-shortener-panel";
import { QrGeneratorPanel } from "./qr-generator/qr-generator-panel";

/** Main tabbed card that switches between the tools. */
export function ToolPanel() {
  const t = useTranslations("Tabs");
  const [tab, setTab] = useState<ToolTab>("shorten");
  const [qrSeed, setQrSeed] = useState<string>();

  const tabs: TabItem<ToolTab>[] = [
    { id: "shorten", label: t("shorten"), icon: <LinkIcon className="size-4" /> },
    { id: "bulk", label: t("bulk"), icon: <LayersIcon className="size-4" /> },
    { id: "qrcode", label: t("qrcode"), icon: <QrIcon className="size-4" /> },
  ];

  // Dynamic QR — jump to the QR tab prefilled with a freshly shortened link.
  function createQrFor(value: string) {
    setQrSeed(value);
    setTab("qrcode");
  }

  return (
    <GlassCard
      as="section"
      className="w-full p-5 sm:p-7 animate-fade-up [animation-delay:120ms]"
    >
      <TabSwitcher tabs={tabs} value={tab} onChange={setTab} />

      <div className="mt-7">
        {tab === "shorten" && <UrlShortenerPanel onCreateQr={createQrFor} />}
        {tab === "bulk" && <BulkShortenerPanel />}
        {tab === "qrcode" && <QrGeneratorPanel seedValue={qrSeed} />}
      </div>
    </GlassCard>
  );
}
