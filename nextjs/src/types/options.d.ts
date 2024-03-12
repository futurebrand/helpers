declare module '~/types/global-options' {
  import {
    type HTMLString,
    type ISocialLinks,
    type IStrapiCommonLink,
    type IStrapiImage,
  } from '~/types/strapi'

  // GLOBAL STRUCUTRE

  export interface IHeaderlink extends IStrapiCommonLink {
    __component: 'common.link'
  }

  export interface IHeaderLinkMenu {
    id: number
    __component: 'common.menu-item'
    text: string
    url: string
    blank: boolean
    subLinks: IStrapiCommonLink[]
  }

  export type IHeaderNavigation = IHeaderlink | IHeaderLinkMenu

  export interface IHeaderOptions {
    menuNavigation: IStrapiCommonLink[]
    logo: IStrapiImage
  }

  export interface IFooterOptions {
    socialLink: ISocialLinks[]
    legalText: HTMLString
  }

  export interface IGlobalStructure {
    header: IHeaderOptions
    footer: IFooterOptions
    menu: IHeaderNavigation[]
  }

  // GLOBAL OPTIONS

  export interface INotFoundOptions {
    title: any
    description: any
  }

  export interface IGlobalSEO {
    metaTitle: string
    metaDescription: string
    metaImage: IStrapiImage
    siteName: string
    themeColor: string
    customMetas: Array<{ name: string; content: string }>
  }

  export interface IDictonary {
    knowMore: string
    copyText: string
  }

  export interface IGlobalOptions {
    dictionary: IDictonary
    globalSEO: IGlobalSEO
    notFound: INotFoundOptions
  }
}
