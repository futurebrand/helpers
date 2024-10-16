import { IHelpersPluginConfig } from "@futurebrand/types";

import DEFAULT_CONFIGS from "./default";

export function getPluginConfigs() {
  const config = strapi.config.get("plugin.futurebrand-strapi-helpers");

  if (!config) {
    return DEFAULT_CONFIGS;
  }

  return config as IHelpersPluginConfig;
}
