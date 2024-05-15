
import { Strapi } from '@strapi/strapi';
import { IGlobalService } from '~/types';

const SERVICE_NAME = 'plugin::futurebrand-strapi-helpers.global'

export default ({ strapi }: { strapi: Strapi }) => ({
  data: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const locale = query.locale ? String(query.locale) : undefined

    try {
      const service = strapi.service(SERVICE_NAME) as IGlobalService
      const response = await service.data(locale)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      console.error('* Global Data Error', error)
      return ctx.badRequest(null, {
        error: JSON.stringify(error),
        message: String(error.message)
      })
    }
  },
  seo: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const locale = query.locale ? String(query.locale) : undefined

    try {
      const service = strapi.service(SERVICE_NAME) as IGlobalService
      const response = await service.seo(locale)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      console.error('* Single Error', error)
      return ctx.badRequest(null, {
        error: JSON.stringify(error),
        message: String(error.message)
      })
    }
  },
});
