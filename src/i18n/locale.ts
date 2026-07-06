"use server";

import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale(): Promise<Locale> {
  const stored = (await cookies()).get(COOKIE_NAME)?.value;
  return isLocale(stored) ? stored : defaultLocale;
}

export async function setUserLocale(locale: Locale): Promise<void> {
  (await cookies()).set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // one year
    sameSite: "lax",
  });
}
