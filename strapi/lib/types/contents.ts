import { UID } from "@strapi/strapi";
import { ContentClient, GlobalClient } from "@futurebrand/modules";
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
  id: number;
  params: any;
}

export interface IServiceCaller<T = any> {
  key: IContentKey;
  locale?: string;
  params: T;
}

export interface IContentService<T = string> {
  client: ContentClient | null;
  register: (client: ContentClient) => Promise<void>;
  query: <P = any>(
    type: T,
    props: IServiceCaller<P>
  ) => Promise<IQueryResponse>;
  map: <P = any>(
    type: T,
    props: IServiceCaller<P>
  ) => Promise<false | IContentMap[]>;
  single: <P = any>(type: T, props: IServiceCaller<P>) => Promise<any>;
  seo: <P = any>(type: T, props: IServiceCaller<P>) => Promise<any>;
  preview: (token: string) => Promise<any>;
  getPreviewToken: (type: T, id: number, params: any) => string;
  getParams: (type: string, id: number) => Promise<any>;
  unique: (type: T, id: number) => Promise<any>;
  findContentType: (api: UID.ContentType, id: number) => Promise<string>;
}

export interface IGlobalService {
  data: (locale: string) => Promise<{}>;
  seo: (locale: string) => Promise<any>;
  locales: () => Promise<any>;
  getClient: () => GlobalClient;
  register: (newClient: GlobalClient) => Promise<void>;
}
