import { ContentClient } from "~/modules"
import { IContentService } from "~/types/contents"

const contentsService = () : IContentService<string> => {
  let client: ContentClient<string> | null = null

  const register = async (newClient: ContentClient) => {
    client = newClient
    await client.register()
  }

  const getContentService = (type: string) => {
    if (!client) {
      throw new Error('Content client not initialized')
    }
    return client.getContentService(type)
  }

  const query = async (
    type: string,
    page: number,
    filters: any = {},
    locale?: string
  ) => {
    const service = getContentService(type)
    return await service.query({
      page, 
      filters, 
      locale
    })
  }

  const sitemap = async (type: string, locale?: string) => {
    const service = getContentService(type)
    return await service.getContentSitemap(locale)
  }

  const single = async (type: string, params: Record<string, string>, locale?: string) => {
    const service = getContentService(type)
    return await service.getContentSingle(params, locale)
  }

  return {
    client,
    register,
    query,
    sitemap,
    single
  }
}

export default contentsService