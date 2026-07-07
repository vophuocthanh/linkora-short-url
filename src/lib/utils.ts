import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/** Prefix the input with https:// when the user omits a protocol. */
export function normalizeUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return value;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/** Loose but practical URL validation for a single input field. */
export function isValidUrl(raw: string): boolean {
  try {
    const url = new URL(normalizeUrl(raw));
    return Boolean(url.hostname) && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Minimum password length accepted on register and login. */
export const MIN_PASSWORD_LENGTH = 8;

/** App paths a custom slug (and username) must never shadow. */
export const RESERVED_SLUGS = new Set([
  "api",
  "login",
  "register",
  "profile",
  "u",
  "protected",
  "preview",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

const CUSTOM_SLUG_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/;

/** Validate a user-chosen slug: 3–32 url-safe chars, not a reserved path. */
export function isValidCustomSlug(slug: string): boolean {
  return (
    CUSTOM_SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.has(slug.toLowerCase())
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Loose but practical email validation for a single input field. */
export function isValidEmail(raw: string): boolean {
  return EMAIL_PATTERN.test(raw.trim());
}

const SLUG_ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Generate a short, URL-safe slug for a new short link. */
export function generateSlug(length = 6): string {
  let slug = "";
  for (let i = 0; i < length; i += 1) {
    slug += SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)];
  }
  return slug;
}

/**
 * Format a date as dd/mm/yyyy in a fixed locale + timezone. Formatting on the
 * server with fixed options keeps SSR and client output identical.
 */
export function formatDate(date: Date | number | string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(date));
}
