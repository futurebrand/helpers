import { GlobalClient } from "@futurebrand/modules";
import { IContentKey, IPagination } from "@futurebrand/modules/contents/types";

export interface IQueryResponse {
  results: any[];
  pagination?: IPagination;
}

export interface IContentMap {
  params: any;
  date: string;
}

export interface IPreviewParams {
  type: string;
  document: string;
  locale: string;
  params: any;
}

export interface IServiceCaller<T = any> {
  key: IContentKey;
  locale?: string;
  params: T;
}

export interface IGlobalService {
  data: (locale: string) => Promise<{}>;
  seo: (locale: string) => Promise<any>;
  locales: () => Promise<any>;
  getClient: () => GlobalClient;
  register: (newClient: GlobalClient) => Promise<void>;
}
