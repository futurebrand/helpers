import { IPluginConfig } from "../../config/types"

export function privateImagesAttributes(strapi: any, config: IPluginConfig) {
  const plugin = strapi.plugin('upload')

  if (config.privateImageAttributes) {
    plugin.contentTypes.file.options = {
      privateAttributes: [
        'createdAt',
        'updatedAt',
        'ext',
        'hash',
        'formats',
        'provider_metadata',
        'provider',
        'previewUrl',
        'size',
      ],
    }
  }
}
