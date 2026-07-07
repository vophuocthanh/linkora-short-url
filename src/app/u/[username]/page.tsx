import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { findUserProfileByUsername } from "@/lib/query";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ExternalLinkIcon } from "@/components/ui/icons";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const t = await getTranslations("Meta");
  const profile = await findUserProfileByUsername(username);
  if (!profile) return { title: t("notFoundTitle") };
  return {
    title: `${profile.name ?? profile.username} — Linkora`,
    description: profile.bio ?? undefined,
  };
}

function linkLabel(title: string | null, originalUrl: string): string {
  if (title?.trim()) return title;
  try {
    return new URL(originalUrl).host;
  } catch {
    return originalUrl;
  }
}

export default async function BioPage({ params }: PageProps) {
  const { username } = await params;
  const t = await getTranslations("Bio");
  const profile = await findUserProfileByUsername(username);
  if (!profile) notFound();

  const displayName = profile.name?.trim() || profile.username || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-4 py-16">
      <AuroraBackground />

      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-linear-to-br from-brand-500 to-accent-500 text-3xl font-bold text-white shadow-lg shadow-brand-500/30">
            {initial}
          </span>
          <h1 className="mt-4 text-2xl font-bold text-foreground">{displayName}</h1>
          <p className="text-sm text-foreground/50">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-3 max-w-sm text-balance text-sm leading-relaxed text-foreground/70">
              {profile.bio}
            </p>
          )}
        </div>

        {profile.links.length === 0 ? (
          <p className="text-sm text-foreground/40">{t("noLinks")}</p>
        ) : (
          <ul className="flex w-full flex-col gap-3">
            {profile.links.map((link) => (
              <li key={link.slug}>
                <a
                  href={`/${link.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-surface flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-foreground transition-all duration-200 hover:bg-foreground/10 active:scale-[0.99]"
                >
                  <span className="truncate font-medium">
                    {linkLabel(link.title, link.originalUrl)}
                  </span>
                  <ExternalLinkIcon className="size-4 shrink-0 text-foreground/50" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-4 text-xs text-foreground/35">
          {t("footer")}{" "}
          <Link href="/" className="text-brand-400 hover:text-brand-300">
            Linkora
          </Link>
        </footer>
      </div>
    </main>
  );
}
