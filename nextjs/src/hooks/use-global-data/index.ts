'use server'

import { GlobalDataService } from '@futurebrand/services'
import { IGlobalData } from '@futurebrand/types/global-options'

export async function useGlobalData(locale: string): Promise<IGlobalData> {
  const service = new GlobalDataService()
  return await service.get(locale)
}
