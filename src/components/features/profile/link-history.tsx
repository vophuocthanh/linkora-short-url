"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import type { LinkStatus } from "@/lib/link-status";
import { deleteLink, toggleBioLink } from "@/app/profile/actions";
import { CopyButton } from "@/components/ui/copy-button";
import {
  CalendarIcon,
  CursorClickIcon,
  ExternalLinkIcon,
  LinkIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { LinkBadges } from "@/components/features/link/link-badges";

export interface ProfileLink {
  id: string;
  slug: string;
  shortUrl: string;
  originalUrl: string;
  title: string | null;
  clickCount: number;
  createdAtLabel: string;
  status: LinkStatus;
  protectedLink: boolean;
  safePreview: boolean;
  showOnBio: boolean;
}

export function LinkHistory({ links }: { links: ProfileLink[] }) {
  const t = useTranslations("LinkHistory");

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-foreground/12 bg-foreground/3 px-6 py-12 text-center">
        <LinkIcon className="size-9 text-foreground/30" />
        <p className="text-sm text-foreground/50">{t("empty")}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <LinkHistoryItem key={link.id} link={link} />
      ))}
    </ul>
  );
}

function LinkHistoryItem({ link }: { link: ProfileLink }) {
  const t = useTranslations("LinkHistory");
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(() => deleteLink(link.id));
  }

  return (
    <li className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4 transition-colors hover:border-foreground/15">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="block truncate font-mono text-[15px] font-semibold text-foreground transition-colors hover:text-brand-400"
          >
            /{link.slug}
          </a>
          <p
            className="mt-1 truncate text-xs text-foreground/40"
            title={link.originalUrl}
          >
            ↳ {link.originalUrl}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <CopyButton value={link.shortUrl} />
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-9 items-center justify-center rounded-xl border border-foreground/12 bg-foreground/8 text-foreground/85 transition-all duration-200 hover:bg-foreground/14 hover:text-foreground active:scale-[0.98]"
            aria-label={t("openAria")}
          >
            <ExternalLinkIcon className="size-4" />
          </a>
          <button
            type="button"
            onClick={handleDelete}
            onBlur={() => setConfirming(false)}
            disabled={pending}
            aria-label={confirming ? t("deleteConfirmAria") : t("deleteAria")}
            className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 ${
              confirming
                ? "border-rose-400/40 bg-rose-500/15 text-rose-300"
                : "border-foreground/12 bg-foreground/8 text-foreground/70 hover:bg-foreground/14 hover:text-foreground"
            }`}
          >
            <TrashIcon className="size-4" />
            {confirming && <span>{t("deleteConfirm")}</span>}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground/45">
        <span className="inline-flex items-center gap-1.5">
          <CursorClickIcon className="size-3.5" />
          {t("clicks", { count: link.clickCount })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="size-3.5" />
          {link.createdAtLabel}
        </span>
        <Link
          href={`/profile/${link.slug}`}
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          {t("viewStats")}
        </Link>
        <BioToggle id={link.id} on={link.showOnBio} />
        <LinkBadges
          status={link.status}
          protectedLink={link.protectedLink}
          safePreview={link.safePreview}
        />
      </div>
    </li>
  );
}

function BioToggle({ id, on }: { id: string; on: boolean }) {
  const t = useTranslations("LinkHistory");
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleBioLink(id))}
      className={`font-medium transition-colors disabled:opacity-50 ${
        on ? "text-brand-300" : "text-foreground/45 hover:text-foreground/80"
      }`}
    >
      {on ? t("onBio") : t("addToBio")}
    </button>
  );
}
