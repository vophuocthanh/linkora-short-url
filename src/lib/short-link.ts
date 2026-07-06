import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

const MAX_SLUG_ATTEMPTS = 5;

export interface ShortLinkOptions {
  userId?: string | null;
  /** A pre-validated, user-chosen slug. Falls back to a random one when unset. */
  customSlug?: string;
  title?: string | null;
  /** Bcrypt hash of the link password — never the plain value. */
  password?: string | null;
  expiresAt?: Date | null;
  maxClicks?: number | null;
  safePreview?: boolean;
}

/**
 * Persist a new short link. Uses the caller's custom slug when given (assumes
 * it was already validated + checked for uniqueness), otherwise generates a
 * collision-free random slug.
 */
export async function createShortLink(
  originalUrl: string,
  options: ShortLinkOptions = {},
) {
  const { userId = null, customSlug, ...linkData } = options;
  const data = { originalUrl, userId, ...linkData };

  if (customSlug) {
    return prisma.link.create({ data: { slug: customSlug, ...data } });
  }

  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt += 1) {
    const slug = generateSlug();
    const taken = await prisma.link.findUnique({ where: { slug } });
    if (taken) continue;
    return prisma.link.create({ data: { slug, ...data } });
  }

  throw new Error("Unable to generate a unique slug");
}
