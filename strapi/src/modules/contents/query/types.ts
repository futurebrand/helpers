import type { IQueryResponse } from '~/types/contents'
import { IPublicationState, ISort } from '../types'

export interface IQueryCallerParams<T> {
  page: number
  filters: T
}

export interface IQueryProps<T> extends IQueryCallerParams<T> {
  locale?: string
}

export interface IQueryParams {
  locale?: string
  page?: number
  pageSize?: number
  filters: any
  populate: any
  publicationState: string
  sort: ISort
}

export interface IQueryConfigs {
  sort?: ISort
  filters?: Record<string, any>
  populate?: any
  hasPagination?: boolean
  pageSize?: number
  state?: IPublicationState;
}


export type FilterEvent<T> = (filters: T) => Promise<Record<string, any>>

export type BeforeQueryEvent<T> = (query: IQueryParams, props: IQueryProps<T>) => Promise<IQueryParams>
export type AfterQueryEvent<T> = (data: IQueryResponse, props: IQueryProps<T>) => Promise<IQueryResponse>

