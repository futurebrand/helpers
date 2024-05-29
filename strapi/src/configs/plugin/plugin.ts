import { IHelpersPluginConfig } from "~/types";

export function getPluginConfigs () {
  const config =  strapi.config.get('plugin.futurebrand-strapi-helpers');
  return config as IHelpersPluginConfig
}