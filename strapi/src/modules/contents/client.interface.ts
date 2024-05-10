import { Common } from '@strapi/strapi'
import ContentApiModule from './contents'

abstract class ContentClient<T = string> {
  abstract getContentByType(type: T): ContentApiModule | null
  abstract getContentTypeByApi(api: Common.UID.ContentType): string | null
  abstract register(): Promise<void>
}

export default ContentClient
