import { Strapi } from "@strapi/strapi";
import { GlobalService } from "@futurebrand/services";

const SERVICE_NAME = "plugin::futurebrand-strapi-helpers.global";

export default ({ strapi }: { strapi: Strapi }) => ({
  data: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {};
    const locale = query.locale ? String(query.locale) : undefined;

    try {
      const service = strapi.service(SERVICE_NAME) as GlobalService;
      const response = await service.data(locale);

      if (!response) {
        return ctx.notFound();
      }

      return response;
    } catch (error) {
      console.error("* Global Data Error", error);
      return ctx.badRequest(null, {
        error: JSON.stringify(error),
        message: String(error.message),
      });
    }
  },
  seo: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {};
    const locale = query.locale ? String(query.locale) : undefined;

    try {
      const service = strapi.service(SERVICE_NAME) as GlobalService;
      const response = await service.seo(locale);

      if (!response) {
        return ctx.notFound();
      }

      return response;
    } catch (error) {
      console.error("* Global SEO Error", error);
      return ctx.badRequest(null, {
        error: JSON.stringify(error),
        message: String(error.message),
      });
    }
  },
  locales: async (ctx, next) => {
    try {
      const service = strapi.service(SERVICE_NAME) as GlobalService;
      const response = await service.locales();

      if (!response) {
        return ctx.notFound();
      }

      return response;
    } catch (error) {
      console.error("* Global Locales Error", error);
      return ctx.badRequest(null, {
        error: JSON.stringify(error),
        message: String(error.message),
      });
    }
  },
});
