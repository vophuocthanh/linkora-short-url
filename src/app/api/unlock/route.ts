import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { recordClick } from "@/lib/click";
import { getLinkStatus, isResolvable } from "@/lib/link-status";

export async function POST(request: Request) {
  // Localized messages, resolved from the request's `NEXT_LOCALE` cookie.
  const t = await getTranslations();

  let body: { slug?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: t("Validation.invalidData") },
      { status: 400 },
    );
  }

  const slug = String(body.slug ?? "");
  const password = String(body.password ?? "");

  const link = await prisma.link.findUnique({ where: { slug } });
  if (!link || !link.password) {
    return NextResponse.json(
      { error: t("Api.linkNotFound") },
      { status: 404 },
    );
  }
  if (!isResolvable(getLinkStatus(link))) {
    return NextResponse.json(
      { error: t("Api.linkExpiredOrLimited") },
      { status: 410 },
    );
  }

  const ok = await verifyPassword(password, link.password);
  if (!ok) {
    return NextResponse.json(
      { error: t("Api.wrongPassword") },
      { status: 401 },
    );
  }

  await recordClick(link.id, request.headers);
  return NextResponse.json({ url: link.originalUrl });
}
