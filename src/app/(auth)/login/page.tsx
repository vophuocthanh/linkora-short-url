import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/features/auth/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("loginTitle") };
}

export default async function LoginPage() {
  const t = await getTranslations("Auth");

  return (
    <Card variant="glass" className="animate-fade-up p-6 sm:p-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">{t("loginHeading")}</h1>
        <p className="mt-2 text-sm text-foreground/55">{t("loginSubtitle")}</p>
      </header>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-foreground/55">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          {t("signUpNow")}
        </Link>
      </p>
    </Card>
  );
}
