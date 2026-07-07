import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { findLinkBySlug } from "@/lib/query";
import { getLinkStatus, isResolvable } from "@/lib/link-status";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GlassCard } from "@/components/ui/glass-card";
import { LinkStatusScreen } from "@/components/features/link/link-status-screen";
import { UnlockForm } from "@/components/features/link/unlock-form";

export default async function ProtectedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const link = await findLinkBySlug(slug);

  if (!link) notFound();
  // Not actually protected — fall back to the normal resolve flow.
  if (!link.password) redirect(`/${slug}`);

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

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <AuroraBackground />

      <GlassCard as="section" className="animate-fade-up w-full max-w-md p-8">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-foreground/12 bg-foreground/5 text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("Protected.heading")}</h1>
          <p className="mt-2 text-sm text-foreground/60">
            {t("Protected.description")}
          </p>
        </div>

        <UnlockForm slug={slug} />
      </GlassCard>
    </main>
  );
}
