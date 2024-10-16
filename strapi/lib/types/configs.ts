export interface IHelpersPluginConfig {
  frontendUrl: string;
  previewSecret: string;
  cacheRevalidate: number | false;
  cacheMaxDuration: number;
  cacheMaxMemory: number;
  privateImageAttributes: boolean;
}
