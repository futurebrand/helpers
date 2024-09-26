import { Modules } from "@strapi/strapi";
import { UID } from "@strapi/strapi";

export type PublicationStatus = Modules.Documents.Params.PublicationStatus.Kind;
export type Sort<T extends UID.ContentType = any> =
  Modules.Documents.Params.Sort.Any<T>;

export interface IDocumentConfigs {
  populate?: any;
  status?: PublicationStatus;
}

export interface IDocumentKind {
  status: PublicationStatus;
  locale?: string;
}

export interface IDocumentQuery extends IDocumentKind {
  populate: any;
  filters?: Record<string, any>;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
