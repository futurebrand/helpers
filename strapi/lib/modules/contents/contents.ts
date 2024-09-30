import { UID, Modules } from "@strapi/strapi";
import { ContentSingle } from "./single";
import { ContentQuery } from "./query";
import { IQueryCallerParams, IQueryConfigs } from "./query/types";
import { IContentKey } from "./types";
import type { IServiceCaller } from "@futurebrand/types";
import { LibraryList } from "@futurebrand/utils/library";
import { ISingleConfigs } from "./single";
import { IDocumentKind } from "./handler";

export const DEFAULT_CONTENT_KEY = "default";

class ContentModule<UID extends UID.ContentType = any> {
  protected readonly uid: UID;

  protected queries: LibraryList<IContentKey, ContentQuery<UID>>;
  protected singles: LibraryList<IContentKey, ContentSingle>;

  private documentService: Modules.Documents.Service;

  constructor(uid: UID, documentService?: Modules.Documents.Service) {
    this.uid = uid;
    this.queries = new LibraryList<IContentKey, ContentQuery<UID>>();
    this.singles = new LibraryList<IContentKey, ContentSingle>();

    this.documentService = documentService ?? strapi.documents;
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

    return await single.get(params, { locale });
  }

  public async unique(
    key: string,
    documentId: string,
    kind: Partial<IDocumentKind> = {},
    params: any = {}
  ) {
    const single = this.singles.get(key);

    if (!single) {
      throw new Error(`Single with key ${key} does not exist`);
    }

    return await single.unique(documentId, params, kind);
  }

  public async getParams(
    key: string,
    documentId: string,
    kind?: Partial<IDocumentKind>
  ) {
    const single = this.singles.get(key);

    if (!single) {
      throw new Error(`Single with key ${key} does not exist`);
    }

    return await single.getParams(documentId, kind);
  }

  public async preview(documentId: string, params: any = {}, locale: string) {
    return await this.unique(
      DEFAULT_CONTENT_KEY,
      documentId,
      {
        locale,
        status: "draft",
      },
      params
    );
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
    return await single.seo(params, { locale });
  }

  public getSingle(key: IContentKey) {
    return this.singles.get(key);
  }

  public getQuery<T>(key: IContentKey) {
    return this.queries.get(key) as ContentQuery<UID, T> | undefined;
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
      this.documentService
    );
    return this.singles.push(key, newContentSingle);
  }

  public addDefaultSingle(data?: ISingleConfigs | ContentSingle) {
    return this.addSingle(DEFAULT_CONTENT_KEY, data);
  }

  public addQuery<T = any>(
    key: IContentKey,
    data?: IQueryConfigs<UID> | ContentQuery<UID, T>
  ) {
    if (this.queries.has(key)) {
      throw new Error(`Query with key ${key} already exists`);
    }

    if (data instanceof ContentQuery) {
      return this.queries.push(key, data);
    }

    const contentQuery = new ContentQuery<UID, T>(
      this.uid,
      data,
      this.documentService
    );
    return this.queries.push(key, contentQuery);
  }

  public addDefaultQuery<T = any>(
    data?: IQueryConfigs<UID> | ContentQuery<UID, T>
  ) {
    return this.addQuery(DEFAULT_CONTENT_KEY, data);
  }
}

export default ContentModule;
