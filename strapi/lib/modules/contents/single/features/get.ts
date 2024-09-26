import { IDocumentKind } from "../../handler";
import ContentSingleUnique from "./unique";

class ContentSingleMap extends ContentSingleUnique {
  public async get(
    params: Record<string, string>,
    kind: Partial<IDocumentKind>
  ) {
    if (!params) {
      throw new Error("Params is required");
    }

    const query = await this.getContentQuery(params, kind);

    // Find Page
    const results = await this.document.findFirst(query as any);

    // Check if page exists
    if (!results || results.length <= 0) {
      return false;
    }

    // Get Data
    const data = results[0];

    // Handle Blocks
    if (this.blockHandlers && this.blockHandlers.length > 0) {
      for (const blockHandler of this.blockHandlers) {
        await blockHandler.sanitizeData(data, kind.locale);
      }
    }

    // Set Localization
    await this.setLocalization(data);

    // Return Data
    return this.afterGetEvent(data, params);
  }
}

export default ContentSingleMap;
