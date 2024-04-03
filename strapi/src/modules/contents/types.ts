import ContentBlockHandler from "../blocks";

export type IFilter = Record<string, string | number | boolean>

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

export interface IQueryResponse {
  results: any[];
  pagination?: IPagination;
}

export type IPublicationState = 'live' | 'preview'
export type IOrder = Record<string, 'desc' | 'asc'>

export type SinglePathParams = Record<string, string>

export interface ISingleConfigs {
  pathParams?: SinglePathParams;
  populate?: any;
  sitemapFilters?: Record<string, any>;
  state?: IPublicationState;
  blockHandler?: ContentBlockHandler
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

export type BeforeQueryEvent = (params: IQueryParams) => Promise<IQueryParams>
export type AfterQueryEvent = (data: IQueryResponse) => Promise<IQueryResponse>

export type BeforeGetSingleEvent = (params: ISingleParams) => Promise<ISingleParams>
export type AfterGetSingleEvent = (data: any) => Promise<any>