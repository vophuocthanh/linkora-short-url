import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
};

// Auto-detects `src/i18n/request.ts` for the runtime i18n configuration.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
