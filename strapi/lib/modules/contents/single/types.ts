import {
  IDocumentConfigs,
  IDocumentQuery,
  PublicationStatus,
} from "../handler";

export type onPathParamsGetFilter = (value: string) => Promise<any>;
export type onPathParamsGetMap = (value: string) => Promise<any>;

export interface SinglePathConfig {
  key: string;
  slugify: boolean;
  unique?: boolean;
  mapField?: boolean;
  onGetFilter?: onPathParamsGetFilter;
}

export interface ISingleConfigs extends IDocumentConfigs {
  pathConfigs?: SinglePathConfig[];
  public?: boolean;
  mapFilters?: Record<string, any>;
  seoCacheRevalidate?: number | false;
}

export type BeforeGetSingleEvent = (
  query: IDocumentQuery,
  params: Record<string, string | string[]>
) => Promise<IDocumentQuery>;
export type AfterGetSingleEvent = (
  data: any,
  params: Record<string, string | string[]>
) => Promise<any>;
export type AfterGetParamsEvent = (
  params: Record<string, string | string[]>,
  data: any
) => Promise<any>;
