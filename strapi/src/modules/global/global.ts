import { Common, EntityService } from "@strapi/strapi"
import { LibraryCache, LibraryList, populateCollection } from "~/utils"
import { IGlobalConfigs, IGlobalEntity } from "./types"


class GlobalClient {
  public entities: LibraryList<string, IGlobalEntity>
  public seo: IGlobalEntity
  
  private cacheRevalidate: number

  constructor (configs: IGlobalConfigs, private entityService?: EntityService.EntityService) {
    if (!this.entityService) {
      this.entityService = strapi.entityService
    }
    
    this.entities = new LibraryList<string, IGlobalEntity>()
    
    Object.keys(configs.data).map(key => {
      this.entities.push(key, this.getEntity(configs.data[key]))
    })

    this.seo = this.getEntity(configs.seo)
    this.cacheRevalidate = configs.revalidate
  }
  
  private getEntity(uid: Common.UID.ContentType) : IGlobalEntity {
    const populate = populateCollection(uid)
    const cache = new LibraryCache(this.cacheRevalidate)
    return {
      uid,
      populate,
      cache
    }
  }

  public async getEntityData(entity: IGlobalEntity, locale?: string) {
    const cache = entity.cache.get(locale || 'default')

    const cacheData = cache?.get()
    if (cacheData) {
      return cacheData
    }

    const response = await this.entityService.findMany(entity.uid, {
      populate: entity.populate as any,
      filters: {
        ...(locale ? { locale } : {})
      },
      ...(locale ? { locale } : {})
    })

    cache?.set(response)
    return response
  }

  public async getData(locale?: string) {
    const data = {}

    await this.entities.map(async (key, entity) => {
      data[key] = await this.getEntityData(entity, locale)
    })

    return data
  }

  public async getSeoData(locale?: string) {
    return await this.getEntityData(this.seo, locale)
  }

  public async register() {
    // Only for abstract porpuses
  }
}

export default GlobalClient