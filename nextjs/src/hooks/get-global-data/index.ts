import { GlobalDataService } from '@futurebrand/services'
import { type IGlobalData } from '@futurebrand/types/global-options'
import { createCacheContext } from '@futurebrand/utils'

interface GlobalDataCache {
  current: IGlobalData
  lastUpdate: number
  isUpdating: boolean
}

const INVALIDATE_INTERVAL = 1000 * 10 // 10 seconds

type GlobalDataCacheMap = Record<string, GlobalDataCache>

const [getGlobalDataCache, setGlobalDataCache] =
  createCacheContext<GlobalDataCacheMap>({})

async function getAndUpdateGlobal(locale: string) {
  const cache = getGlobalDataCache()
  try {
    const service = new GlobalDataService()
    const data = await service.get(locale)

    cache[locale] = {
      current: data,
      lastUpdate: Date.now(),
      isUpdating: false,
    }

    setGlobalDataCache(cache)

    return data
  } catch (error) {
    if (cache[locale]) {
      console.error(error)
      setGlobalDataCache({
        ...cache,
        [locale]: { ...cache[locale], isUpdating: false },
      })
      return cache[locale].current
    }

    throw error as Error
  }
}

export async function getGlobalData(
  locale: string,
  rewrite?: boolean
): Promise<IGlobalData> {
  const cache = getGlobalDataCache()
  if (cache[locale] && !rewrite && process.env.NODE_ENV !== 'development') {
    if (
      cache[locale].lastUpdate - INVALIDATE_INTERVAL < Date.now() &&
      !cache[locale].isUpdating
    ) {
      setGlobalDataCache({
        ...cache,
        [locale]: { ...cache[locale], isUpdating: true },
      })
      void getAndUpdateGlobal(locale)
    }
    return cache[locale].current
  }

  return await getAndUpdateGlobal(locale)
}
