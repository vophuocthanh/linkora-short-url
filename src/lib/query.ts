import { prisma } from "./prisma";

// ---------------------------------------------------------------------------
// Link queries
// ---------------------------------------------------------------------------

/** Fetch a link by slug with all fields needed for the redirect 5-step gate. */
export async function findLinkBySlug(slug: string) {
  return prisma.link.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      originalUrl: true,
      clickCount: true,
      expiresAt: true,
      maxClicks: true,
      password: true,
      safePreview: true,
    },
  });
}

// ---------------------------------------------------------------------------
// User / Profile queries
// ---------------------------------------------------------------------------

/** Fetch a public bio profile by username (case-insensitive). */
export function findUserProfileByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      name: true,
      username: true,
      bio: true,
      links: {
        where: { showOnBio: true },
        orderBy: { createdAt: "desc" },
        select: { slug: true, title: true, originalUrl: true },
      },
    },
  });
}

/** Fetch a user and all their links (dashboard view). */
export function findUserWithLinks(userId: string) {
  return Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        username: true,
        bio: true,
        createdAt: true,
      },
    }),
    prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        originalUrl: true,
        clickCount: true,
        expiresAt: true,
        maxClicks: true,
        password: true,
        safePreview: true,
        showOnBio: true,
        createdAt: true,
      },
    }),
  ]);
}
