"use server"

import { ILocalization, type ContentTypes } from '@futurebrand/types/contents'
import { usePathModule } from '@futurebrand/hooks'

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

