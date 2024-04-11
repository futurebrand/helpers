import { ContentClient } from "~/modules"
import { IContentService, IServiceCaller } from "~/types/contents"

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

  return {
    client,
    register,
    query,
    map,
    single
  }
}

export default contentsService