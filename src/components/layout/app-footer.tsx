import { useTranslations } from "next-intl";

/** Slim footer with credits. */
export function AppFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-12 text-center text-xs text-white/40">
      <p>{t("credit")}</p>
    </footer>
  );
}
