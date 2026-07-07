import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { findLinkBySlug } from "@/lib/query";
import { recordClick } from "@/lib/click";
import { getLinkStatus, isResolvable } from "@/lib/link-status";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkStatusScreen } from "@/components/features/link/link-status-screen";
import { ExternalLinkIcon } from "@/components/ui/icons";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const link = await findLinkBySlug(slug);

  if (!link) notFound();
  if (link.password) redirect(`/protected/${slug}`);

  const t = await getTranslations();

  if (!isResolvable(getLinkStatus(link))) {
    return (
      <LinkStatusScreen
        title={t("LinkStatus.expiredOrLimitedTitle")}
        message={t("LinkStatus.expiredOrLimitedMessage")}
        backLabel={t("LinkStatus.backHome")}
      />
    );
  }

  const { id, originalUrl } = link;
  let destinationHost = originalUrl;
  try {
    destinationHost = new URL(originalUrl).host;
  } catch {
    // keep the raw string if it can't be parsed
  }

  async function proceed() {
    "use server";
    await recordClick(id, await headers());
    redirect(originalUrl);
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <AuroraBackground />

      <Card variant="glass" className="animate-fade-up w-full max-w-md p-8">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-foreground/12 bg-foreground/5 text-3xl">
            🛡️
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("Preview.heading")}</h1>
          <p className="mt-2 text-sm text-foreground/60">
            {t("Preview.description")}
          </p>
        </div>

        <div className="rounded-2xl border border-foreground/12 bg-foreground/5 p-4">
          <p className="text-xs uppercase tracking-wide text-foreground/40">
            {t("Preview.destinationLabel")}
          </p>
          <p className="mt-1 font-semibold text-foreground">{destinationHost}</p>
          <p className="mt-1 break-all text-xs text-foreground/45">{originalUrl}</p>
        </div>

        <form action={proceed} className="mt-6">
          <Button
            type="submit"
            variant="primary"
            size="glass-lg"
            className="w-full"
          >
            <ExternalLinkIcon className="size-4" />
            {t("Preview.continueButton")}
          </Button>
        </form>
      </Card>
    </main>
  );
}
