import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getLinkStatus } from "@/lib/link-status";
import { buildDailySeries, topBreakdown } from "@/lib/analytics";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GlassCard } from "@/components/ui/glass-card";
import { CopyButton } from "@/components/ui/copy-button";
import { ExternalLinkIcon } from "@/components/ui/icons";
import { LinkBadges } from "@/components/features/link/link-badges";
import { LinkAnalytics } from "@/components/features/analytics/link-analytics";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("statsTitle") };
}

function refererHost(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).host;
  } catch {
    return referer;
  }
}

export default async function LinkAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/profile");

  const t = await getTranslations();
  const { slug } = await params;
  const link = await prisma.link.findFirst({
    where: { slug, userId: session.user.id },
    include: {
      clicks: {
        select: { createdAt: true, device: true, referer: true, country: true },
      },
    },
  });
  if (!link) notFound();

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const shortUrl = `${proto}://${host}/${link.slug}`;

  const status = getLinkStatus(link);
  const daily = buildDailySeries(link.clicks.map((c) => c.createdAt));
  const devices = topBreakdown(
    link.clicks.map((c) => c.device),
    t("Analytics.fallbackDevice"),
  );
  const referers = topBreakdown(
    link.clicks.map((c) => refererHost(c.referer)),
    t("Analytics.fallbackDirect"),
  );
  const countries = topBreakdown(
    link.clicks.map((c) => c.country),
    t("Analytics.fallbackUnknown"),
  );

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-4 py-12 sm:py-16">
      <AuroraBackground />

      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Link
          href="/profile"
          className="text-sm text-white/55 transition-colors hover:text-white"
        >
          {t("Stats.backToProfile")}
        </Link>

        <GlassCard as="section" className="animate-fade-up p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate font-mono text-xl font-bold text-white">
                /{link.slug}
              </h1>
              {link.title && (
                <p className="mt-0.5 truncate text-sm text-white/70">
                  {link.title}
                </p>
              )}
              <p
                className="mt-1 truncate text-xs text-white/40"
                title={link.originalUrl}
              >
                ↳ {link.originalUrl}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <CopyButton value={shortUrl} />
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-xl border border-white/12 bg-white/8 text-white/85 transition-all hover:bg-white/14 hover:text-white"
                aria-label={t("Stats.openLink")}
              >
                <ExternalLinkIcon className="size-4" />
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Stat label={t("Stats.totalClicks")} value={link.clickCount} />
            {link.maxClicks !== null && (
              <Stat label={t("Stats.limit")} value={link.maxClicks} />
            )}
            <div className="text-sm">
              <p className="text-white/45">{t("Stats.createdAt")}</p>
              <p className="font-semibold text-white">
                {formatDate(link.createdAt)}
              </p>
            </div>
            {link.expiresAt && (
              <div className="text-sm">
                <p className="text-white/45">{t("Stats.expiresAt")}</p>
                <p className="font-semibold text-white">
                  {formatDate(link.expiresAt)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <LinkBadges
              status={status}
              protectedLink={Boolean(link.password)}
              safePreview={link.safePreview}
              onBio={link.showOnBio}
            />
          </div>
        </GlassCard>

        <LinkAnalytics
          daily={daily}
          devices={devices}
          referers={referers}
          countries={countries}
          totalClicks={link.clickCount}
        />
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-sm">
      <p className="text-white/45">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
