import { prisma } from "@/lib/prisma";
import { parseDevice } from "@/lib/user-agent";

export async function recordClick(linkId: string, headers: Headers) {
  const device = parseDevice(headers.get("user-agent"));
  const referer = headers.get("referer");
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
