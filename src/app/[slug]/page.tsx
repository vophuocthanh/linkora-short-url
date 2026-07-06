import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { findLinkBySlug } from "@/lib/query";
import { recordClick } from "@/lib/click";
import { getLinkStatus } from "@/lib/link-status";
import { LinkStatusScreen } from "@/components/features/link/link-status-screen";

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const link = await findLinkBySlug(slug);

  if (!link) notFound();

  const t = await getTranslations("LinkStatus");
  const status = getLinkStatus(link);

  if (status === "expired") {
    return (
      <LinkStatusScreen
        title={t("expiredTitle")}
        message={t("expiredMessage")}
        backLabel={t("backHome")}
      />
    );
  }
  if (status === "limit_reached") {
    return (
      <LinkStatusScreen
        title={t("limitReachedTitle")}
        message={t("limitReachedMessage")}
        backLabel={t("backHome")}
      />
    );
  }

  // Gated flows render their own page instead of redirecting straight away.
  if (link.password) redirect(`/protected/${slug}`);
  if (link.safePreview) redirect(`/preview/${slug}`);

  await recordClick(link.id, await headers());
  redirect(link.originalUrl);
}
