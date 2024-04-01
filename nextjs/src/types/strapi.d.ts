declare module '@futurebrand/types/strapi' {
  import { IFetchResponse } from '@futurebrand/modules/fetcher'

  export type HTMLString = string

  export interface IStrapiComponent<T> {
    id: number
    attributes: T
  }

  export interface IStrapiDataComponent<T> {
    data: IStrapiComponent<T>
  }

  export interface IStrapiDataComponentList<T> {
    data: Array<IStrapiComponent<T>>
  }

  export interface IStrapiNullnableMDataComponent<T> {
    data: IStrapiComponent<T> | null
  }

  export type ApiResponse<T> = IFetchResponse<IStrapiDataComponent<T>>
  export type ApiListResponse<T> = IFetchResponse<IStrapiDataComponent<T>[]>

  export interface IStrapiMediaAttributes {
    placeholder?: `data:image/${string}`
    url: string
    alternativeText: string
    width: number
    height: number
    mime: string
    name: string
    caption: string
  }

  export type IStrapiMedia = IStrapiDataComponent<IStrapiMediaAttributes>
  export type IStrapiMediaList =
    IStrapiDataComponentList<IStrapiMediaAttributes>
  export type IStrapiNullnableMedia =
    IStrapiNullnableMDataComponent<IStrapiMediaAttributes>

  export interface IResponsiveImage {
    desktop: IStrapiMedia
    mobile: IStrapiMedia
  }

  export interface ISocialLinks {
    id: number
    type: string
    label: string
    link: string
  }

  export interface IStrapiCommonLink {
    id: number
    text: string
    url: string
    blank: boolean
  }

  export type IButtonVariant = 'filled-black' | 'outline-black'

  export interface IStrapiButton {
    id: number
    variant: IButtonVariant
    text: string
  }

  export interface IStrapiTitle {
    text: string
    htmlTag: string
  }

  export interface IStrapiLinkButton extends IStrapiButton {
    url: string
    blank?: boolean
  }
}
