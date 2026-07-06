"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/** Makes the NextAuth session available to client components via useSession. */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
