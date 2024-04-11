import { IQueryResponse } from "~/types"
import { AfterQueryEvent, BeforeQueryEvent, FilterEvent, IQueryConfigs, IQueryProps } from "./types"
import { Common, EntityService } from "@strapi/strapi"
import { IOrder, IPublicationState } from "../types"

const DEFAULT_PAGE_SIZE = 9
const DEFAULT_PUBLICATION_STATE: IPublicationState = 'live'
const DEFAULT_ORDER: IOrder = { publishedAt: 'desc' }

class ContentQuery<T = any> {
  public order: IOrder
  public filters: Record<string, any>
  public populate: any
  public hasPagination: boolean
  public pageSize: number
  public publicationState: IPublicationState;

  protected filterEvent: FilterEvent<T>
  protected beforeQueryEvent: BeforeQueryEvent<T>
  protected afterQueryEvent: AfterQueryEvent<T>

  constructor(
    protected uid: Common.UID.ContentType, 
    configs: IQueryConfigs = {}, 
    private entityService?: EntityService.EntityService
  ) {
    if (!this.entityService) {
      this.entityService = strapi.entityService
    }

    const strapiApiConfig = this.getStrapiApiConfig()

    this.order = configs.order ?? DEFAULT_ORDER
    this.filters = configs.filters ?? {}
    this.populate = configs.populate ?? {}
    this.hasPagination = configs.hasPagination ?? strapiApiConfig.withCount ?? true
    this.pageSize = configs.pageSize ?? strapiApiConfig.defaultLimit ?? DEFAULT_PAGE_SIZE
    this.publicationState = configs.state ?? DEFAULT_PUBLICATION_STATE

    // EVENTS
    this.filterEvent = async () => ({})
    this.beforeQueryEvent = async (params) => params
    this.afterQueryEvent = async (data) => data
  }

  
  private getStrapiApiConfig() {
    return strapi?.config?.api ?? {}
  }

  public async register() {
    // Do nothing
    // Only for extending
  }

  protected async getQueryParams(props: IQueryProps<T>) {
    const { filters, page, locale } = props

    const userFilters = await this.filterEvent(filters)

    const filterMerger = {
      ...this.filters,
      ...userFilters,
    }

    // Create Query Params
    const params = {
      filters: filterMerger,
      populate: this.populate,
      publicationState: this.publicationState,
      order: this.order,
      ...(this.hasPagination ? { 
        page,
        pageSize: this.pageSize,
      } : {}),
      ...(locale ? { locale } : {}),
    }

    return this.beforeQueryEvent(params, props)
  }

  public async query(props: IQueryProps<T>) {
    const query = await this.getQueryParams(props)
    if (this.hasPagination) {
      const { results, pagination } = await strapi.entityService.findPage(
        this.uid,
        query as any
      )

      return this.afterQueryEvent(
        {
          results,
          pagination
        } as IQueryResponse, 
        props
      )
    } else {
      const results = await strapi.entityService.findMany(
        this.uid,
        query as any
      ) 

      return this.afterQueryEvent(
        {
          results
        } as IQueryResponse, 
        props
      )
    }
  }

  public onFilterEvent(event: FilterEvent<T>) {
    this.filterEvent = event
    return this
  }

  public onBeforeQueryEvent(event: BeforeQueryEvent<T>) {
    this.beforeQueryEvent = event
    return this
  }

  public onAfterQueryEvent(event: AfterQueryEvent<T>) {
    this.afterQueryEvent = event
    return this
  }
}

export default ContentQuery