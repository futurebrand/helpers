import { IDocumentKind } from "../../handler";
import ContentSingleBlocks from "./blocks";

class ContentSingleUnique extends ContentSingleBlocks {
  public async setLocalization(data: any) {
    if (
      !data.localizations ||
      !Array.isArray(data.localizations) ||
      data.localizations.length <= 0
    ) {
      data.localizations = [];
      return;
    }

    const localizations = [];

    for (const localization of data.localizations as Array<{
      id: number;
      locale: string;
    }>) {
      try {
        const params = await this.getParams(data.documentId, {
          locale: localization.locale,
        });

        if (!params) {
          continue;
        }

        const locale = {
          id: localization.id,
          locale: localization.locale,
          params: params,
        };

        localizations.push(locale);
      } catch {
        continue;
      }
    }

    data.localizations = localizations;
  }

  public async getDocument(
    documentId: string,
    kind: Partial<IDocumentKind> = {}
  ) {
    const query = this.bundleQuery(kind);
    // Find Page
    const data = await this.document.findOne({
      ...query,
      documentId,
    });

    return data;
  }

  public async getParams(
    documentId: string,
    kind: Partial<IDocumentKind> = {}
  ) {
    const data = await this.getDocument(documentId, kind);

    //
    const fields = this.pathConfigs
      .filter((config) => config.mapField !== false)
      .map((config) => config.key);

    const params = fields.reduce((acc, field) => {
      return {
        ...acc,
        [field]: data[field],
      };
    }, {});

    // Return Data
    return await this.afterGetParams(params, data);
  }

  public async unique(
    documentId: string,
    params: any = {},
    kind: Partial<IDocumentKind> = {}
  ) {
    const data = await this.getDocument(documentId, kind);

    // Handle Blocks
    if (this.blockHandlers && this.blockHandlers.length > 0) {
      for (const blockHandler of this.blockHandlers) {
        await blockHandler.sanitizeData(data, data.locale);
      }
    }
    // Set Localization
    await this.setLocalization(data);

    // Return Data
    return this.afterGetEvent(data, params);
  }
}

export default ContentSingleUnique;
