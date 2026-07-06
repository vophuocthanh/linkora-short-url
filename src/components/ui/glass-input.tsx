import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  invalid?: boolean;
};

export function GlassInput({
  icon,
  invalid = false,
  className,
  ...props
}: GlassInputProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-4",
        "bg-white/5 border transition-colors duration-200",
        "focus-within:bg-white/10",
        invalid
          ? "border-rose-400/60 focus-within:border-rose-400"
          : "border-white/12 focus-within:border-brand-400/70",
        className,
      )}
    >
      {icon && (
        <span className="shrink-0 text-white/45 transition-colors group-focus-within:text-brand-400">
          {icon}
        </span>
      )}
      <input
        className={cn(
          "h-13 w-full min-w-0 bg-transparent text-[15px] text-white placeholder:text-white/35",
          "outline-none",
        )}
        {...props}
      />
    </div>
  );
}
