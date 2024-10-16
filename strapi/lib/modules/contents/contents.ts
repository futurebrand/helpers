import { Common, EntityService } from "@strapi/strapi";
import ContentSingle from "./single/single";
import ContentQuery from "./query/query";
import { IQueryCallerParams, IQueryConfigs } from "./query/types";
import { IContentKey } from "./types";
import type { IServiceCaller } from "@futurebrand/types";
import LibraryList from "@futurebrand/utils/library/library";
import { ISingleConfigs } from "./single";

export const DEFAULT_CONTENT_KEY = "default";

class ContentModule {
  protected readonly uid: Common.UID.ContentType;

  protected queries: LibraryList<IContentKey, ContentQuery>;
  protected singles: LibraryList<IContentKey, ContentSingle>;

  constructor(
    uid: Common.UID.ContentType,
    private entityService?: EntityService.EntityService
  ) {
    this.uid = uid;
    this.queries = new LibraryList<IContentKey, ContentQuery>();
    this.singles = new LibraryList<IContentKey, ContentSingle>();

    if (!this.entityService) {
      this.entityService = strapi.entityService;
    }
  }

  public async register() {
    if (this.singles.length > 0) {
      await this.singles.map(async (_, single) => {
        await single.register();
      });
    }
    if (this.queries.length > 0) {
      await this.queries.map(async (_, query) => {
        await query.register();
      });
    }
  }

  public async query({
    key,
    params,
    locale,
  }: IServiceCaller<IQueryCallerParams<any>>) {
    const query = this.queries.get(key);
    if (!query) {
      throw new Error(`Query with key ${key} does not exist`);
    }

    return await query.query({
      filters: params.filters,
      page: params.page,
      locale,
    });
  }

  public async map({ key, locale }: IServiceCaller<any>) {
    const single = this.singles.get(key);
    if (!single) {
      throw new Error(`Single with key ${key} does not exist`);
    }

    return await single.map(locale);
  }

  public async single({
    key,
    params,
    locale,
  }: IServiceCaller<Record<string, any>>) {
    const single = this.singles.get(key);
    if (!single) {
      throw new Error(`Single with key ${key} does not exist`);
    }

    return await single.get(params, locale);
  }

  public async unique(key: string, id: number, params?: any) {
    const single = this.singles.get(key);

    if (!single) {
      throw new Error(`Single with key ${key} does not exist`);
    }

    if (!params) {
      params = await this.getParams(key, id);
    }

    return await single.unique(id, params);
  }

  public async getParams(key: string, id: number) {
    const single = this.singles.get(key);

    if (!single) {
      throw new Error(`Single with key ${key} does not exist`);
    }

    return await single.getParams(id);
  }

  public async preview(id: number, params: any = {}) {
    return await this.unique(DEFAULT_CONTENT_KEY, id, params);
  }

  public async seo({
    key,
    params,
    locale,
  }: IServiceCaller<Record<string, any>>) {
    const single = this.singles.get(key);
    if (!single) {
      throw new Error(`Single with key ${key} does not exist`);
    }
    return await single.seo(params, locale);
  }

  public getSingle(key: IContentKey) {
    return this.singles.get(key);
  }

  public getQuery<T>(key: IContentKey) {
    return this.queries.get(key) as ContentQuery<T> | undefined;
  }

  public addSingle(key: IContentKey, data?: ISingleConfigs | ContentSingle) {
    if (this.singles.has(key)) {
      throw new Error(`Single with key ${key} already exists`);
    }

    if (data instanceof ContentSingle) {
      return this.singles.push(key, data);
    }

    const newContentSingle = new ContentSingle(
      this.uid,
      data,
      this.entityService
    );
    return this.singles.push(key, newContentSingle);
  }

  public addDefaultSingle(data?: ISingleConfigs | ContentSingle) {
    return this.addSingle(DEFAULT_CONTENT_KEY, data);
  }

  public addQuery<T = any>(
    key: IContentKey,
    data?: IQueryConfigs | ContentQuery<T>
  ) {
    if (this.queries.has(key)) {
      throw new Error(`Query with key ${key} already exists`);
    }

    if (data instanceof ContentQuery) {
      return this.queries.push(key, data);
    }

    const contentQuery = new ContentQuery<T>(
      this.uid,
      data,
      this.entityService
    );
    return this.queries.push(key, contentQuery);
  }

  public addDefaultQuery<T = any>(data?: IQueryConfigs | ContentQuery<T>) {
    return this.addQuery(DEFAULT_CONTENT_KEY, data);
  }
}

export default ContentModule;
