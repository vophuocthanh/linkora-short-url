import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { isValidEmail, MIN_PASSWORD_LENGTH } from "@/lib/utils";

export async function POST(request: Request) {
  const t = await getTranslations();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: t("Validation.invalidData") },
      { status: 400 },
    );
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const email = String(data.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(data.password ?? "");
  const name = data.name ? String(data.name).trim() : null;

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: t("Validation.invalidEmail") },
      { status: 400 },
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: t("Validation.minPassword", { min: MIN_PASSWORD_LENGTH }) },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: t("Api.emailTaken") },
      { status: 409 },
    );
  }

  const user = await prisma.user.create({
    data: { email, password: await hashPassword(password), name },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
