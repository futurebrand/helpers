import { Strapi } from "@strapi/strapi";

import { privateImagesAttributes } from "./modules/images";
import { IHelpersPluginConfig } from "@futurebrand/types";

export default async ({ strapi }: { strapi: Strapi }) => {
  const config = await strapi.config.get("plugin.futurebrand-strapi-helpers");
  privateImagesAttributes(strapi, config as IHelpersPluginConfig);
};
