import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { findUserWithLinks } from "@/lib/query";
import { formatDate } from "@/lib/utils";
import { getLinkStatus } from "@/lib/link-status";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Card } from "@/components/ui/card";
import { AuthNav } from "@/components/layout/auth-nav";
import { ProfileInfo } from "@/components/features/profile/profile-info";
import { BioSettings } from "@/components/features/profile/bio-settings";
import {
  LinkHistory,
  type ProfileLink,
} from "@/components/features/profile/link-history";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Profile");
  return { title: t("metaTitle") };
}

export default async function ProfilePage() {
  const t = await getTranslations("Profile");
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const [user, links] = await findUserWithLinks(session.user.id);

  if (!user) {
    redirect("/login?callbackUrl=/profile");
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const historyLinks: ProfileLink[] = links.map((link) => ({
    id: link.id,
    slug: link.slug,
    shortUrl: `${origin}/${link.slug}`,
    originalUrl: link.originalUrl,
    title: link.title,
    clickCount: link.clickCount,
    createdAtLabel: formatDate(link.createdAt),
    status: getLinkStatus(link),
    protectedLink: Boolean(link.password),
    safePreview: link.safePreview,
    showOnBio: link.showOnBio,
  }));

  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-4 py-12 sm:py-16">
      <AuroraBackground />

      <div className="flex w-full max-w-2xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground/90 transition-colors hover:text-foreground"
          >
            <span className="bg-linear-to-r from-foreground via-brand-400 to-accent-400 bg-clip-text text-transparent">
              Link
            </span>
            ora
          </Link>
          <AuthNav />
        </header>

        <Card variant="glass" className="animate-fade-up p-6 sm:p-7">
          <ProfileInfo
            name={user.name}
            email={user.email}
            joinedLabel={formatDate(user.createdAt)}
            totalLinks={links.length}
            totalClicks={totalClicks}
          />
        </Card>

        <Card variant="glass" className="animate-fade-up p-6 sm:p-7">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground/60">
            {t("bioHeading")}
          </h2>
          <BioSettings
            username={user.username}
            bio={user.bio}
            origin={origin}
          />
        </Card>

        <section className="animate-fade-up [animation-delay:80ms]">
          <h2 className="mb-3 px-1 text-sm font-semibold uppercase tracking-wide text-foreground/60">
            {t("historyHeading")}
          </h2>
          <LinkHistory links={historyLinks} />
        </section>
      </div>
    </main>
  );
}
