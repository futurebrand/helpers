import { Core } from "@strapi/strapi";

import { privateImagesAttributes } from "./modules/images";
import { IHelpersPluginConfig } from "../../lib/types";

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  const config = await strapi.config.get("plugin::futurebrand-strapi-helpers");
  privateImagesAttributes(strapi, config as IHelpersPluginConfig);
};
