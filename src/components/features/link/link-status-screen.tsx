import Link from "next/link";
import type { ReactNode } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

interface LinkStatusScreenProps {
  title: string;
  message: string;
  icon?: ReactNode;
  backLabel?: string;
}

/** Full-screen friendly state for links that can't (or shouldn't) resolve. */
export function LinkStatusScreen({ title, message, icon, backLabel }: LinkStatusScreenProps) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <AuroraBackground />

      <GlassCard
        as="section"
        className="animate-fade-up w-full max-w-md p-8 text-center"
      >
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-white/12 bg-white/5 text-3xl">
          {icon ?? "🔗"}
        </div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{message}</p>

        <Link href="/" className="mt-7 inline-block">
          <GlassButton size="lg">{backLabel ?? "Back to home"}</GlassButton>
        </Link>
      </GlassCard>
    </main>
  );
}
