import { ContentClient } from "~/modules"

const contentsService = ({strapi}) => {
  let client: ContentClient | null = null

  const setClient = (newClient: ContentClient) => {
    client = newClient
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
    setClient,
    query,
    sitemap,
    single
  }
}

export default contentsService