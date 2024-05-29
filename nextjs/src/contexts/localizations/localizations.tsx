'use client'

import React, { createContext, useCallback, useMemo } from 'react'
import { ILocalizationRoute } from '@futurebrand/types/contents'
import { I18nConfig } from '@futurebrand/services'

export interface ILocalizationsContext {
  defaultLocale: string
  locale: string
  locales: string[]
  routes: ILocalizationRoute[]
  updateRoutes: (
    localizations?: ILocalizationRoute[]
  ) => void
}

const initialState: Partial<ILocalizationsContext> = {
  routes: [],
  locale: '',
}

export const LocalizationsContext = createContext<ILocalizationsContext>(
  initialState as ILocalizationsContext
)

export interface ILocalizationsContextProps extends I18nConfig {
  locale: string
}

const LocalizationsContextProvider = ({
  children,
  locale,
  locales,
  defaultLocale
}: React.PropsWithChildren<ILocalizationsContextProps>) => {
  const [currentRoutes, setCurrentRoutes] = React.useState<
  ILocalizationRoute[]
  >([])

  const canNavigateRoutes = useMemo(() => {
    return currentRoutes.filter((route) => route.locale !== locale)
  }, [currentRoutes, locale])

  const AvaibleRoutes = useMemo(() => {
    return locales.map((locale) => ({
      locale,
      path: locale === defaultLocale ? '/' : `/${locale}`,
    }))
  }, [locales, defaultLocale])

  const updateRoutes = useCallback(
    (localizations?: ILocalizationRoute[]) => {
      if (!localizations || localizations.length === 0) {
        setCurrentRoutes(AvaibleRoutes)
      } else {
        const allRoutes = AvaibleRoutes.map((route) => {
          const currentRoute = localizations.find(
            (currentRoute) => currentRoute.locale === route.locale
          )
          if (currentRoute) {
            if (currentRoute.path === `/${currentRoute.locale}`) {
              return {
                ...currentRoute,
                path: '/',
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


  return (
    <LocalizationsContext.Provider
      value={{
        defaultLocale,
        locale,
        locales,
        routes: canNavigateRoutes,
        updateRoutes,
      }}
    >
      {children}
    </LocalizationsContext.Provider>
  )
}

export default LocalizationsContextProvider
