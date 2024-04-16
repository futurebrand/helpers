import { Common } from "@strapi/strapi"
import { IGeneratorFields, IWithSlugParentCollection } from "./types"

class GeneratePathQueryService {
  constructor(private uid: Common.UID.ContentType, private fields: IGeneratorFields) {}

  async updatePath(id: number, path: string): Promise<void> {
    await strapi.db.query(this.uid).update({
      where: { id },
      data: { [this.fields.path]: path },
    })
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
        [this.fields.children]: [id],
      },
    })
    return content
  }
  
  async getChildren(id: number): Promise<IWithSlugParentCollection[]> {
    const content = await strapi.db.query(this.uid).findMany({
      where: { [this.fields.parent]: id },
    })
    return content
  }
}

export default GeneratePathQueryService