import { Common } from "@strapi/strapi";
import { LibraryCache } from "@futurebrand/utils";
import { IPopulateData } from "@futurebrand/utils/populate/types";

export interface IGlobalConfigs {
  seo: Common.UID.ContentType;
  data: Record<string, Common.UID.ContentType>;
  revalidate?: number | false;
}

export interface IGlobalEntity {
  uid: Common.UID.ContentType;
  populate: IPopulateData;
  cache: LibraryCache;
}
