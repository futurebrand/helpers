import ContentSingleGet from "./get";
import { IDocumentKind } from "../../handler";

class ContentSingleSeo extends ContentSingleGet {
  private async getSEOCache(
    params: Record<string, string>,
    kind: IDocumentKind
  ) {
    return this.cacheLibrary.fromObject({
      cacheType: "seo",
      ...params,
      ...kind,
    });
  }

  public async onUpdateSEO(documentId: string, kind: IDocumentKind) {
    try {
      const params = await this.getParams(documentId, kind);
      const cache = await this.getSEOCache(params, kind);
      if (cache) {
        cache.invalidate();
      }
    } catch (error) {
      return;
    }
  }

  public async seo(
    params: Record<string, string>,
    kind: Partial<IDocumentKind>
  ) {
    if (!params) {
      throw new Error("Params is required in SEO");
    }

    const cache = await this.getSEOCache(params, {
      status: this.status,
      ...kind,
    });

    return cache.staleWhileRevalidate(async () => {
      const query = await this.getContentQuery(params, kind);

      // Find Page
      const results = await this.document.findFirst({
        ...query,
        fields: [],
        populate: {
          pageSeo: {
            populate: {
              metaImage: true,
              redirect: true,
            },
          },
          ...(kind.locale ? { localizations: true } : {}),
        },
      } as any);

      // Check if page exists
      if (!results || results.length <= 0) {
        return false;
      }

      // Get Data
      const data = results[0];

      // Set Localization
      await this.setLocalization(data);

      // Return Data
      return data;
    });
  }
}

export default ContentSingleSeo;
