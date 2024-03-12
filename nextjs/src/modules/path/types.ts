import { ContentTypes } from "~/types/contents"

export interface IPageParams {
  locale: string
  slug: string[] | string
  type?: ContentTypes
}
