'use client'

import React, { createContext, useCallback, useMemo } from 'react'

import { ContentTypes, IContentSlugs, ILocalization } from '@futurebrand/types/contents'
import { IDictonary } from '@futurebrand/types/global-options'

interface ILocalizationsContext {
  locale: string
  dictionary: IDictonary
  routes: ILocalization[]
  updateRoutes: (
    localizations?: ILocalization[]
  ) => void
  getContentSlug: (type: ContentTypes, slug: string) => string
  getContentTypeSlug: (type: ContentTypes, locale: string) => string | false
}

const initialState: Partial<ILocalizationsContext> = {
  routes: [],
  locale: '',
}

export const LocalizationsContext = createContext<ILocalizationsContext>(
  initialState as ILocalizationsContext
)

interface Properties {
  children: React.ReactNode
  locale: string
  locales: string[]
  slugs: IContentSlugs
  dictionary: IDictonary,
}

const LocalizationsContextProvider = ({
  children,
  dictionary,
  locale,
  locales,
  slugs
}: Properties) => {
  const [currentRoutes, setCurrentRoutes] = React.useState<
  ILocalization[]
  >([])

  const canNavigateRoutes = useMemo(() => {
    return currentRoutes.filter((route) => route.locale !== locale)
  }, [currentRoutes, locale])

  const AvaibleRoutes = useMemo(() => {
    return locales.map((locale) => ({
      locale,
      slug: '/',
    }))
  }, [locales])

  const updateRoutes = useCallback(
    (localizations?: ILocalization[]) => {
      if (!localizations || localizations.length === 0) {
        setCurrentRoutes(AvaibleRoutes)
      } else {
        const allRoutes = AvaibleRoutes.map((route) => {
          const currentRoute = localizations.find(
            (currentRoute) => currentRoute.locale === route.locale
          )
          if (currentRoute) {
            if (currentRoute.slug === `/${currentRoute.locale}`) {
              return {
                ...currentRoute,
                slug: '/',
              }
            }
            return currentRoute
          }
          return route
        })
        setCurrentRoutes(allRoutes)
      }
    },
    [AvaibleRoutes]
  )

  const getContentTypeSlug = useCallback((
    type: ContentTypes = 'pages',
    locale: string
  ): string | false => {
    return slugs[locale]?.[type as keyof IContentSlugs] || false
  }, [slugs])

  const getContentSlug = useCallback(
    (type: ContentTypes, slug: string) => {
      const slugString = slug.startsWith('/') ? slug : `/${slug}`

      if (type === 'pages') {
        return slugString
      }

      const typeSlug = getContentTypeSlug(type, locale)

      return `/${typeSlug}${slugString}`
    },
    [locale]
  )

  return (
    <LocalizationsContext.Provider
      value={{
        locale,
        routes: canNavigateRoutes,
        updateRoutes,
        getContentSlug,
        getContentTypeSlug,
        dictionary,
      }}
    >
      {children}
    </LocalizationsContext.Provider>
  )
}

export function useLocalizations() {
  return React.useContext(LocalizationsContext)
}

export default LocalizationsContextProvider
