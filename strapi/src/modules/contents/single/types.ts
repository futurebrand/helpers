import { IPublicationState } from '../types';

export type onPathParamsGetFilter = (value: string) => Promise<any>
export type onPathParamsGetMap = (value: string) => Promise<any>

export interface SinglePathConfig {
  key: string,
  slugify: boolean
  unique?: boolean
  mapField?: boolean
  onGetFilter?: onPathParamsGetFilter
}

export interface ISingleParams {
  populate: any
  limit: number
  publicationState: string
  locale?: string
  filters: Record<string, any>
}

export interface ISingleConfigs {
  pathConfigs?: SinglePathConfig[];
  populate?: any;
  public?: boolean;
  mapFilters?: Record<string, any>;
  state?: IPublicationState;
  seoCacheRevalidate?: number | false;
}

export type BeforeGetSingleEvent = (query: ISingleParams, params: Record<string, string | string[]>) => Promise<ISingleParams>
export type AfterGetSingleEvent = (data: any, params: Record<string, string | string[]>) => Promise<any>
export type AfterGetParamsEvent = (params: Record<string, string | string[]>, data: any) => Promise<any>
