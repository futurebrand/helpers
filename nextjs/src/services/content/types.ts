import { ContentTypes, IContentPagination } from "@futurebrand/types/contents"

export interface IQueryResponse<T> {
  results: T[]
  pagination: IContentPagination
}

export interface IQueryCallerParams {
  filters?: Record<string, any>
  page?: number
}

export interface IServiceCallerProps<T> {
  type: ContentTypes,
  key?: string,
  params?: T,
  locale?: string,
}

export interface ISingleCallerProps<T> extends IServiceCallerProps<any> {
  serverData?: T
}