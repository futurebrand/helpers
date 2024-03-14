declare module '@futurebrand/types/global-options' {
  import {
    type HTMLString,
    type ISocialLinks,
    type IStrapiCommonLink,
    type IStrapiImage,
  } from '@futurebrand/types/strapi'

  export interface IGlobalStructure {}

  export interface IGlobalSEO {
    metaTitle: string
    metaDescription: string
    metaImage: IStrapiImage
    siteName: string
    themeColor: string
    customMetas: Array<{ name: string; content: string }>
  }

  export interface IDictonary {}

  export interface IGlobalOptions {}
}
