"use server"

import { ILocalization, type ContentTypes } from '@futurebrand/types/contents'
import { useCache, usePathModule } from '@futurebrand/hooks'
import { OptionsService } from '@futurebrand/services'
import { IDictonary } from '@futurebrand/types/global-options'

async function loadDictionary() {
  const pathModule = await usePathModule()
  const options = await OptionsService.instantiate(pathModule.currentLocale)
  return options.options.dictionary
}

export async function getDictionary() {
  const [getCacheDictionary, updateDictionary] = useCache<IDictonary | null>(null)

  const value = getCacheDictionary()
  if (!value) {
    const dictionary = await loadDictionary()
    updateDictionary(dictionary)
    return dictionary
  }

  return value
}

export async function sanitizeContentLocalization(
  routes: ILocalization[],
  type: ContentTypes
) {
  const localizations: ILocalization[] = []
  const pathModule = await usePathModule()

  for (const route of routes) {
    const { locale } = route
    const pageSlug = pathModule.getLocalizedPathFromParams(route as any, locale, type)
    if (pageSlug) {
      localizations.push({
        ...route,
        slug: pageSlug,
      })
    }
  }

  return localizations
}

