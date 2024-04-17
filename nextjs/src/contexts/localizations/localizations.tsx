'use client'

import React, { createContext, useCallback, useMemo } from 'react'
import { ILocalization } from '@futurebrand/types/contents'

export interface ILocalizationsContext {
  locale: string
  locales: string[]
  routes: ILocalization[]
  updateRoutes: (
    localizations?: ILocalization[]
  ) => void
}

const initialState: Partial<ILocalizationsContext> = {
  routes: [],
  locale: '',
}

export const LocalizationsContext = createContext<ILocalizationsContext>(
  initialState as ILocalizationsContext
)

export interface ILocalizationsContextProps {
  locale: string
  locales: string[]
}

const LocalizationsContextProvider = ({
  children,
  locale,
  locales
}: React.PropsWithChildren<ILocalizationsContextProps>) => {
  const [currentRoutes, setCurrentRoutes] = React.useState<
  ILocalization[]
  >([])

  const canNavigateRoutes = useMemo(() => {
    return currentRoutes.filter((route) => route.locale !== locale)
  }, [currentRoutes, locale])

  const AvaibleRoutes = useMemo(() => {
    return locales.map((locale) => ({
      locale,
      path: '/',
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
