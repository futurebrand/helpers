import { ContentClient } from "~/modules";
import { IContentKey, IPagination } from "~/modules/contents/types";

export interface IQueryResponse {
  results: any[];
  pagination?: IPagination;
}

export interface IContentMap {
  params: any;
  date: string;
}

export interface IServiceCaller<T = any> {
  key: IContentKey
  locale?: string
  params: T
}

export interface IContentService<T = string> {
  client: ContentClient | null,
  register: (client: ContentClient) => Promise<void>,
  query: <P = any>(type: T, props: IServiceCaller<P>) => Promise<IQueryResponse>
  map: <P = any>(type: T, props: IServiceCaller<P>) => Promise<false | IContentMap[]>,
  single: <P = any>(type: T, props: IServiceCaller<P>) => Promise<any>
}