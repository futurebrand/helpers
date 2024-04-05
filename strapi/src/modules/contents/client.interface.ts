import ContentApiModule from './contents'

abstract class ContentClient<T = string> {
  abstract getContentService(type: T): ContentApiModule
  abstract register(): Promise<void>
}

export default ContentClient
