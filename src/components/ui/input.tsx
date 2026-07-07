import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Glass input field: an optional leading icon inside a frosted wrapper.
 * `className` targets the outer wrapper (so layout utilities like `sm:flex-1`
 * apply to the whole field), matching the legacy GlassInput contract.
 */
function Input({
  className,
  type,
  icon,
  invalid = false,
  ...props
}: React.ComponentProps<"input"> & {
  icon?: React.ReactNode
  invalid?: boolean
}) {
  return (
    <div
      data-slot="input"
      className={cn(
        "group flex items-center gap-3 rounded-2xl border bg-foreground/5 px-4 transition-colors duration-200 focus-within:bg-foreground/10",
        invalid
          ? "border-rose-400/60 focus-within:border-rose-400"
          : "border-foreground/12 focus-within:border-brand-400/70",
        className
      )}
    >
      {icon && (
        <span className="shrink-0 text-foreground/45 transition-colors group-focus-within:text-brand-400">
          {icon}
        </span>
      )}
      <input
        type={type}
        aria-invalid={invalid || undefined}
        className="h-13 w-full min-w-0 bg-transparent text-[15px] text-foreground outline-none placeholder:text-foreground/35"
        {...props}
      />
    </div>
  )
}

export { Input }
