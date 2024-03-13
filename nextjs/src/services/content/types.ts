import { IContentPagination } from "@futurebrand/types/contents"

export interface IQueryResponse<T> {
  results: T[]
  pagination: IContentPagination
}
