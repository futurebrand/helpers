import { Strapi } from '@strapi/strapi';

const SERVICE_NAME = 'plugin::futurebrand-strapi-helpers.contents'

export default ({ strapi }: { strapi: Strapi }) => ({
  query: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const page = query.page ? Number(query.page) : 1
    const filters = query.filters ?? {}
    const locale = query.locale ? String(query.locale) : undefined
    const type = query.type ? String(query.type) : undefined

    try {
      const service = strapi.service(SERVICE_NAME)
      const response = await service.query(type, page, filters, locale)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      console.error('* Query Error', error)
      return ctx.badRequest(null, error)
    }
  },
  sitemap: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const locale = query.locale ? String(query.locale) : undefined
    const type = query.type ? String(query.type) : undefined

    try {
      const service = strapi.service(SERVICE_NAME)
      const response = await service.sitemap(type, locale)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      console.error('* Sitemap Error', error)
      return ctx.badRequest(null, error)
    }
  },
  single: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const locale = query.locale ? String(query.locale) : undefined
    const type = query.type ? String(query.type) : undefined
    const params = query.params ? query.params : undefined

    try {
      const service = strapi.service(SERVICE_NAME)
      const response = await service.single(type, params, locale)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      console.error('* Single Error', error)
      return ctx.badRequest(null, error)
    }
  },
});
