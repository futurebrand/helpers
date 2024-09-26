import { IContentMap } from "@futurebrand/types";
import ContentSingleSeo from "./seo";

class ContentSingleMap extends ContentSingleSeo {
  public async map(locale?: string): Promise<false | IContentMap[]> {
    const fields = this.pathConfigs
      .filter((config) => config.mapField !== false)
      .map((config) => config.key);

    // Find Page
    const results = await this.document.findMany({
      fields: [...fields, "updatedAt"],
      filters: {
        ...(this.mapFilters ?? {}),
      },
      status: this.status,
      ...(locale ? { locale } : {}),
    });

    if (!Array.isArray(results)) {
      return false;
    }

    // Return Data
    return results.map((content) => ({
      params: fields.reduce((acc, field) => {
        return {
          ...acc,
          [field]: content[field],
        };
      }, {}),
      date: content.updatedAt,
    }));
  }
}

export default ContentSingleMap;
