import { prisma } from "@/lib/prisma";
import { parseDevice } from "@/lib/user-agent";

/**
 * Record a click: bump the denormalized counter and log a Click row with the
 * analytics dimensions we can read from the request headers.
 */
export async function recordClick(linkId: string, headers: Headers) {
  const device = parseDevice(headers.get("user-agent"));
  const referer = headers.get("referer");
  // Populated by hosting edge (e.g. Vercel/Cloudflare); null in local dev.
  const country =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    null;

  await prisma.$transaction([
    prisma.link.update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } },
    }),
    prisma.click.create({ data: { linkId, device, referer, country } }),
  ]);
}
