declare module '@futurebrand/types/contents' {
  import type {
    HTMLString,
    IResponsiveImage,
    IStrapiDataComponentList,
    IStrapiMedia,
    IStrapiTitle,
  } from '@futurebrand/types/strapi'

  // TYPES
  export type ContentTypes = 'pages'
  export interface IContentSlugs {}

  export interface IContentMap {
    params: Record<string, string>
    date: string
  }

  // BLOCKS

  export type IBlockData<T> = {
    id: number
    __component: string
  } & T

  export interface IBlockProps<T> {
    blockData: IBlockData<T>
    page: IPageData
  }

  // LOCALIZATION

  export interface ILocalization {
    path: string
    locale: string
  }

  export type ILocalizationData = IStrapiDataComponentList<ILocalization>

  // SEO

  export interface IPageSeo {
    metaTitle: string
    metaDescription: string
    metaImage?: IStrapiMedia
    showOnGoogle: boolean
    redirect?: {
      enabled: boolean
      url: string
    }
  }

  // CONTENT BASE

  interface IContent {
    id: number
    pageSeo: IPageSeo
    slug: string
    locale: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    localizations: ILocalization[]
  }

  // PAGINATION

  export interface IContentPagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }

  
  export type IContentResponse<T> = {
    results: T
    pagination: IContentPagination
  }

  // PAGE

  export interface IPageData extends IContent {
    blocks: Array<IBlockData<unknown>>
    path: string
  }
}
