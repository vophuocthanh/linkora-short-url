"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { GlassButton } from "@/components/ui/glass-button";
import { UserIcon } from "@/components/ui/icons";

/** Top-right auth control: sign in / sign up, or the signed-in user + sign out. */
export function AuthNav() {
  const t = useTranslations("AuthNav");
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-32 animate-pulse rounded-xl bg-white/5" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2.5">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm text-white/70 transition-colors hover:text-white"
        >
          <UserIcon className="size-4 text-white/45" />
          <span className="hidden max-w-40 truncate sm:inline">
            {session.user.name ?? session.user.email}
          </span>
        </Link>
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          {t("signOut")}
        </GlassButton>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <GlassButton
        variant="ghost"
        size="sm"
        onClick={() => router.push("/login")}
      >
        {t("signIn")}
      </GlassButton>
      <GlassButton size="sm" onClick={() => router.push("/register")}>
        {t("signUp")}
      </GlassButton>
    </div>
  );
}
