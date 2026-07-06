import { useTranslations } from "next-intl";
import type { LinkStatus } from "@/lib/link-status";

interface LinkBadgesProps {
  status: LinkStatus;
  protectedLink: boolean;
  safePreview: boolean;
  onBio?: boolean;
}

const CHIP =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium";

/** Small status chips describing a link's gating and features. */
export function LinkBadges({
  status,
  protectedLink,
  safePreview,
  onBio,
}: LinkBadgesProps) {
  const t = useTranslations("LinkBadges");

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {status === "expired" && (
        <span className={`${CHIP} bg-rose-500/15 text-rose-300`}>
          {t("expired")}
        </span>
      )}
      {status === "limit_reached" && (
        <span className={`${CHIP} bg-amber-500/15 text-amber-300`}>
          {t("limitReached")}
        </span>
      )}
      {protectedLink && (
        <span className={`${CHIP} bg-sky-500/15 text-sky-300`}>
          {t("password")}
        </span>
      )}
      {safePreview && (
        <span className={`${CHIP} bg-teal-500/15 text-teal-300`}>
          {t("preview")}
        </span>
      )}
      {onBio && (
        <span className={`${CHIP} bg-brand-500/15 text-brand-300`}>
          {t("onBio")}
        </span>
      )}
    </div>
  );
}
