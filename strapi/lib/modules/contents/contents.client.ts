import { UID } from "@strapi/strapi";
import ContentApiModule from "./contents";

abstract class ContentClient<T = string> {
  abstract getContentByType(type: T): ContentApiModule<any> | null;
  abstract getContentTypeByID(
    api: UID.ContentType,
    documentId: string
  ): Promise<T | null>;
  abstract register(): Promise<void>;
}

export default ContentClient;
