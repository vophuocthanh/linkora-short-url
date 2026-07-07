import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/features/auth/register-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("registerTitle") };
}

export default async function RegisterPage() {
  const t = await getTranslations("Auth");

  return (
    <Card variant="glass" className="animate-fade-up p-6 sm:p-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">{t("registerHeading")}</h1>
        <p className="mt-2 text-sm text-foreground/55">{t("registerSubtitle")}</p>
      </header>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-foreground/55">
        {t("hasAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          {t("signInNow")}
        </Link>
      </p>
    </Card>
  );
}
