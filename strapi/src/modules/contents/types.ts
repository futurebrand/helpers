import type { IQueryResponse } from '~/types/contents'

export type SinglePathParams = Record<string, string>

export type IPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface IQueryProps<T> {
  page: number
  filters: T
  locale?: string
}

export interface IQueryParams {
  locale?: string
  page?: number
  pageSize?: number
  filters: any
  populate: any
  publicationState: string
  order: Record<string, "desc" | "asc">
}

export interface ISingleParams {
  populate: any
  limit: number
  publicationState: string
  locale?: string
  filters: Record<string, any>
}


export type IPublicationState = 'live' | 'preview'
export type IOrder = Record<string, 'desc' | 'asc'>

export interface ISingleConfigs {
  pathParams?: SinglePathParams;
  populate?: any;
  showOnSitemap?: boolean;
  sitemapFilters?: Record<string, any>;
  state?: IPublicationState;
}

export interface IQueryConfigs {
  order?: IOrder
  filters?: Record<string, any>
  populate?: any
  hasPagination?: boolean
  pageSize?: number
  state?: IPublicationState;
}

export type FilterEvent<T> = (filters: T) => Promise<Record<string, any>>

export type BeforeQueryEvent<T> = (query: IQueryParams, props: IQueryProps<T>) => Promise<IQueryParams>
export type AfterQueryEvent<T> = (data: IQueryResponse, props: IQueryProps<T>) => Promise<IQueryResponse>

export type BeforeGetSingleEvent = (query: ISingleParams, params: Record<string, string | string[]>) => Promise<ISingleParams>
export type AfterGetSingleEvent = (data: any, params: Record<string, string | string[]>) => Promise<any>