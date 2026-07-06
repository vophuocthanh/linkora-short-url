export type DeviceType = "mobile" | "tablet" | "desktop";

/** Best-effort device classification from a User-Agent header. */
export function parseDevice(userAgent: string | null): DeviceType {
  const ua = (userAgent ?? "").toLowerCase();
  if (/ipad|tablet|playbook|silk|android(?!.*mobile)/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}
