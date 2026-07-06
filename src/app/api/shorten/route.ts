import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createShortLink } from "@/lib/short-link";
import { isValidCustomSlug, isValidUrl, normalizeUrl } from "@/lib/utils";

interface ShortenBody {
  url?: string;
  customSlug?: string;
  title?: string;
  password?: string;
  expiresAt?: string;
  maxClicks?: number;
  safePreview?: boolean;
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  // Localized error messages, resolved from the request's `NEXT_LOCALE` cookie.
  const t = await getTranslations("Validation");

  let body: ShortenBody;
  try {
    body = (await request.json()) as ShortenBody;
  } catch {
    return bad(t("invalidData"));
  }

  const raw = String(body.url ?? "");
  if (!isValidUrl(raw)) {
    return bad(t("invalidUrl"));
  }

  // Custom slug — validate shape and availability.
  const customSlug = body.customSlug?.trim();
  if (customSlug) {
    if (!isValidCustomSlug(customSlug)) {
      return bad(t("invalidSlug"));
    }
    const taken = await prisma.link.findUnique({ where: { slug: customSlug } });
    if (taken) return bad(t("slugTaken"), 409);
  }

  // Expiry — must be a valid moment in the future.
  let expiresAt: Date | null = null;
  if (body.expiresAt) {
    const parsed = new Date(body.expiresAt);
    if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
      return bad(t("invalidExpiry"));
    }
    expiresAt = parsed;
  }

  // Click limit — a positive integer when set.
  let maxClicks: number | null = null;
  if (body.maxClicks !== undefined && body.maxClicks !== null) {
    const value = Number(body.maxClicks);
    if (!Number.isInteger(value) || value < 1) {
      return bad(t("invalidMaxClicks"));
    }
    maxClicks = value;
  }

  const session = await auth();
  const password = body.password?.trim()
    ? await hashPassword(body.password.trim())
    : null;

  const link = await createShortLink(normalizeUrl(raw), {
    userId: session?.user?.id ?? null,
    customSlug,
    title: body.title?.trim() || null,
    password,
    expiresAt,
    maxClicks,
    safePreview: Boolean(body.safePreview),
  });

  const origin = new URL(request.url).origin;
  return NextResponse.json(
    {
      slug: link.slug,
      originalUrl: link.originalUrl,
      shortUrl: `${origin}/${link.slug}`,
      createdAt: link.createdAt.getTime(),
    },
    { status: 201 },
  );
}
