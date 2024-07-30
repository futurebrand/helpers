import { FetcherClient } from "@futurebrand/modules"
import { ContentTypes, IContentPagination } from "@futurebrand/types/contents"
import { ICMSContentApiPath } from "../cms"

export interface IContentServiceConfigs {
  fetcher?: FetcherClient, 
  contentPath?: ICMSContentApiPath
  revalidate?: number
}

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
  locale: string,
  key?: string,
  params?: T,
}

export interface ISingleCallerProps<T> extends IServiceCallerProps<any> {
  previewData?: T
}