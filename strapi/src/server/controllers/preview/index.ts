
import { Common, Strapi } from '@strapi/strapi';
import { IContentService } from '~/types'
import Axios from 'axios'

const SERVICE_NAME = 'plugin::futurebrand-strapi-helpers.contents'

interface ILiveRouteBody {
  type: string, 
  locale: string, 
  params: any
}

async function loadFrontendLiveUrl(url: string, body: ILiveRouteBody) : Promise<string | null> {
  try {
    const response = await Axios.post(`${url}/api/preview`, body)
    const data = response.data
    
    return (data as any)?.path ?? null
  
  } catch {
    return null
  }

}


export default ({ strapi }: { strapi: Strapi }) => ({
  links: async (ctx, next) => {
    const query = ctx.query ? ctx.query : {}
    const id = query.id ? Number(query.id) : null
    const api = query.api ? String(query.api) as Common.UID.ContentType : null
    const isDraft = query.draft ? query.draft === 'true' : false
    const locale = query.locale ? String(query.locale) : ''

    if (!id || !api) {
      return ctx.badRequest(null, {
        error: 'Invalid Params',
      })
    }

    const config = await strapi.config.get('plugin.futurebrand-strapi-helpers');
    const frontendUrl = (config as any).frontendUrl

    if (!frontendUrl || typeof frontendUrl !== 'string') {
      return ctx.badRequest(null, {
        error: 'Frontend URL not set',
      })
    }

    try {
      const service = strapi.service(SERVICE_NAME) as IContentService
      const contentType = service.findContentType(api)

      if (!contentType) {
        return ctx.notFound()
      }

      const params = await service.getParams(contentType, id)
      const live = isDraft || !params 
        ? '' 
        : await loadFrontendLiveUrl(frontendUrl, {
            params,
            type: contentType,
            locale
          })

      const token = service.getPreviewToken(contentType, id, params)

      const preview = `${frontendUrl}${locale ? `/${locale}` : ''}/preview?token=${token}`
      
      return {
        preview,
        live,
        data: {
          params,
          type: contentType,
        }
      }

    } catch (error) {
      console.error(error)
      return ctx.badRequest(null, {
        error: JSON.stringify(error),
        message: String(error.message)
      })
    }
  },
});
