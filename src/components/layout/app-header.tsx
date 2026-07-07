import { useTranslations } from "next-intl";
import { SparkleIcon } from "@/components/ui/icons";

export function AppHeader() {
  const t = useTranslations("Header");

  return (
    <header className="flex flex-col items-center text-center animate-fade-up">
      <span className="inline-flex items-center gap-2 rounded-full border border-foreground/12 bg-foreground/5 px-4 py-1.5 text-xs font-medium text-foreground/70 backdrop-blur">
        <SparkleIcon className="size-3.5 text-accent-400" />
        {t("badge")}
      </span>

      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="bg-linear-to-r from-foreground via-brand-400 to-accent-400 bg-clip-text text-transparent">
          Link
        </span>
        <span className="text-foreground/90">ora</span>
      </h1>

      <p className="mt-4 max-w-md text-balance text-[15px] leading-relaxed text-foreground/60">
        {t("tagline")}
      </p>
    </header>
  );
}
