import { Strapi } from "@strapi/strapi";
import { SyncService } from "@futurebrand/services";

const SERVICE_NAME = "plugin::futurebrand-strapi-helpers.sync";

export default ({ strapi }: { strapi: Strapi }) => ({
  run: async () => {
    const service = strapi.service(SERVICE_NAME) as SyncService;
    await service.run();
    return { success: true };
  },
});
