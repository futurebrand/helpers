import { UID, Modules } from "@strapi/strapi";
import type {
  IDocumentConfigs,
  IDocumentQuery,
  PublicationStatus,
} from "../../../types/document";

const DEFAULT_PUBLICATION_STATE: PublicationStatus = "published";

class ContentHandler<UID extends UID.ContentType> {
  public status: PublicationStatus;
  public populate: any;
  private documentService: Modules.Documents.Service;

  constructor(
    protected uid: UID,
    configs: IDocumentConfigs = {},
    documentService?: Modules.Documents.Service
  ) {
    this.documentService = documentService ?? strapi.documents;
    this.populate = configs.populate ?? {};
    this.status = configs.status ?? DEFAULT_PUBLICATION_STATE;
  }

  protected getStrapiApiConfig() {
    return strapi?.config?.api ?? {};
  }

  public get document() {
    return this.documentService(this.uid);
  }

  public async register() {
    // Do nothing
    // Only for extending
  }

  public bundleQuery(partial: Partial<IDocumentQuery> = {}): IDocumentQuery {
    return {
      ...partial,
      populate: partial.populate ?? this.populate,
      status: partial.status ?? this.status,
      ...(partial.locale ? { locale: partial.locale } : {}),
    };
  }
}

export default ContentHandler;
