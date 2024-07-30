export interface IHelpersPluginConfig {
  frontendUrl: string
  previewSecret: string
  cacheRevalidate: number | false
  cacheMaxDuration: number
  privateImageAttributes: boolean
}