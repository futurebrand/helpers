import { IHelpersPluginConfig } from "@futurebrand/types";

const PRIVATE_ATTRIBUTES = [
  "createdAt",
  "updatedAt",
  "ext",
  "hash",
  "formats",
  "provider_metadata",
  "provider",
  "previewUrl",
  "size",
];

export function privateImagesAttributes(
  strapi: any,
  config: IHelpersPluginConfig
) {
  const plugin = strapi.plugin("upload");

  if (config.privateImageAttributes !== false) {
    const attributes = plugin.contentTypes.file.attributes;
    for (const attr of PRIVATE_ATTRIBUTES) {
      attributes[attr].private = true;
    }
  }
}
