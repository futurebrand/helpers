'use server'

import { GlobalDataService, IGlobalData } from '@futurebrand/services'
import { useCache } from '@futurebrand/hooks'

export async function useGlobalData(locale: string): Promise<IGlobalData> {
  const key = `helpers-global-options-${locale}`

  async function loadGlobalData() {
    return await GlobalDataService.load(locale)
  }

  const globalOptions = await useCache(key, loadGlobalData, {
    tags: ['helpers', 'global-data']
  })

  return globalOptions
}
