import { ContentService, type ISingleCallerProps } from '@futurebrand/services'
import { type IContent } from '@futurebrand/types/contents'

export async function getContentSingle<T extends IContent>(
  props: ISingleCallerProps<T>
) {
  const service = new ContentService()
  return await service.single<T>(props)
}
