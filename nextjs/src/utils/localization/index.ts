import { ILocalization, type ContentTypes } from '~/types/contents'

import { PathModule } from '@futurebrand/modules'

export function sanitizeContentLocalization(
  routes: ILocalization[],
  type: ContentTypes
) {
  const localizations: ILocalization[] = []

  for (const route of routes) {
    const { locale } = route
    const slug = type === 'pages' ? route.path : route.slug
    const pageSlug = PathModule.instance.getContentPath(slug as string, type, locale)
    if (pageSlug) {
      localizations.push({
        ...route,
        slug: pageSlug,
      })
    }
  }

  return localizations
}

