import { EntityService, type Common } from '@strapi/strapi'

import { type IPopulateData } from '../../utils/populate/types'
import { type BlockData } from '../blocks/types'
import { populateCollection } from '../../utils/populate'
import ContentBlockHandler from '../blocks'
import ContentModuleEvents from './contents.events'
import type { 
  IQueryResponse,  
  IFilter, 
  IQueryProps, 
  ISingleConfigs, 
  IQueryConfigs, 
  IPublicationState, 
  IOrder, 
  SinglePathParams 
} from './types'

const DEFAULT_PAGE_SIZE = 9
const DEFAULT_SINGLE_PARAMS: SinglePathParams = { slug: 'slug' }
const DEFAULT_PUBLICATION_STATE: IPublicationState = 'live'
const DEFAULT_ORDER: IOrder = { publishedAt: 'desc' }

class ContentModule<T = any> extends ContentModuleEvents<T> {
  protected readonly uid: Common.UID.Schema

  protected hasQuery: boolean
  protected queryOrder: IOrder
  protected queryFilters: Record<string, any>
  protected queryPopulate: IPopulateData
  protected queryHasPagination: boolean
  protected queryPageSize: number
  protected queryPublicationState: IPublicationState
  
  protected hasSingle: boolean
  protected singlePathParams: SinglePathParams
  protected singlePopulate: IPopulateData
  protected singleSitemapFilters: Record<string, any>
  protected singlePublicationState: IPublicationState
  protected singleBlockHandler: ContentBlockHandler

  /*
   * The uid can be the name of the folder in api directory.
   * Or api UID name, in this format 'api::<uid>.<uid>' or just '<uid>'.
   */
  constructor(uid: string, private entityService?: EntityService.EntityService) {
    super()

    this.uid = (
      uid.startsWith('api::') ? uid : `api::${uid}.${uid}`
    ) as Common.UID.Schema

    if (!this.entityService) {
      this.entityService = strapi.entityService
    }
    
    this.hasQuery = false
    this.queryHasPagination = true
    this.queryPageSize = DEFAULT_PAGE_SIZE
    this.queryPopulate = {}
    this.queryOrder = DEFAULT_ORDER
    this.queryFilters = {}
    this.queryPublicationState = DEFAULT_PUBLICATION_STATE

    this.hasSingle = false
    this.singlePathParams = DEFAULT_SINGLE_PARAMS
    this.singlePopulate = populateCollection(this.uid)
    this.singleSitemapFilters = {
      pageSeo: {
        showOnGoogle: true,
      },
    }
    this.singlePublicationState = DEFAULT_PUBLICATION_STATE
  }

  public addSinglePage(configs: ISingleConfigs = {}) {
    this.hasSingle = true
    if (configs.pathParams) {
      this.singlePathParams = configs.pathParams
    }
    if (configs.populate) {
      this.singlePopulate = configs.populate
    }
    if (configs.sitemapFilters) {
      this.singleSitemapFilters = configs.sitemapFilters
    }
    if (configs.state) {
      this.singlePublicationState = configs.state
    }
    if (configs.blockHandler) {
      this.singleBlockHandler = configs.blockHandler
    }
  }

  public addQuery(configs: IQueryConfigs = {}) {
    this.hasQuery = true
    
    if (configs.order) {
      this.queryOrder = configs.order
    }

    if (configs.filters) {
      this.queryFilters = configs.filters
    }

    if (configs.populate) {
      this.queryPopulate = configs.populate
    }

    if (configs.hasPagination !== undefined) {
      this.queryHasPagination = configs.hasPagination
    }

    if (configs.pageSize) {
      this.queryPageSize = configs.pageSize
    }

    if (configs.state) {
      this.queryPublicationState = configs.state
    }
  }

  protected async getSingleQuery(params: Record<string, string | string[]>, locale?: string) {
    const filters = Object.keys(this.singlePathParams).reduce((acc, key) => {
      

      let value = Array.isArray(params[key]) ? (params[key] as string[]).join('/') : params[key] as string ?? ''
      value = value.startsWith('/') ? value : `/${value}`
      let slugs = [value, `${value}/`]

      if (value === `/${locale}`) {
        slugs = ['/',...slugs]
      }

      return {
        ...acc,
        [this.singlePathParams[key]]: {
          $eq: slugs,
        },
      }
    }, {})

    // Create Query Params
    const query = {
      filters,
      ...(locale ? { locale } : {}),
      populate: this.singlePopulate,
      limit: 1,
      publicationState: this.singlePublicationState,
    }

    return this.beforeGetSingleEvent(query)
  }

  public async getContentSingle(params: Record<string, string>, locale?: string) {
    if (!this.hasSingle) {
      throw new Error('This content type does not have a single content')
    }

    if (!params) {
      throw new Error('Params is required')
    }

    const query = await this.getSingleQuery(params, locale)
    
    // Find Page
    const results = await strapi.entityService.findMany(
      this.uid as any,
      query as any
    )

    // Check if page exists
    if (!results || results.length <= 0) {
      return false
    }

    // Get Data
    const data = results[0]

    // Handle Blocks
    if (this.singleBlockHandler && data) {
      const key = this.singleBlockHandler.fieldName
      if (data[key] && Array.isArray(data[key])) {
        data[key] = await this.singleBlockHandler.sanitize(
          data[key] as BlockData[],
          locale
        )
      }
    }

    // Return Data
    return this.afterGetSingleEvent(data)
  }

  public async getContentSitemap(locale?: string) {
    if (!this.hasSingle) {
      throw new Error('This content type does not have a single content')
    }

    const fields = Object.values(this.singlePathParams)

    // Find Page
    const results = await strapi.entityService.findMany(this.uid as any, {
      fields: [...fields, 'updatedAt'],
      filters: this.singleSitemapFilters,
      ...(locale ? { locale } : {}),
      publicationState: this.singlePublicationState,
    })

    if (!Array.isArray(results)) {
      return false
    }

    // Return Data
    return results.map((content) => ({
      params: fields.reduce((acc, field) => {
        return {
          ...acc,
          [field]: content[field],
        }
      }, {}),
      date: content.updatedAt,
    }))
  }

  protected async getQueryParams({ filters, page, locale }: IQueryProps<T>) {
    if (!this.hasQuery) {
      throw new Error('This content type does not have a query')
    }

    const userFilters = await this.onFilterEvent(filters)

    const filterMerger = {
      ...this.queryFilters,
      ...userFilters,
    }

    // Create Query Params
    const params = {
      filters: filterMerger,
      populate: this.queryPopulate,
      publicationState: this.queryPublicationState,
      order: this.queryOrder,
      ...(this.queryHasPagination ? { 
        page,
        pageSize: this.queryPageSize,
      } : {}),
      ...(locale ? { locale } : {}),
    }

    return this.beforeQueryEvent(params)
  }

  public async query(props: IQueryProps<T>) {
    if (!this.hasQuery) {
      throw new Error('This content type does not have a query')
    }

    const query = await this.getQueryParams(props)
    if (this.queryHasPagination) {
      const { results, pagination } = await strapi.entityService.findPage(
        this.uid as any,
        query as any
      )

      return this.afterQueryEvent({
        results,
        pagination
      } as IQueryResponse)
    } else {
      const results = await strapi.entityService.findMany(
        this.uid as any,
        query as any
      ) 

      return this.afterQueryEvent({
        results,
      } as IQueryResponse)
    }
  }
}

export default ContentModule
