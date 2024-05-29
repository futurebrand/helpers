import { getPluginConfigs } from "~/configs/plugin/plugin"

export function getDefaultCacheRevalidate () {
  const configs = getPluginConfigs()
  return configs.cacheRevalidate ?? 60
}