import { UID } from "@strapi/strapi";
import { LibraryCache } from "@futurebrand/utils";
import { IPopulateData } from "@futurebrand/utils/populate/types";

export interface IGlobalConfigs {
  seo: UID.ContentType;
  data: Record<string, UID.ContentType>;
  revalidate?: number | false;
}

export interface IGlobalEntity {
  uid: UID.ContentType;
  populate: IPopulateData;
  cache: LibraryCache;
}
