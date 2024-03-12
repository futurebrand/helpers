import ContentApiModule from './contents'

abstract class ContentClient {
  abstract getContentService(type: string): ContentApiModule
}

export default ContentClient
