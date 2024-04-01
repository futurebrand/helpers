import { EntityService, type Common } from '@strapi/strapi'

import { type IPopulateData } from '../../utils/populate/types'
import { IQueryResponse, type IFilter, type IQueryProps, ISingleConfigs, IQueryConfigs, IPublicationState } from './types'
import { type BlockData } from '../blocks/types'
import { populateCollection } from '../../utils/populate'
import ContentBlockHandler from '../blocks'
import ContentModuleEvents from './contents.events'

class ContentModule<T = IFilter> extends ContentModuleEvents<T> {
  protected readonly uid: Common.UID.Schema

  protected hasQuery: boolean
  protected queryOrder: Record<string, 'desc' | 'asc'>
  protected queryFilters: Record<string, any>
  protected queryPopulate: IPopulateData
  protected queryHasPagination: boolean
  protected queryPageSize: number
  protected queryPublicationState: IPublicationState
  
  protected hasSingle: boolean
  protected singleFieldName: string
  protected singlePopulate: IPopulateData
  protected singleSitemapFilters: Record<string, any>
  protected singlePublicationState: IPublicationState

  protected blockHandler: ContentBlockHandler

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
    this.queryPageSize = 9
    this.queryPopulate = populateCollection(this.uid, 1)
    this.queryOrder = { publishedAt: 'desc' }
    this.queryFilters = {}
    this.queryPublicationState = 'live'

    this.hasSingle = false
    this.singleFieldName = 'slug'
    this.singlePopulate = populateCollection(this.uid)
    this.singleSitemapFilters = {
      pageSeo: {
        showOnGoogle: true,
      },
    }
    this.singlePublicationState = 'live'

  }


  public addBlockHandler(blockHandler: ContentBlockHandler) {
    this.blockHandler = blockHandler
  }

  public addSinglePage(configs: ISingleConfigs = {}) {
    this.hasSingle = true
    if (configs.fieldName) {
      this.singleFieldName = configs.fieldName
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
  }

  public addQuery(configs: IQueryConfigs) {
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

  protected async getSingleParams(slug: string, locale?: string) {
    // Create possible path filters
    const slugFilter = [slug, `${slug}/`]

    // Create Query Params
    const query = {
      filters: {
        [this.singleFieldName]: {
          $eq: slugFilter,
        },
      },
      ...(locale ? { locale } : {}),
      populate: this.singlePopulate,
      limit: 1,
      publicationState: this.singlePublicationState,
    }

    return this.beforeGetSingleEvent(query)
  }

  public async getContentSingle(slug: string, locale?: string) {
    if (!this.hasSingle) {
      throw new Error('This content type does not have a single content')
    }

    if (!slug) {
      throw new Error('Slug is required')
    }

    const params = await this.getSingleParams(slug, locale)
    
    // Find Page
    const results = await strapi.entityService.findMany(
      this.uid as any,
      params as any
    )

    // Check if page exists
    if (!results || results.length <= 0) {
      return false
    }

    // Get Data
    const data = results[0]

    // Handle Blocks
    if (this.blockHandler && data) {
      const key = this.blockHandler.fieldName
      if (data[key] && Array.isArray(data[key])) {
        data[key] = await this.blockHandler.sanitize(
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

    // Find Page
    const results = await strapi.entityService.findMany(this.uid as any, {
      fields: [this.singleFieldName, 'updatedAt'],
      filters: this.singleSitemapFilters,
      ...(locale ? { locale } : {}),
      publicationState: this.singlePublicationState,
    })

    if (!Array.isArray(results)) {
      return false
    }

    // Return Data
    return results.map((content) => ({
      slug: content[this.singleFieldName],
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
