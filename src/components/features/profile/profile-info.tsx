import { useTranslations } from "next-intl";
import { CalendarIcon } from "@/components/ui/icons";

interface ProfileInfoProps {
  name: string | null;
  email: string;
  joinedLabel: string;
  totalLinks: number;
  totalClicks: number;
}

/** User identity card with a couple of headline stats. */
export function ProfileInfo({
  name,
  email,
  joinedLabel,
  totalLinks,
  totalClicks,
}: ProfileInfoProps) {
  const t = useTranslations("Profile");
  const displayName = name?.trim() || email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-bold text-white shadow-lg shadow-brand-500/30">
          {initial}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold text-white">
            {displayName}
          </h2>
          <p className="truncate text-sm text-white/55">{email}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/40">
            <CalendarIcon className="size-3.5" />
            {t("joined", { date: joinedLabel })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label={t("totalLinks")} value={totalLinks} />
        <Stat label={t("totalClicks")} value={totalClicks} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/45">{label}</p>
    </div>
  );
}
