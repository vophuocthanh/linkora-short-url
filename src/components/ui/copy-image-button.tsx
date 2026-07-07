"use client";

import { useTranslations } from "next-intl";
import { useCopyImage, type CopyImageStatus } from "@/hooks/use-copy-image";
import { cn } from "@/lib/utils";
import { CheckIcon, ImageIcon } from "@/components/ui/icons";

interface CopyImageButtonProps {
  imageUrl: string;
  disabled?: boolean;
  className?: string;
}

const STATUS_KEY: Record<CopyImageStatus, string> = {
  idle: "copyImageIdle",
  copying: "copyImageCopying",
  copied: "copyImageCopied",
  error: "copyImageError",
};

export function CopyImageButton({
  imageUrl,
  disabled,
  className,
}: CopyImageButtonProps) {
  const t = useTranslations("CopyButtons");
  const { status, copyImage } = useCopyImage();

  return (
    <button
      type="button"
      disabled={disabled || status === "copying"}
      onClick={() => copyImage(imageUrl)}
      aria-live="polite"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-55",
        status === "copied" &&
        "border border-accent-500/40 bg-accent-500/20 text-accent-400",
        status === "error" &&
        "border border-rose-400/40 bg-rose-500/15 text-rose-300",
        (status === "idle" || status === "copying") &&
        "border border-foreground/12 bg-foreground/8 text-foreground/85 hover:bg-foreground/14 hover:text-foreground",
        className,
      )}
    >
      {status === "copied" ? (
        <CheckIcon className="size-4" />
      ) : (
        <ImageIcon className="size-4" />
      )}
      {t(STATUS_KEY[status])}
    </button>
  );
}
