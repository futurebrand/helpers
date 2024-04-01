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

  const list = async (
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

  const listSlugs = async (type: string, locale?: string) => {
    const service = getContentService(type)
    return await service.getContentSitemap(locale)
  }

  const findBySlug = async (type: string, slug: string, locale?: string) => {
    const service = getContentService(type)
    return await service.getContentSingle(slug, locale)
  }

  return {
    client,
    setClient,
    list,
    listSlugs,
    findBySlug
  }
}

export default contentsService