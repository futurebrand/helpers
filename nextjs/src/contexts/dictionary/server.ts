import { type IDictonary } from '@futurebrand/types/global-options'
import { createCacheContext } from '@futurebrand/utils'

const [getServerDictionary, setServerDictionary] =
  createCacheContext<IDictonary | null>(null)

export { getServerDictionary, setServerDictionary }
