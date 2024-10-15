import { ContentBlockHandler } from "@futurebrand/modules/blocks";
import ContentSingleBase from "./_base";

class ContentSingleBlocks extends ContentSingleBase {
  public blockHandlers: ContentBlockHandler[] = [];

  public addBlockHandler(handler: ContentBlockHandler) {
    this.blockHandlers.push(handler);

    return this;
  }

  public async register() {
    await super.register();

    if (this.blockHandlers && this.blockHandlers.length > 0) {
      const contentType = strapi.contentType(this.uid);
      for (const blockHandler of this.blockHandlers) {
        if (contentType) {
          blockHandler.updateContentType(contentType as any);
        }
      }
    }
  }
}

export default ContentSingleBlocks;
