import { IContentPagination } from "~/types/contents"

export interface IQueryResponse<T> {
  results: T[]
  pagination: IContentPagination
}
