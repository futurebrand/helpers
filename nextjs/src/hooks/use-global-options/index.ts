'use server'

import { OptionsService } from '@futurebrand/services'
import { useCache } from '@futurebrand/hooks'

const initialData = {
  current: null,
}

interface IHelpersCache {
  current: OptionsService | null
}

export async function useGlobalOptions(
  locale: string
): Promise<OptionsService> {
  const [getCacheData, setCacheData] = useCache<IHelpersCache>(initialData)

  const cacheData = getCacheData()

  if (cacheData.current) {
    return cacheData.current
  }

  const globalOptions = await OptionsService.instantiate(locale)

  setCacheData({
    current: globalOptions,
  })

  return globalOptions
}
