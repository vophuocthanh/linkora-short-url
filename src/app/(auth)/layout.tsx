import type { ReactNode } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <AuroraBackground />
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
