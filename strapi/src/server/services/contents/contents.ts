import { Common } from "@strapi/strapi"
import { ContentClient } from "~/modules"
import { Token } from "~/modules/token"
import type { IContentService, IPreviewParams, IServiceCaller } from "~/types/contents"

const contentsService = () : IContentService<string> => {
  let client: ContentClient<string> | null = null
  
  const previewToken = new Token<IPreviewParams>()

  const register = async (newClient: ContentClient) => {
    client = newClient

    const config: any = await strapi.config.get('plugin.futurebrand-strapi-helpers');
    if (config.previewSecret && typeof config.previewSecret === 'string') {
      previewToken.setSecret(config.previewSecret)
    }

    await client.register()
  }

  const getContentService = (type: string) => {
    if (!client) {
      throw new Error('Content client not initialized')
    }
    return client.getContentByType(type)
  }

  const query = async (type: string, props: IServiceCaller) => {
    const service = getContentService(type)
    return await service.query(props)
  }

  const map = async (type: string, props: IServiceCaller) => {
    const service = getContentService(type)
    return await service.map(props)
  }

  const single = async (type: string, props: IServiceCaller) => {
    const service = getContentService(type)
    return await service.single(props)
  }

  const seo = async (type: string, props: IServiceCaller) => {
    const service = getContentService(type)
    return await service.seo(props)
  }

  const preview = async (token: string) => {
    if (!previewToken.verifier(token)) {
      throw new Error('Invalid token')
    }

    const { type, id, params } = previewToken.decode(token)

    const service = getContentService(type)
    const data = await service.preview(id, params)

    return {
      data,
      type,
      params
    }
  }

  const getPreviewToken = (type: string, id: number, params: any) => {
    return previewToken.tokenizer({ type, id, params })
  }

  const unique = async (type: string, id: number) => {
    const service = getContentService(type)
    return await service.unique('default', id)
  }

  const getParams = async (type: string, id: number) => {
    const service = getContentService(type)
    return await service.getParams('default', id)
  }

  const findContentType = (api: Common.UID.ContentType) => {
    if (!client) {
      throw new Error('Content client not initialized')
    }
    return client.getContentTypeByApi(api)
  }

  return {
    client,
    register,
    query,
    map,
    single,
    seo,
    preview,
    getPreviewToken,
    getParams,
    unique,
    findContentType
  }
}

export default contentsService