export interface DailyBucket {
  label: string;
  count: number;
}

export interface Breakdown {
  key: string;
  count: number;
}

function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Bucket click timestamps into the last `days` days, zero-filled and ordered. */
export function buildDailySeries(
  timestamps: Date[],
  days = 14,
  now: Date = new Date(),
): DailyBucket[] {
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    buckets.set(dayKey(day), 0);
  }

  for (const timestamp of timestamps) {
    const key = dayKey(timestamp);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([key, count]) => {
    const [, month, day] = key.split("-");
    return { label: `${day}/${month}`, count };
  });
}

/** Count occurrences, replace blanks with `fallback`, return the top `limit`. */
export function topBreakdown(
  values: (string | null)[],
  fallback: string,
  limit = 6,
): Breakdown[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = value?.trim() || fallback;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
