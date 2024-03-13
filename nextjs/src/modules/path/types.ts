import { ContentTypes, IContentSlugs } from "@futurebrand/types/contents"

export interface ICurrentPath {
  locale: string
  slug: string
  type: ContentTypes
}

export type ILocaleContentSlugs = Record<string, IContentSlugs> 

export interface IPathData {
  currentPath: ICurrentPath
  locales: string[]
  defaultLocale: string
  slugs: ILocaleContentSlugs
}

export interface IStrapiLocales {
  id: number
  name: string
  code: string
  createdAt: string
  updatedAt: string
  isDefault: boolean
}

export interface IPageParams {
  locale: string
  slug: string[] | string
}
