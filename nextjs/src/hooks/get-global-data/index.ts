import { GlobalDataService } from '@futurebrand/services'
import { type IGlobalData } from '@futurebrand/types/global-options'
import { createCacheContext } from '@futurebrand/utils'

type GlobalDataCache = Record<string, IGlobalData>

const [getGlobalDataCache, setGlobalDataCache] =
  createCacheContext<GlobalDataCache>({})

export async function getGlobalData(
  locale: string,
  rewrite?: boolean
): Promise<IGlobalData> {
  const cache = getGlobalDataCache()
  if (cache[locale] && !rewrite) {
    return cache[locale]
  }

  const service = new GlobalDataService()
  const data = await service.get(locale)

  cache[locale] = data
  setGlobalDataCache(cache)

  return data
}
