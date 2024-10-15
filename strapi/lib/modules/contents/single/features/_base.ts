import {
  BeforeGetSingleEvent,
  AfterGetSingleEvent,
  ISingleConfigs,
  SinglePathConfig,
  AfterGetParamsEvent,
} from "../types";
import { UID, Modules } from "@strapi/strapi";

import { ContentHandler, IDocumentKind } from "../../handler";
import { LibraryCache } from "@futurebrand/utils";

const DEFAULT_SINGLE_PARAMS: SinglePathConfig[] = [
  { key: "slug", slugify: true, unique: true },
];

class ContentSingleBase<
  UID extends UID.ContentType = any
> extends ContentHandler<UID> {
  public pathConfigs: SinglePathConfig[];
  public public: boolean;
  public mapFilters: Record<string, any>;

  protected beforeGetEvent: BeforeGetSingleEvent;
  protected afterGetEvent: AfterGetSingleEvent;
  protected afterGetParams: AfterGetParamsEvent;

  protected cacheLibrary: LibraryCache;

  constructor(
    protected uid: UID,
    configs: ISingleConfigs = {},
    documentService?: Modules.Documents.Service
  ) {
    super(uid, configs, documentService);

    this.pathConfigs = configs.pathConfigs ?? DEFAULT_SINGLE_PARAMS;
    this.mapFilters = configs.mapFilters ?? {
      pageSeo: {
        showOnGoogle: true,
      },
    };
    this.public = configs.public ?? true;

    this.cacheLibrary = new LibraryCache(
      "single-cache",
      configs.seoCacheRevalidate
    );

    // EVENTS
    this.beforeGetEvent = async (params) => params;
    this.afterGetEvent = async (data) => data;
    this.afterGetParams = async (params) => params;
  }

  public async register() {
    await super.register();
  }

  public onBeforeGetEvent(event: BeforeGetSingleEvent) {
    this.beforeGetEvent = event;
    return this;
  }

  public onAfterGetEvent(event: AfterGetSingleEvent) {
    this.afterGetEvent = event;
    return this;
  }

  public onAfterGetParams(event: AfterGetParamsEvent) {
    this.afterGetParams = event;
    return this;
  }

  private slugifyPath(value: any, locale: string) {
    let slug = Array.isArray(value)
      ? (value as string[]).join("/")
      : (value as string) ?? "";
    slug = slug.startsWith("/") ? slug : `/${slug}`;

    let slugArray = [slug, `${slug}/`];

    if (slug === `/${locale}`) {
      slugArray = ["/", ...slugArray];
    }

    return slugArray;
  }

  protected async getContentQuery(
    params: Record<string, string | string[]>,
    kind: Partial<IDocumentKind> = {}
  ) {
    const filters: any = {};

    for (const path of this.pathConfigs) {
      const key = path.key;

      let value: any = params[key];

      if (!value) {
        continue;
      }

      if (path.slugify) {
        value = this.slugifyPath(value, kind.locale);
      }

      let filter: any;

      if (path.onGetFilter) {
        filter = await path.onGetFilter(value);
      } else {
        filter = {
          $eq: value,
        };
      }

      filters[key] = filter;
    }

    // Create Query Params
    const query = this.bundleQuery({
      filters,
      populate: this.populate,
      ...kind,
    });

    return this.beforeGetEvent(query, params);
  }
}

export default ContentSingleBase;
