import { IPopulateData } from "~/utils/populate/types";
import { BeforeGetSingleEvent, AfterGetSingleEvent, ISingleConfigs, SinglePathConfig, AfterGetParamsEvent } from "./types";
import { IPublicationState } from "../types";
import { ContentBlockHandler } from "~/modules/blocks";
import { Common, EntityService } from "@strapi/strapi";
import { populateCollection } from "~/utils/populate";
import { IContentMap } from "~/types";
import { errors } from '@strapi/utils'
import { ValidationError } from 'yup'
import { LibraryCache } from "~/utils";

const DEFAULT_SINGLE_PARAMS: SinglePathConfig[] = [{ key: 'slug', slugify: true, unique: true }]
const DEFAULT_PUBLICATION_STATE: IPublicationState = 'live'


class ContentSingle {
  public pathConfigs: SinglePathConfig[]
  public populate: IPopulateData
  
  public public: boolean
  public mapFilters: Record<string, any>

  public publicationState: IPublicationState
  public blockHandlers: ContentBlockHandler[]

  private cacheLibrary: LibraryCache

  protected beforeGetEvent: BeforeGetSingleEvent
  protected afterGetEvent: AfterGetSingleEvent
  protected afterGetParams: AfterGetParamsEvent

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
    this.afterGetParams = async (params) => params
    //    
    this.cacheLibrary = new LibraryCache('single-cache', configs.seoCacheRevalidate)
  }

  public onBeforeGetEvent(event: BeforeGetSingleEvent) {
    this.beforeGetEvent = event
    return this
  }

  public onAfterGetEvent(event: AfterGetSingleEvent) {
    this.afterGetEvent = event
    return this
  }

  public onAfterGetParams(event: AfterGetParamsEvent) {
    this.afterGetParams = event
    return this
  }

  public addBlockHandler(handler: ContentBlockHandler) {
    this.blockHandlers.push(handler)

    return this
  }

  public async onLifecycleEvent({ data, where }: any, isUpdate: boolean) {
    let id = Number(where?.id ?? data?.id)
    if (Number.isNaN(id)) {
      id = 0
    }
    
    if (id && !data.locale) {
      const localeResponse = await this.entityService.findOne(this.uid as any, id)
      if (localeResponse && localeResponse.locale) {
        data.locale = localeResponse.locale
      }
    } else if (!id && isUpdate) {
      return
    }
    
    await this.verifyUniqueKeyFields(data, id)

    if (id && data.pageSeo && data.locale) {
      await this.onUpdateSEO(id, data.locale)
    }
  }

  public async verifyUniqueKeyFields(data: any, id?: number) {
    for (const pathConfig of this.pathConfigs) {
      const key = pathConfig.key
      const value = data[key]

      if (!value || pathConfig.unique === false) {
        continue
      }

      const query: any = {
        filters: {
          [key]: value,
        },
      }

      if (data.locale) {
        query.filters.locale = data.locale
        query.locale = data.locale
      }

      if (id) {
        query.filters.id = {
          $ne: id,
        }
      }

      const results = await this.entityService.findMany(this.uid as any, query as any)

      if (results && results.length > 0) {
        const error = new ValidationError('This field must be unique', null, key)
        throw new errors.YupValidationError(error, 'Validation Error')
      }
    }
  }

  public async updateLifecycle() {
    strapi.db.lifecycles.subscribe({
      models: [this.uid],
      beforeCreate: async (event) => {
        const params = event?.params
        if (params?.data) {
          await this.onLifecycleEvent(params, false)
        }
      },
      beforeUpdate: async (event) => {
        const params = event?.params
        if (params?.data) {
          await this.onLifecycleEvent(params, true)
        }
      }
    })
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

    await this.updateLifecycle()
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
    const filters: any = {}

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

    if (locale) {
      filters.locale = locale
    }

    // Create Query Params
    const query = {
      filters,
      populate: this.populate,
      limit: 1,
      publicationState: this.publicationState,
      ...(locale ? {locale} : {})
    }

    return this.beforeGetEvent(query, params)
  }

  public async setLocalization(data: any) {
    if (!data.localizations || !Array.isArray(data.localizations) || data.localizations.length <= 0) {
      data.localizations = []
      return
    }

    const localizations = []

    for (const localization of data.localizations as Array<{id: number, locale: string}>) {
      try {
        const params = await this.getParams(localization.id)
        if (!params) {
          continue
        }

        const locale = {
          id: localization.id,
          locale: localization.locale,
          params: params
        }

        localizations.push(locale)
        
      } catch {
        continue
      }
    }

    data.localizations = localizations
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

    // Set Localization
    await this.setLocalization(data)

    // Return Data
    return this.afterGetEvent(data, params)
  }

  public async unique(id: number, params: any = {}) {    
    // Find Page
    const data = await this.entityService.findOne(
      this.uid as any,
      id,
      {
        populate: this.populate as any,
      }
    )

    // Check if page exists
    if (!data) {
      return false
    }

    // Handle Blocks
    if (this.blockHandlers && this.blockHandlers.length > 0) {
      for (const blockHandler of this.blockHandlers) {
        await blockHandler.sanitizeData(data, data.locale)
      }
    }
    // Set Localization
    await this.setLocalization(data)

    // Return Data
    return this.afterGetEvent(data, params)
  }

  public async getParams(id: number) {  
    const data = await this.entityService.findOne(
      this.uid as any,
      id,
    )

    if (!data) {
      return false
    }

    //
    const fields = this.pathConfigs
      .filter(config => config.mapField !== false)
      .map((config) => config.key)
    const params = fields.reduce((acc, field) => {
      return {
        ...acc,
        [field]: data[field],
      }
    }, {})

    // Return Data
    return await this.afterGetParams(params, data)
  }

  private async getCacheFromParams(cacheType = 'seo', params: Record<string, string>, locale?: string) {
    return await this.cacheLibrary.fromObject({
      cacheType,
      locale: locale ?? 'default',
      ...params,
    })
  }

  public async onUpdateSEO(id: number, locale: string) {
    const params = await this.getParams(id)
    const cache = await this.getCacheFromParams('seo', params, locale)
    if (cache) {
      cache.invalidate()
    }
  }

  public async seo(params: Record<string, string>, locale?: string) {
    if (!params) {
      throw new Error('Params is required in SEO')
    }

    const cache = await this.getCacheFromParams('seo', params, locale)

    return cache.staleWhileRevalidate(async () => {
      const query = await this.getContentQuery(params, locale)
    
      // Find Page
      const results = await this.entityService.findMany(
        this.uid as any,
        {
          ...query,
          fields: [],
          populate: {
            pageSeo: {
              populate: {
                metaImage: true,
                redirect: true
              }
            },
            ...( locale ? {localizations: true}: {})
          }
        } as any
      )
  
      // Check if page exists
      if (!results || results.length <= 0) {
        return false
      }
  
      // Get Data
      const data = results[0]
  
      // Set Localization
      await this.setLocalization(data)

      // Return Data
      return  data
    })   
  }


  public async map(locale?: string): Promise<false | IContentMap[]>{
    const fields = this.pathConfigs
      .filter(config => config.mapField !== false)
      .map((config) => config.key)

    // Find Page
    const results = await this.entityService.findMany(this.uid, {
      fields: [...fields, 'updatedAt'],
      filters: {
        ...(this.mapFilters ?? {}),
        ...(locale ? { locale } : {}),
      },
      publicationState: this.publicationState,
      ...(locale ? { locale } : {}),
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