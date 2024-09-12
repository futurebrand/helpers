import type { ContentService } from '@futurebrand/services'
import type { ContentTypes } from '@futurebrand/types/contents'

export type RouterSlugList = Partial<Record<ContentTypes, string>>
export type RouterSlugs = Record<string, RouterSlugList>

export interface IDynamicRoute {
  locale: string
  slug?: string[]
}

export interface ICustomRoute {
  locale: string
  type: ContentTypes
  params: any
}

export type IRoute = IDynamicRoute | ICustomRoute

export interface IRouterConfig {
  slugs: RouterSlugs
  contentService?: ContentService
}
