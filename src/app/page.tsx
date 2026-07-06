import { AuroraBackground } from "@/components/ui/aurora-background";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { AuthNav } from "@/components/layout/auth-nav";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ToolPanel } from "@/components/features/tool-panel";

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:py-16">
      <AuroraBackground />

      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
        <LocaleSwitcher />
        <AuthNav />
      </div>

      <div className="flex w-full max-w-xl flex-col items-center gap-10">
        <AppHeader />
        <ToolPanel />
        <AppFooter />
      </div>
    </main>
  );
}
