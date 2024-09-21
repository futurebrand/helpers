import { UID } from "@strapi/strapi";
import ContentApiModule from "./contents";

abstract class ContentClient<T = string> {
  abstract getContentByType(type: T): ContentApiModule | null;
  abstract getContentTypeByID(
    api: UID.ContentType,
    id: number
  ): Promise<T | null>;
  abstract register(): Promise<void>;
}

export default ContentClient;
