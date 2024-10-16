import { IHelpersPluginConfig } from "@futurebrand/types";

const FIVE_SECONDS = 1000 * 60;
const ONE_MONTH = 1000 * 60 * 60 * 24;
const ONE_HUNDRED_MB_IN_BYTES = 100 * 1024 * 1024;

const DEFAULT_CONFIGS: IHelpersPluginConfig = {
  frontendUrl: "",
  previewSecret: "",
  cacheRevalidate: FIVE_SECONDS,
  cacheMaxDuration: ONE_MONTH,
  cacheMaxMemory: ONE_HUNDRED_MB_IN_BYTES,
  privateImageAttributes: true,
};

export default DEFAULT_CONFIGS;
