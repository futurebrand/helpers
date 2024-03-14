import { Strapi } from '@strapi/strapi';

const SERVICE_NAME = 'plugin::futurebrand-strapi-helpers.contents'

export default ({ strapi }: { strapi: Strapi }) => ({
  list: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const page = query.page ? Number(query.page) : 1
    const filters = query.filters ?? {}
    const locale = query.locale ? String(query.locale) : undefined
    const type = query.type ? String(query.type) : undefined

    try {
      const service = strapi.service(SERVICE_NAME)
      const response = await service.list(type, page, filters, locale)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      return ctx.badRequest(null, error)
    }
  },
  listSlugs: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const locale = query.locale ? String(query.locale) : undefined
    const type = query.type ? String(query.type) : undefined

    try {
      const service = strapi.service(SERVICE_NAME)
      const response = await service.listSlugs(type, locale)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      return ctx.badRequest(null, error)
    }
  },
  findBySlug: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const locale = query.locale ? String(query.locale) : undefined
    const type = query.type ? String(query.type) : undefined
    const slug = query.slug ? String(query.slug) : undefined

    try {
      const service = strapi.service(SERVICE_NAME)
      const response = await service.findBySlug(type, slug, locale)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      console.error('findBySlug error', error)
      return ctx.badRequest(null, error)
    }
  },
});
