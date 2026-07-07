"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ToolTab } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayersIcon, LinkIcon, QrIcon } from "@/components/ui/icons";
import { UrlShortenerPanel } from "./url-shortener/url-shortener-panel";
import { BulkShortenerPanel } from "./bulk-shortener/bulk-shortener-panel";
import { QrGeneratorPanel } from "./qr-generator/qr-generator-panel";

/** Main tabbed card that switches between the tools. */
export function ToolPanel() {
  const t = useTranslations("Tabs");
  const [tab, setTab] = useState<ToolTab>("shorten");
  const [qrSeed, setQrSeed] = useState<string>();

  const tabs = [
    { id: "shorten", label: t("shorten"), icon: <LinkIcon className="size-4" /> },
    { id: "bulk", label: t("bulk"), icon: <LayersIcon className="size-4" /> },
    { id: "qrcode", label: t("qrcode"), icon: <QrIcon className="size-4" /> },
  ] satisfies { id: ToolTab; label: string; icon: React.ReactNode }[];

  const activeIndex = Math.max(
    0,
    tabs.findIndex((item) => item.id === tab),
  );

  // Dynamic QR — jump to the QR tab prefilled with a freshly shortened link.
  function createQrFor(value: string) {
    setQrSeed(value);
    setTab("qrcode");
  }

  return (
    <Card
      variant="glass"
      className="w-full animate-fade-up p-5 [animation-delay:120ms] sm:p-7"
    >
      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as ToolTab)}
        className="gap-0"
      >
        <TabsList
          variant="glass"
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
          }}
        >
          {/* Sliding gradient indicator */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-1.5 left-1.5 rounded-xl bg-linear-to-r from-brand-500 to-accent-500 shadow-lg shadow-brand-500/30 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `calc((100% - 0.75rem) / ${tabs.length})`,
              transform: `translateX(calc(${activeIndex} * 100%))`,
            }}
          />
          {tabs.map((item) => (
            <TabsTrigger key={item.id} value={item.id} variant="glass">
              {item.icon}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="shorten" className="mt-7">
          <UrlShortenerPanel onCreateQr={createQrFor} />
        </TabsContent>
        <TabsContent value="bulk" className="mt-7">
          <BulkShortenerPanel />
        </TabsContent>
        <TabsContent value="qrcode" className="mt-7">
          <QrGeneratorPanel seedValue={qrSeed} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
