import { IContentService } from "@futurebrand/types/contents";
import {
  IMultiRelationConfigs,
  MultiRelationHandler,
  IMultiRelationEntity,
} from "./types";
import { Common, EntityService } from "@strapi/strapi";
import { populateCollection } from "@futurebrand/utils";
import { ContentsService, SyncService } from "@futurebrand/services";

const UNKNOWN_CONTENT_TYPE = "[UNKNOWN]";

class MultiRelationModule<T extends IMultiRelationEntity> {
  private uid: Common.UID.ContentType;
  private contents: Common.UID.ContentType[];
  private handler: MultiRelationHandler<T>;

  constructor(
    configs: IMultiRelationConfigs<T>,
    private entityService?: EntityService.EntityService
  ) {
    if (!this.entityService) {
      this.entityService = strapi.entityService;
    }

    this.uid = configs.uid;
    this.handler = configs.handler;
    this.contents = configs.contents.filter(
      (content) => !!this.handler[content]
    );
  }

  private async findEntity(
    relatedUID: Common.UID.ContentType,
    relatedType: string,
    relatedId: number
  ) {
    const response = await this.entityService.findMany(this.uid, {
      filters: {
        relatedId,
        relatedUID,
        relatedType,
      },
    });

    return response?.[0];
  }

  private async getEntityContentType(uid: Common.UID.ContentType, id: number) {
    const service = strapi.service(
      "plugin::futurebrand-strapi-helpers.contents"
    ) as IContentService;

    try {
      return await service.findContentType(uid, id);
    } catch {
      return UNKNOWN_CONTENT_TYPE;
    }
  }

  private async queryEntityData(
    uid: Common.UID.ContentType,
    contentType: string,
    id: number
  ) {
    const service = ContentsService.getInstance();

    try {
      if (!contentType || contentType === UNKNOWN_CONTENT_TYPE) {
        throw new Error(
          `[MULTI-RELATION] ContentType ${uid} does not exist in content service`
        );
      }

      const data = await service.unique(contentType, id);

      return data;
    } catch {
      const populate = populateCollection(uid);
      const data = await this.entityService.findOne(uid, id, {
        populate,
      });

      return data;
    }
  }

  public async onUpdateEntity(uid: Common.UID.ContentType, id: number) {
    if (!this.handler[uid]) {
      throw new Error(`[MULTI-RELATION] Lifecycle for ${uid} does not exist`);
    }

    const contentType = await this.getEntityContentType(uid, id);
    const data = await this.queryEntityData(uid, contentType, id);

    let entity = await this.findEntity(uid, contentType, id);
    let hasEntity = !!entity;

    if (!entity) {
      entity = {
        relatedId: id,
        relatedUID: uid,
        relatedType: contentType,
      };
    }

    entity = await this.handler[uid](entity, data);

    if (!entity) {
      if (hasEntity) {
        await this.entityService.delete(this.uid, entity.id);
      }
      return;
    }

    if (data.publishedAt) {
      entity.publishedAt = data.publishedAt;
    } else {
      entity.publishedAt = null;
    }

    if (hasEntity) {
      await this.entityService.update(this.uid, entity.id, {
        data: entity,
      });
    } else {
      await this.entityService.create(this.uid, {
        data: entity,
      });
    }
  }

  public async onDeletedEntity(uid: Common.UID.ContentType, id: number) {
    const contentType = await this.getEntityContentType(uid, id);
    const entity = await this.findEntity(uid, contentType, id);

    if (!entity || !entity.id) {
      return;
    }

    await this.entityService.delete(this.uid, entity.id);
  }

  private async createOrUpdateLifecycle(event: any) {
    const id = event?.result?.id as number;
    const uid = event.model.uid as Common.UID.ContentType;

    if (!id || !uid) return;

    try {
      await this.onUpdateEntity(uid, id);
    } catch (error) {
      console.error(error);
    }
  }

  public async createLifecycle() {
    strapi.db.lifecycles.subscribe({
      models: this.contents,
      afterUpdate: async (event) => this.createOrUpdateLifecycle(event),
      afterCreate: async (event) => this.createOrUpdateLifecycle(event),
      afterDelete: async (event: any) => {
        const id = event?.result?.id as number;
        const uid = event.model.uid as Common.UID.ContentType;

        if (!id || !uid) return;

        try {
          await this.onDeletedEntity(uid, id);
        } catch (error) {
          console.error(error);
        }
      },
      afterDeleteMany: async (event) => {
        try {
          const ids = event.params?.where?.$and?.find((query) => !!query.id)?.id
            ?.$in as number[];
          const uid = event.model.uid as Common.UID.ContentType;

          if (!ids || !uid) return;

          await Promise.all(
            ids.map(async (id) => {
              await this.onDeletedEntity(uid, id);
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    });
  }

  private async verifyRelationEntity(entity: IMultiRelationEntity) {
    if (!this.contents.includes(entity.relatedUID)) {
      return false;
    }

    const contentType = await this.getEntityContentType(
      entity.relatedUID,
      entity.relatedId
    );
    if (contentType !== entity.relatedType) {
      return false;
    }

    const data = await this.entityService.findOne(
      entity.relatedUID,
      entity.relatedId,
      {
        fields: ["id"],
      }
    );

    return !!data;
  }

  public async sync() {
    console.log(`[MULTI-RELATION] Syncing ${this.uid}`);

    const entries = await this.entityService.findMany(this.uid, {
      fields: ["id", "relatedId", "relatedUID", "relatedType"],
    });

    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (
          !this.verifyRelationEntity(entry as unknown as IMultiRelationEntity)
        ) {
          await this.entityService.delete(this.uid, entry.id);
        }
      }
    }

    for (const contentUid of this.contents) {
      const entities = await this.entityService.findMany(contentUid, {
        fields: ["id"],
        publicationState: "live",
      });

      if (!entities || !Array.isArray(entities)) {
        continue;
      }

      for (const entity of entities) {
        if (!entity?.id) {
          continue;
        }
        await this.onUpdateEntity(contentUid, (entity as any).id);
      }
    }
  }

  public async register() {
    await this.createLifecycle();

    const syncService = SyncService.getInstance();
    const syncKey = `multi-relation(${this.uid})`;

    syncService.register(syncKey, async () => {
      await this.sync();
    });
  }
}

export default MultiRelationModule;
