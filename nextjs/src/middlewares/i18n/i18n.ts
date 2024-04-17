
import { loadLocalization } from "@futurebrand/services";

async function getDynamicI18nConfigs () {
  const localization = await loadLocalization()
  return {
    defaultLocale: localization.defaultLocale,
    locales: localization.locales,
    localePrefix: "as-needed",
    alternateLinks: false,
    localeDetection: false
  } as any
}

export default getDynamicI18nConfigs