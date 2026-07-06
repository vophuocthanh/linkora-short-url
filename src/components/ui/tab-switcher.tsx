"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

interface TabSwitcherProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
}

export function TabSwitcher<T extends string>({
  tabs,
  value,
  onChange,
}: TabSwitcherProps<T>) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === value),
  );

  return (
    <div
      role="tablist"
      className="relative grid gap-1 rounded-2xl bg-white/5 p-1.5 border border-white/10"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {/* Sliding indicator */}
      <span
        aria-hidden
        className="absolute inset-y-1.5 left-1.5 rounded-xl bg-linear-to-r from-brand-500 to-accent-500 shadow-lg shadow-brand-500/30 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 0.75rem) / ${tabs.length})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
        }}
      />
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-colors duration-200",
              "h-12 md:h-11 flex-col md:flex-row",
              "px-2 md:px-4",
              "text-[11px] md:text-sm leading-tight whitespace-nowrap",
              active ? "text-white" : "text-white/55 hover:text-white/80",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
