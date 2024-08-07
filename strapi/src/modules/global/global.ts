import { Common, EntityService } from "@strapi/strapi"
import { LibraryCache, LibraryList, MemoryCache, populateCollection } from "~/utils"
import { IGlobalConfigs, IGlobalEntity } from "./types"
import { getDefaultCacheRevalidate } from "~/utils/cache/revalidate"

const LOCALES_UID: Common.UID.ContentType = 'plugin::i18n.locale'

class GlobalClient {
  public entities: LibraryList<string, IGlobalEntity>
  public seo: IGlobalEntity
  public locales: MemoryCache

  constructor (configs: IGlobalConfigs, private entityService?: EntityService.EntityService) {
    if (!this.entityService) {
      this.entityService = strapi.entityService
    }
    
    this.entities = new LibraryList<string, IGlobalEntity>()

    const revalidate = configs.revalidate || getDefaultCacheRevalidate()
    
    Object.keys(configs.data).map(key => {
      this.entities.push(key, this.getEntity(key, configs.data[key], revalidate))
    })

    this.seo = this.getEntity('seo', configs.seo, revalidate)
    this.locales = new MemoryCache(revalidate)
  }
  
  private getEntity(key: string, uid: Common.UID.ContentType, revalidate?: number | false) : IGlobalEntity {
    const populate = populateCollection(uid)
    const cache = new LibraryCache(`globa(${key})`, revalidate)
    return {
      uid,
      populate,
      cache
    }
  }

  public async getEntityData(entity: IGlobalEntity, locale?: string) {
    const cache = await entity.cache.fromKey(locale || 'default')

    return cache.staleWhileRevalidate(async () => {
      return await this.entityService.findMany(entity.uid, {
        populate: entity.populate as any,
        filters: {
          ...(locale ? { locale } : {})
        },
        ...(locale ? { locale } : {})
      })
    })
  }

  public async getData(locale?: string) {
    const data = {}

    await this.entities.map(async (key, entity) => {
      data[key] = await this.getEntityData(entity, locale)
    })

    return data
  }

  private async loadLocales() {
    const service = strapi.plugins.i18n.services.locales
    const defaultLocale = await service.getDefaultLocale()
    const locales = await service.find()
    return locales.map((locale) => ({
      ...locale,
      isDefault: locale.code === defaultLocale,
    }))
  }

  public async getLocales() {
    return this.locales.staleWhileRevalidate(this.loadLocales)
  }

  public async getSeoData(locale?: string) {
    return await this.getEntityData(this.seo, locale)
  }

  public async onUpdateListener() {
    // SEO
    strapi.db.lifecycles.subscribe({
      models: [this.seo.uid],
      beforeUpdate: async () => {
        this.seo.cache.invalidate()
      }
    })
    // SEO
    strapi.db.lifecycles.subscribe({
      models: [LOCALES_UID],
      beforeUpdate: async () => {
        this.locales.invalidate()
      }
    })
    // DATA
    await this.entities.map(async (key, entity) => {
      strapi.db.lifecycles.subscribe({
        models: [entity.uid],
        beforeUpdate: async () => {
          entity.cache.invalidate()
        }
      })
    })
  }

  public async register() {
    await this.onUpdateListener()
  }
}

export default GlobalClient