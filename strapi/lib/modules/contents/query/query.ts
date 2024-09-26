import { IQueryResponse } from "@futurebrand/types";
import {
  AfterQueryEvent,
  BeforeQueryEvent,
  FilterEvent,
  IQueryConfigs,
  IQueryParams,
  IQueryProps,
} from "./types";
import { UID, Modules } from "@strapi/strapi";
import { ContentHandler, Pagination, Sort } from "../handler";

const DEFAULT_PAGE_SIZE = 9;
const DEFAULT_ORDER: Sort = { publishedAt: "desc" };

class ContentQuery<
  UID extends UID.ContentType,
  T = any
> extends ContentHandler<UID> {
  public sort: Sort<UID>;
  public filters: Record<string, any>;
  public hasPagination: boolean;
  public pageSize: number;

  protected filterEvent: FilterEvent<T>;
  protected beforeQueryEvent: BeforeQueryEvent<T, UID>;
  protected afterQueryEvent: AfterQueryEvent<T>;

  constructor(
    protected uid: UID,
    configs: IQueryConfigs<UID> = {},
    documentService?: Modules.Documents.Service
  ) {
    super(uid, configs, documentService);

    const strapiApiConfig = this.getStrapiApiConfig();

    this.sort = configs.sort ?? (DEFAULT_ORDER as Sort<UID>);
    this.filters = configs.filters ?? {};
    this.hasPagination =
      configs.hasPagination ?? strapiApiConfig.withCount ?? true;
    this.pageSize =
      configs.pageSize ?? strapiApiConfig.defaultLimit ?? DEFAULT_PAGE_SIZE;

    // EVENTS
    this.filterEvent = async () => ({});
    this.beforeQueryEvent = async (params) => params;
    this.afterQueryEvent = async (data) => data;
  }

  protected async getQueryParams(props: IQueryProps<T>) {
    const { filters, locale } = props;

    const userFilters = await this.filterEvent(filters);

    const filterMerger = {
      ...this.filters,
      ...userFilters,
    };

    // Create Query Params
    const params = {
      filters: filterMerger,
      populate: this.populate,
      status: this.status,
      sort: this.sort,
      ...(locale ? { locale } : {}),
    };

    return this.beforeQueryEvent(params, props);
  }

  /**
   * getPagination
   */
  private async getPagination(
    props: IQueryProps<T>,
    query: IQueryParams<UID>
  ): Promise<Pagination> {
    const total = await this.document.count(query);

    const pageCount = Math.ceil(total / this.pageSize);

    return {
      page: props.page ?? 1,
      pageSize: this.pageSize,
      pageCount,
      total,
    };
  }

  public async query(props: IQueryProps<T>) {
    const query = await this.getQueryParams(props);
    if (this.hasPagination) {
      const pagination = await this.getPagination(props, query);
      const start = (pagination.page - 1) * this.pageSize;

      const results = await this.document.findMany({
        start,
        limit: pagination.pageSize,
        ...query,
      });

      return this.afterQueryEvent(
        {
          results,
          pagination,
        } as IQueryResponse,
        props
      );
    } else {
      const results = await strapi.entityService.findMany(
        this.uid,
        query as any
      );

      return this.afterQueryEvent(
        {
          results,
        } as IQueryResponse,
        props
      );
    }
  }

  public onFilterEvent(event: FilterEvent<T>) {
    this.filterEvent = event;
    return this;
  }

  public onBeforeQueryEvent(event: BeforeQueryEvent<T, UID>) {
    this.beforeQueryEvent = event;
    return this;
  }

  public onAfterQueryEvent(event: AfterQueryEvent<T>) {
    this.afterQueryEvent = event;
    return this;
  }
}

export default ContentQuery;
