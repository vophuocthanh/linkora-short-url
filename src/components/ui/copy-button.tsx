"use client";

import { useTranslations } from "next-intl";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

interface CopyButtonProps {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function CopyButton({
  value,
  label,
  disabled,
  className,
}: CopyButtonProps) {
  const t = useTranslations("CopyButtons");
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => copy(value)}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-white/8",
        copied
          ? "bg-accent-500/20 text-accent-400 border border-accent-500/40"
          : "bg-white/8 text-white/85 border border-white/12 hover:bg-white/14 hover:text-white",
        className,
      )}
      aria-live="polite"
    >
      {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      {copied ? t("copied") : (label ?? t("copyLabel"))}
    </button>
  );
}
