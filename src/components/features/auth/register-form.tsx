"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailIcon, LockIcon, UserIcon } from "@/components/ui/icons";
import { isValidEmail, MIN_PASSWORD_LENGTH } from "@/lib/utils";

export function RegisterForm() {
  const t = useTranslations("Register");
  const tValidation = useTranslations("Validation");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError(tValidation("invalidEmail"));
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(tValidation("minPassword", { min: MIN_PASSWORD_LENGTH }));
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error ?? t("genericError"));
      setLoading(false);
      return;
    }

    // Registration succeeded — sign the user in right away.
    await signIn("credentials", { email, password, redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/70">
          {t("nameLabel")}
        </span>
        <Input
          type="text"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          value={name}
          icon={<UserIcon className="size-5" />}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/70">
          {t("emailLabel")}
        </span>
        <Input
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
        <Input
          type="password"
          autoComplete="new-password"
          placeholder={t("passwordPlaceholder", { min: MIN_PASSWORD_LENGTH })}
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

      <Button
        type="submit"
        variant="primary"
        size="glass-lg"
        loading={loading}
        className="mt-1"
      >
        {loading ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
