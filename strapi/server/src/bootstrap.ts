import { Strapi } from "@strapi/strapi";

export default async ({ strapi }: { strapi: Strapi }) => {
  const actions = [
    {
      section: "settings",
      category: "futurebrand",
      displayName: "Access Futurebrand Settings page",
      uid: "settings.read",
      pluginName: "futurebrand-strapi-helpers",
    },
  ];

  console.log("[FUTUREBRAND] Registering actions");

  await strapi.admin!.services.permission.actionProvider.registerMany(actions);
  // bootstrap phase
};
