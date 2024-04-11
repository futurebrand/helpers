import { Common } from "@strapi/strapi"
import { IWithSlugParentCollection } from "./types"

class GeneratePathQueryService {
  constructor(private uid: Common.UID.ContentType) {
     
  }

  async getByID(id: number): Promise<IWithSlugParentCollection> {
    const content = await strapi.db.query(this.uid).findOne({
      where: {
        id,
      },
    })
    return content
  }
  
  async getParent(id: number): Promise<IWithSlugParentCollection> {
    const content = await strapi.db.query(this.uid).findOne({
      where: {
        children: [id],
      },
    })
    return content
  }
  
  async getChildren(id: number): Promise<IWithSlugParentCollection[]> {
    const content = await strapi.db.query(this.uid).findMany({
      where: { parent: id },
    })
    return content
  }
}

export default GeneratePathQueryService