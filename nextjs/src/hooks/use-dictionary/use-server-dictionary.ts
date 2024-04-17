"use server"

import { useCache } from '@futurebrand/hooks'
import { OptionsService } from '@futurebrand/services'
import { IDictonary } from '@futurebrand/types/global-options'

async function loadDictionary(locale: string) {
  const options = await OptionsService.instantiate(locale)
  return options.options.dictionary
}

export async function useServerDictionary(locale: string) {
  const [getCacheDictionary, updateDictionary] = useCache<IDictonary | null>(null)

  const value = getCacheDictionary()
  if (!value) {
    const dictionary = await loadDictionary(locale)
    updateDictionary(dictionary)
    return dictionary
  }

  return value
}
