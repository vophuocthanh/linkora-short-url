"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { MailIcon, LockIcon } from "@/components/ui/icons";
import { isValidEmail } from "@/lib/utils";

export function LoginForm() {
  const t = useTranslations("Login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isValidEmail(email) || !password) {
      setError(t("invalidInput"));
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError(t("invalidCredentials"));
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/70">
          {t("emailLabel")}
        </span>
        <GlassInput
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          invalid={Boolean(error)}
          icon={<MailIcon className="size-5" />}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/70">
          {t("passwordLabel")}
        </span>
        <GlassInput
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          invalid={Boolean(error)}
          icon={<LockIcon className="size-5" />}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(null);
          }}
        />
      </label>

      {error && <p className="animate-fade-up text-sm text-rose-400">{error}</p>}

      <GlassButton type="submit" size="lg" loading={loading} className="mt-1">
        {loading ? t("submitting") : t("submit")}
      </GlassButton>
    </form>
  );
}
