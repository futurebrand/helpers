import { IPopulateData } from "~/utils/populate/types";
import { BeforeGetSingleEvent, AfterGetSingleEvent, ISingleConfigs, SinglePathConfig } from "./types";
import { IPublicationState } from "../types";
import { ContentBlockHandler } from "~/modules/blocks";
import { Common, EntityService } from "@strapi/strapi";
import { populateCollection } from "~/utils/populate";
import { IContentMap } from "~/types";

const DEFAULT_SINGLE_PARAMS: SinglePathConfig[] = [{ key: 'slug', slugify: true }]
const DEFAULT_PUBLICATION_STATE: IPublicationState = 'live'

class ContentSingle {
  public pathConfigs: SinglePathConfig[]
  public populate: IPopulateData
  
  public public: boolean
  public mapFilters: Record<string, any>

  public publicationState: IPublicationState
  public blockHandlers: ContentBlockHandler[]

  protected beforeGetEvent: BeforeGetSingleEvent
  protected afterGetEvent: AfterGetSingleEvent

  constructor(
    protected uid: Common.UID.ContentType,
    configs: ISingleConfigs = {}, 
    private entityService?: EntityService.EntityService
  ) {
    if (!this.entityService) {
      this.entityService = strapi.entityService
    }

    this.pathConfigs = configs.pathConfigs ?? DEFAULT_SINGLE_PARAMS
    this.mapFilters = configs.mapFilters ?? {
      pageSeo: {
        showOnGoogle: true,
      },
    }
    this.publicationState = configs.state ?? DEFAULT_PUBLICATION_STATE
    this.blockHandlers = []
    this.public = configs.public ?? true
    if (configs.populate) {
      this.populate = configs.populate
    }
    // EVENTS
    this.beforeGetEvent = async (params) => params
    this.afterGetEvent = async (data) => data
  }

  public onBeforeGetEvent(event: BeforeGetSingleEvent) {
    this.beforeGetEvent = event

    return this
  }

  public onAfterGetEvent(event: AfterGetSingleEvent) {
    this.afterGetEvent = event

    return this
  }

  public addBlockHandler(handler: ContentBlockHandler) {
    this.blockHandlers.push(handler)

    return this
  }

  public async register() {
    if (this.blockHandlers && this.blockHandlers.length > 0) {
      const contentType = strapi.contentType(this.uid)
      for (const blockHandler of this.blockHandlers) {
        if (contentType) {
          blockHandler.updateContentType(contentType)
        }  
      }
    }
    if (!this.populate) {
      this.populate = populateCollection(this.uid)
    }
  }

  private slugifyPath(value: any, locale: string) {
    let slug = Array.isArray(value) ? (value as string[]).join('/') : value as string ?? ''
    slug = slug.startsWith('/') ? slug : `/${slug}`
    
    let slugArray = [slug, `${slug}/`]

    if (slug === `/${locale}`) {
      slugArray = ['/', ...slugArray]
    }

    return slugArray
  }

  protected async getContentQuery(params: Record<string, string | string[]>, locale?: string) {
    const filters = {}

    for (const path of this.pathConfigs) {
      const key = path.key

      let value: any = params[key]

      if (!value) {
        continue
      }

      if (path.slugify) {
        value = this.slugifyPath(value, locale)
      }

      let filter: any

      if (path.onGetFilter) {
        filter = await path.onGetFilter(value)
      } else {
        filter = {
          $eq: value,
        }
      }

      filters[key] = filter
    }

    // Create Query Params
    const query = {
      filters,
      ...(locale ? { locale } : {}),
      populate: this.populate,
      limit: 1,
      publicationState: this.publicationState,
    }

    return this.beforeGetEvent(query, params)
  }

  public async get(params: Record<string, string>, locale?: string) {
    if (!params) {
      throw new Error('Params is required')
    }

    const query = await this.getContentQuery(params, locale)
    
    // Find Page
    const results = await this.entityService.findMany(
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
    if (this.blockHandlers && this.blockHandlers.length > 0) {
      for (const blockHandler of this.blockHandlers) {
        await blockHandler.sanitizeData(data, locale)
      }
    }

    // Return Data
    return this.afterGetEvent(data, params)
  }


  public async map(locale?: string): Promise<false | IContentMap[]>{
    const fields = this.pathConfigs
      .filter(config => config.mapField !== false)
      .map((config) => config.key)

    // Find Page
    const results = await this.entityService.findMany(this.uid, {
      fields: [...fields, 'updatedAt'],
      filters: this.mapFilters,
      ...(locale ? { locale } : {}),
      publicationState: this.publicationState,
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
}

export default ContentSingle