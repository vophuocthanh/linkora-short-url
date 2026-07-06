import { useTranslations } from "next-intl";
import type { Breakdown, DailyBucket } from "@/lib/analytics";
import { GlassCard } from "@/components/ui/glass-card";

interface LinkAnalyticsProps {
  daily: DailyBucket[];
  devices: Breakdown[];
  referers: Breakdown[];
  countries: Breakdown[];
  totalClicks: number;
}

export function LinkAnalytics({
  daily,
  devices,
  referers,
  countries,
  totalClicks,
}: LinkAnalyticsProps) {
  const t = useTranslations("Analytics");

  if (totalClicks === 0) {
    return (
      <GlassCard className="p-8 text-center text-sm text-white/50">
        {t("empty")}
      </GlassCard>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-white/70">
          {t("chartTitle")}
        </h3>
        <DailyChart data={daily} />
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-3">
        <BreakdownCard title={t("deviceTitle")} items={devices} total={totalClicks} />
        <BreakdownCard title={t("refererTitle")} items={referers} total={totalClicks} />
        <BreakdownCard title={t("countryTitle")} items={countries} total={totalClicks} />
      </div>
    </div>
  );
}

function DailyChart({ data }: { data: DailyBucket[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex h-32 items-end gap-1.5">
      {data.map((bucket, index) => (
        <div
          key={index}
          className="group flex flex-1 flex-col items-center justify-end gap-1"
          title={`${bucket.label}: ${bucket.count}`}
        >
          <span className="text-[10px] text-white/50 opacity-0 transition-opacity group-hover:opacity-100">
            {bucket.count}
          </span>
          <div
            className="w-full rounded-t bg-linear-to-t from-brand-500 to-accent-500 transition-all"
            style={{ height: `${(bucket.count / max) * 100}%`, minHeight: 2 }}
          />
          <span className="text-[9px] text-white/35">{bucket.label}</span>
        </div>
      ))}
    </div>
  );
}

function BreakdownCard({
  title,
  items,
  total,
}: {
  title: string;
  items: Breakdown[];
  total: number;
}) {
  const t = useTranslations("Analytics");

  return (
    <GlassCard className="p-5">
      <h3 className="mb-3 text-sm font-semibold text-white/70">{title}</h3>
      {items.length === 0 ? (
        <p className="text-xs text-white/40">{t("noData")}</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => (
            <li key={item.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="truncate text-white/75" title={item.key}>
                  {item.key}
                </span>
                <span className="shrink-0 text-white/45">{item.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-linear-to-r from-brand-500 to-accent-500"
                  style={{ width: `${(item.count / total) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
