'use client'

import React, { createContext, useCallback } from 'react'

import { ContentTypes, IContentSlugs } from '@futurebrand/types/contents'

export interface IClientPathContext {
  getContentSlug: (type: ContentTypes, slug: string) => string
  getContentTypeSlug: (type: ContentTypes, locale: string) => string | false
}

const initialState: Partial<IClientPathContext> = {}

export const ClientPathContext = createContext<IClientPathContext>(
  initialState as IClientPathContext
)

export interface IClientPathContextProps {
  slugs: IContentSlugs
  locale: string
}

const ClientPathContextProvider = ({
  children,
  slugs,
  locale,
}: React.PropsWithChildren<IClientPathContextProps>) => {

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
    <ClientPathContext.Provider
      value={{
        getContentSlug,
        getContentTypeSlug,
      }}
    >
      {children}
    </ClientPathContext.Provider>
  )
}

export default ClientPathContextProvider
