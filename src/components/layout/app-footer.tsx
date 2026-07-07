import { useTranslations } from "next-intl";

export function AppFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-12 text-center text-xs text-foreground/40">
      <p>{t("credit")}</p>
    </footer>
  );
}
