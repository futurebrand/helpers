import { getPluginConfigs } from "@futurebrand/configs/plugin/plugin";

export function getDefaultCacheRevalidate() {
  const configs = getPluginConfigs();
  return configs.cacheRevalidate ?? 60;
}
