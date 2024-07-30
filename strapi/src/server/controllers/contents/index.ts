
import { Strapi } from '@strapi/strapi';
import { DEFAULT_CONTENT_KEY } from '~/modules';
import { IContentService } from '~/types';

const SERVICE_NAME = 'plugin::futurebrand-strapi-helpers.contents'

function handleDefaultQueryProps (context: any) {
  const query = context.query ? context.query : {}
  const key = query.key ? String(query.key) : DEFAULT_CONTENT_KEY
  const locale = query.locale ? String(query.locale) : undefined
  const type = query.type ? String(query.type) : undefined
  const params = query.params ? query.params : {}
  return { key, locale, type, params }
}

export default ({ strapi }: { strapi: Strapi }) => ({
  query: async (ctx, next) => {
    const { type, ...props } = handleDefaultQueryProps(ctx)

    try {
      const service = strapi.service(SERVICE_NAME) as IContentService
      const response = await service.query(type, props)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      console.error('* Query Error', error)
      return ctx.badRequest(null, {
        error: JSON.stringify(error),
        message: String(error.message)
      })
    }
  },
  map: async (ctx, next) => {
    const { type, ...props } = handleDefaultQueryProps(ctx)

    try {
      const service = strapi.service(SERVICE_NAME) as IContentService
      const response = await service.map(type, props)

      if (!response) {
        return ctx.notFound()
      }

      return response
    } catch (error) {
      console.error('* Sitemap Error', error)
      return ctx.badRequest(null, {
        error: JSON.stringify(error),
        message: String(error.message)
      })
    }
  },
  single: async (ctx, next) => {
    const { type, ...props } = handleDefaultQueryProps(ctx)

    try {
      const service = strapi.service(SERVICE_NAME) as IContentService
      const response = await service.single(type, props)

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
  seo: async (ctx, next) => {
    const { type, ...props } = handleDefaultQueryProps(ctx)

    try {
      const service = strapi.service(SERVICE_NAME) as IContentService
      const response = await service.seo(type, props)

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
  preview: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const token = query.token ? String(query.token) : undefined

    try {
      const service = strapi.service(SERVICE_NAME) as IContentService
      const response = await service.preview(token)

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
