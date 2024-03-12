import { EntityService, type Common } from '@strapi/strapi'

import { type IPopulateData } from '../../utils/populate/types'
import { type IFilter, type FilterEvent } from './types'
import { type BlockData } from '../blocks/types'
import { populateCollection } from '../../utils/populate'
import ContentBlockHandler from '../blocks'

class ContentApiModule {
  private readonly uid: Common.UID.Schema
  private pageSize: number
  private hasPagination: boolean

  private indexPopulate: IPopulateData
  private listPopulate: IPopulateData

  private order: Record<string, 'desc' | 'asc'>

  private slugFieldName: string

  private defaultFilters: any
  private filterEvent: FilterEvent

  private hasSingle: boolean

  private blockHandler: ContentBlockHandler

  /*
   * The uid can be the name of the folder in api directory.
   * Or api UID name, in this format 'api::<uid>.<uid>' or just '<uid>'.
   */
  constructor(uid: string, private entityService?: EntityService.EntityService) {
    this.uid = (
      uid.startsWith('api::') ? uid : `api::${uid}.${uid}`
    ) as Common.UID.Schema

    if (!this.entityService) {
      this.entityService = strapi.entityService
    }
    
    this.pageSize = 9
    this.hasPagination = true

    this.indexPopulate = populateCollection(this.uid)
    this.listPopulate = populateCollection(this.uid, 1)

    this.order = { publishedAt: 'desc' }

    this.defaultFilters = {}
    this.filterEvent = () => ({})

    this.slugFieldName = 'slug'

    this.hasSingle = true
  }

  public setPageSize(pageSize: number) {
    this.pageSize = pageSize
  }

  public setPagination(hasPagination: boolean) {
    this.hasPagination = hasPagination
  }

  public setIndexPopulate(populate: IPopulateData) {
    this.indexPopulate = populate
  }

  public setListPopulate(populate: IPopulateData) {
    this.listPopulate = populate
  }

  public setOrder(order: Record<string, 'asc' | 'desc'>) {
    this.order = order
  }

  public setDefaultFilters(filters: Record<string, any>) {
    this.defaultFilters = filters
  }

  public setSlugFieldName(fieldName: string) {
    this.slugFieldName = fieldName
  }

  public setIfHasSingle(hasSingle: boolean) {
    this.hasSingle = hasSingle
  }

  public setBlockHandler(blockHandler: ContentBlockHandler) {
    this.blockHandler = blockHandler
  }

  public onFilter(event: FilterEvent) {
    this.filterEvent = event
  }

  public async getContentBySlug(slug: string, locale?: string) {
    if (!this.hasSingle) {
      throw new Error('This content type does not have a single content')
    }

    if (!slug) {
      throw new Error('Slug is required')
    }

    // Create possible path filters
    const slugFilter = [slug, `${slug}/`]

    // Create Query Params
    const query = {
      filters: {
        [this.slugFieldName]: {
          $eq: slugFilter,
        },
      },
      ...(locale ? { locale } : {}),
      populate: this.indexPopulate,
      limit: 1,
      publicationState: 'live',
    }
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
    return data
  }

  public async listSlugs(locale?: string) {
    // Find Page
    const results = await strapi.entityService.findMany(this.uid as any, {
      fields: [this.slugFieldName, 'updatedAt'],
      filters: {
        pageSeo: {
          showOnGoogle: true,
        },
      },
      ...(locale ? { locale } : {}),
      publicationState: 'live',
    })

    if (!Array.isArray(results)) {
      return false
    }

    // Return Data
    return results.map((content) => ({
      slug: content[this.slugFieldName],
      date: content.updatedAt,
    }))
  }

  public async list(page: number, userFilters: IFilter, locale?: string) {
    const filters = {
      ...this.defaultFilters,
      ...this.filterEvent(userFilters),
    }

    // Create Query Params
    const query = {
      filters,
      populate: this.listPopulate,
      publicationState: 'live',
      order: this.order,
      ...(locale ? { locale } : {}),
    }

    if (this.hasPagination) {
      const { results, pagination } = await strapi.entityService.findPage(
        this.uid as any,
        {
          ...(query as any),
          page,
          pageSize: this.pageSize,
        }
      )

      return {
        results,
        pagination,
      }
    } else {
      const results = await strapi.entityService.findMany(
        this.uid as any,
        query as any
      )

      return {
        results,
      }
    }
  }
}

export default ContentApiModule
