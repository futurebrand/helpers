import { IHelpersPluginConfig } from "@futurebrand/types";

const ONE_MINUTE = 1000 * 60;
const ONE_DAY = 1000 * 60 * 60 * 24;

const DEFAULT_CONFIGS: IHelpersPluginConfig = {
  frontendUrl: "",
  previewSecret: "",
  cacheRevalidate: ONE_MINUTE,
  cacheMaxDuration: ONE_DAY,
  privateImageAttributes: true,
};

export default DEFAULT_CONFIGS;
