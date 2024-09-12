import { ContentService, ISingleCallerProps } from '@futurebrand/services'
import { IContent } from '@futurebrand/types/contents'

export async function getContentSingle<T extends IContent>(
  props: ISingleCallerProps<T>
) {
  const service = new ContentService()
  return await service.single<T>(props)
}
