import Link from "next/link";
import type { ReactNode } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

      <Card
        variant="glass"
        className="animate-fade-up w-full max-w-md p-8 text-center"
      >
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-foreground/12 bg-foreground/5 text-3xl">
          {icon ?? "🔗"}
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60">{message}</p>

        <Link href="/" className="mt-7 inline-block">
          <Button variant="primary" size="glass-lg">
            {backLabel ?? "Back to home"}
          </Button>
        </Link>
      </Card>
    </main>
  );
}
