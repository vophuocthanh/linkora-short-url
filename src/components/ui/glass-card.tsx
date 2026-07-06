import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
};

export function GlassCard({
  as: Tag = "div",
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <Tag
      className={cn("glass-surface rounded-3xl", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
