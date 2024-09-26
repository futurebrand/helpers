import type { IQueryResponse } from "@futurebrand/types/contents";
import { IDocumentConfigs, PublicationStatus, Sort } from "../handler";
import { UID } from "@strapi/strapi";

export interface IQueryCallerParams<T> {
  page: number;
  filters: T;
}

export interface IQueryProps<T> extends IQueryCallerParams<T> {
  locale?: string;
}

export interface IQueryParams<T extends UID.ContentType> {
  filters: any;
  populate: any;
  status: PublicationStatus;
  sort: Sort<T>;
  locale?: string;
  limit?: number;
  start?: number;
}

export interface IQueryConfigs<T extends UID.ContentType>
  extends IDocumentConfigs {
  sort?: Sort<T>;
  filters?: Record<string, any>;
  hasPagination?: boolean;
  pageSize?: number;
}

export type FilterEvent<T> = (filters: T) => Promise<Record<string, any>>;

export type BeforeQueryEvent<T, UID extends UID.ContentType> = (
  query: IQueryParams<UID>,
  props: IQueryProps<T>
) => Promise<IQueryParams<UID>>;
export type AfterQueryEvent<T> = (
  data: IQueryResponse,
  props: IQueryProps<T>
) => Promise<IQueryResponse>;
