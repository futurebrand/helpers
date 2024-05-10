import { ContentTypes } from "@futurebrand/types/contents"

export type RouterSlugItem = Record<string, string>
export type RouterSlugs = Record<string, RouterSlugItem>

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
  slugs:RouterSlugs
}