declare module '@futurebrand/types/global-options' {
  import {
    type IStrapiMedia,
  } from '@futurebrand/types/strapi'

  export interface IGlobalStructure {}

  export interface IGlobalSEO {
    metaTitle: string
    metaDescription: string
    metaImage: IStrapiMedia
    siteName: string
    themeColor: string
    customMetas: Array<{ name: string; content: string }>
  }

  export interface IDictonary {}

  export interface IGlobalOptions {}
}
