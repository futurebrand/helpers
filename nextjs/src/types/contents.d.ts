declare module '~/types/contents' {
  import type {
    HTMLString,
    IResponsiveImage,
    IStrapiDataComponentList,
    IStrapiMedia,
    IStrapiTitle,
  } from '~/types/strapi'

  // TYPES
  export type ContentTypes = 'pages'
  export interface IContentSlugs {
    posts: string
    tags: string
    modals: string
  }

  export interface IContentSlugMap {
    slug: string
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
    slug: string
    path?: string
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
    results: T[]
    pagination: IContentPagination
  }

  // PAGE

  export interface IPageData extends IContent {
    blocks: Array<IPageBlockData<unknown>>
    path: string
  }

  // POST

  export interface IPost extends IContent {
    title: string
    description: HTMLString
    content: HTMLString
    featuredImage: IStrapiImage
    postTags: any[]
    publishedDateTime: string
  }

  // POST TAG

  export interface IPostTag extends IContent {
    name: string
  }

  // MODAL

  export interface IModal extends IContent {
    id: number
    title: IStrapiTitle
    form: any & { id: number }
  }
}
