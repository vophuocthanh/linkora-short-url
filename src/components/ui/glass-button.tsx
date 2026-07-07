import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/30 hover:brightness-110 hover:shadow-brand-500/40",
  ghost:
    "bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground border border-transparent",
  outline:
    "glass-surface text-foreground/90 hover:bg-foreground/10 hover:text-foreground",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-2xl",
  lg: "h-13 px-6 text-base gap-2 rounded-2xl",
};

export function GlassButton({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: GlassButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.98]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="size-4 rounded-full border-2 border-foreground/40 border-t-foreground animate-spin-slow"
        />
      )}
      {children}
    </button>
  );
}
