"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidCustomSlug } from "@/lib/utils";

export async function deleteLink(id: string) {
  const session = await auth();
  if (!session?.user) return;

  await prisma.link.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/profile");
}

export async function toggleBioLink(id: string) {
  const session = await auth();
  if (!session?.user) return;

  const link = await prisma.link.findFirst({
    where: { id, userId: session.user.id },
    select: { showOnBio: true },
  });
  if (!link) return;

  await prisma.link.update({
    where: { id },
    data: { showOnBio: !link.showOnBio },
  });
  revalidatePath("/profile");
}

export interface UpdateProfileResult {
  ok: boolean;
  error?: string;
}

export async function updateProfile(input: {
  username: string;
  bio: string;
}): Promise<UpdateProfileResult> {
  const t = await getTranslations("BioSettings");

  const session = await auth();
  if (!session?.user) return { ok: false, error: t("notLoggedIn") };

  const username = input.username.trim().toLowerCase();
  const bio = input.bio.trim();

  if (username && !isValidCustomSlug(username)) {
    return { ok: false, error: t("invalidUsername") };
  }

  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      return { ok: false, error: t("usernameTaken") };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username: username || null, bio: bio || null },
  });
  revalidatePath("/profile");
  return { ok: true };
}
