export type LinkStatus = "active" | "expired" | "limit_reached";

interface LinkLifecycle {
  expiresAt: Date | null;
  maxClicks: number | null;
  clickCount: number;
}

/** Derive a link's lifecycle status — drives redirect gating and badges. */
export function getLinkStatus(
  link: LinkLifecycle,
  now: Date = new Date(),
): LinkStatus {
  if (link.expiresAt && link.expiresAt.getTime() <= now.getTime()) {
    return "expired";
  }
  if (link.maxClicks !== null && link.clickCount >= link.maxClicks) {
    return "limit_reached";
  }
  return "active";
}

/** A link resolves (redirects) only while its status is active. */
export function isResolvable(status: LinkStatus): boolean {
  return status === "active";
}
