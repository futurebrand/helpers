import { ContentClient } from "~/modules";
import { IPagination } from "~/modules/contents/types";

export interface IQueryResponse {
  results: any[];
  pagination?: IPagination;
}

export interface IContentSitemap {
  params: any;
  date: string;
}

export interface IContentService<T = string> {
  client: ContentClient | null,
  register: (client: ContentClient) => Promise<void>,
  query: (type: T, page: number, filters?: any, locale?: string) => Promise<IQueryResponse>
  sitemap: (type: T, locale?: string) => Promise<false | IContentSitemap[]>,
  single: (type: T, params: Record<string, string>, locale?: string) => Promise<any>
}