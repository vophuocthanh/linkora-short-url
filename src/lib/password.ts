import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/** Hash a plain-text password for storage. */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** Check a plain-text password against a stored bcrypt hash. */
export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
