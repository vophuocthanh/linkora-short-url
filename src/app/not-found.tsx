import { getTranslations } from "next-intl/server";
import { LinkStatusScreen } from "@/components/features/link/link-status-screen";

export default async function NotFound() {
  const t = await getTranslations("LinkStatus");

  return (
    <LinkStatusScreen
      title={t("notFoundTitle")}
      message={t("notFoundMessage")}
      backLabel={t("backHome")}
      icon="🔍"
    />
  );
}
