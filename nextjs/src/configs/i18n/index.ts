
import { loadPathData } from "@futurebrand/modules/path/loader";

export async function getDynamicI18nConfigs () {
  const pathData = await loadPathData()
  return {
    defaultLocale: pathData.defaultLocale,
    locales: pathData.locales,
    localePrefix: "as-needed",
    alternateLinks: false,
  } as any
}