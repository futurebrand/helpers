import { ValidationError } from "yup";
import { errors } from "@strapi/utils";
import ContentSingleMap from "./map";

class ContentSingleLifecycle extends ContentSingleMap {
  private async onLifecycleEvent({ data, where }: any, isUpdate: boolean) {
    const documentId = data.documentId as string;

    if (documentId && !data.locale) {
      const localeResponse = await this.document.findOne({
        documentId,
      });
      if (localeResponse && localeResponse.locale) {
        data.locale = localeResponse.locale;
      }
    } else if (!documentId && isUpdate) {
      return;
    }

    await this.verifyUniqueKeyFields(data, documentId);

    if (documentId && data.pageSeo && data.locale) {
      await this.onUpdateSEO(documentId, data.locale);
    }
  }

  private async verifyUniqueKeyFields(data: any, documentId?: string) {
    for (const pathConfig of this.pathConfigs) {
      const key = pathConfig.key;
      const value = data[key];

      if (!value || pathConfig.unique === false) {
        continue;
      }

      const query: any = {
        filters: {
          [key]: value,
        },
      };

      if (data.locale) {
        query.locale = data.locale;
      }

      if (documentId) {
        query.filters.documentId = {
          $ne: documentId,
        };
      }

      const results = await this.document.findFirst(query);

      if (results) {
        const error = new ValidationError(
          "This field must be unique",
          null,
          key
        );
        throw new errors.YupValidationError(error, "Validation Error");
      }
    }
  }

  private async updateLifecycle() {
    strapi.db.lifecycles.subscribe({
      models: [this.uid],
      beforeCreate: async (event) => {
        const params = event?.params;
        if (params?.data) {
          await this.onLifecycleEvent(params, false);
        }
      },
      beforeUpdate: async (event) => {
        const params = event?.params;
        if (params?.data) {
          await this.onLifecycleEvent(params, true);
        }
      },
    });
  }

  public async register() {
    await super.register();
    await this.updateLifecycle();
  }
}

export default ContentSingleLifecycle;
