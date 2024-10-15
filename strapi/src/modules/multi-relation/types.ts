import { Common } from "@strapi/strapi"

export interface IMultiRelationEntity {
  relatedId: number
  relatedUID: Common.UID.ContentType
  relatedType: string
}

export type MultiRelationHandlerFunction<T extends IMultiRelationEntity, D = any> = (entity: T, data: D) => Promise<T>

export type MultiRelationHandler<T extends IMultiRelationEntity> = Partial<Record<Common.UID.ContentType, MultiRelationHandlerFunction<T>>>

export interface IMultiRelationConfigs<T extends IMultiRelationEntity> {
  uid: Common.UID.ContentType
  contents: Common.UID.ContentType[]
  handler: MultiRelationHandler<T>
}

