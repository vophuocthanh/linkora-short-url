"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { LockIcon } from "@/components/ui/icons";

export function UnlockForm({ slug }: { slug: string }) {
  const t = useTranslations("Unlock");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? t("genericError"));
        return;
      }
      window.location.href = data.url as string;
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <GlassInput
        type="password"
        autoComplete="off"
        placeholder={t("passwordPlaceholder")}
        value={password}
        invalid={Boolean(error)}
        icon={<LockIcon className="size-5" />}
        onChange={(e) => {
          setPassword(e.target.value);
          if (error) setError(null);
        }}
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <GlassButton type="submit" size="lg" loading={loading}>
        {loading ? t("submitting") : t("submit")}
      </GlassButton>
    </form>
  );
}
