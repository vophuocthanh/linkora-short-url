"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateProfile } from "@/app/profile/actions";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";

interface BioSettingsProps {
  username: string | null;
  bio: string | null;
  origin: string;
}

export function BioSettings({ username, bio, origin }: BioSettingsProps) {
  const t = useTranslations("BioSettings");
  const [handle, setHandle] = useState(username ?? "");
  const [text, setText] = useState(bio ?? "");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  function save() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfile({ username: handle, bio: text });
      setMessage(
        result.ok
          ? { ok: true, text: t("saved") }
          : { ok: false, text: result.error ?? t("genericError") },
      );
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/70">
          {t("usernameLabel")}
        </span>
        <GlassInput
          type="text"
          placeholder={t("usernamePlaceholder")}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        {handle.trim() && (
          <a
            href={`/u/${handle.trim().toLowerCase()}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-brand-400 transition-colors hover:text-brand-300"
          >
            {origin}/u/{handle.trim().toLowerCase()}
          </a>
        )}
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/70">
          {t("bioLabel")}
        </span>
        <textarea
          rows={2}
          placeholder={t("bioPlaceholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full resize-y rounded-2xl border border-white/12 bg-white/5 p-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand-400/70 focus:bg-white/10"
        />
      </label>

      {message && (
        <p
          className={`text-sm ${message.ok ? "text-accent-400" : "text-rose-400"}`}
        >
          {message.text}
        </p>
      )}

      <GlassButton onClick={save} loading={pending} className="self-start">
        {pending ? t("saving") : t("save")}
      </GlassButton>
    </div>
  );
}
