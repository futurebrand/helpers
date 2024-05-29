import { Common } from "@strapi/strapi"
import { LibraryCache } from "~/utils"
import { IPopulateData } from "~/utils/populate/types"

export interface IGlobalConfigs {
  seo: Common.UID.ContentType
  data: Record<string, Common.UID.ContentType>
  revalidate?: number | false
}


export interface IGlobalEntity {
  uid: Common.UID.ContentType
  populate: IPopulateData
  cache: LibraryCache
}