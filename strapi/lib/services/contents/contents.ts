import { UID } from "@strapi/strapi";

import type {
  IPreviewParams,
  IServiceCaller,
} from "@futurebrand/types/contents";
import { ContentClient, IDocumentKind, Token } from "@futurebrand/modules";

export class ContentsService {
  public client: ContentClient | null;
  private previewToken: Token<IPreviewParams>;

  constructor() {
    this.client = null;
    this.previewToken = new Token<IPreviewParams>();
  }

  public async register(newClient: ContentClient) {
    this.client = newClient;

    const config: any = await strapi.config.get(
      "plugin::futurebrand-strapi-helpers"
    );
    if (config.previewSecret && typeof config.previewSecret === "string") {
      this.previewToken.setSecret(config.previewSecret);
    }

    await this.client.register();
  }

  public getContentService(type: string) {
    if (!this.client) {
      throw new Error("Content client not initialized");
    }
    return this.client.getContentByType(type);
  }

  public async query(type: string, props: IServiceCaller) {
    const service = this.getContentService(type);
    return await service.query(props);
  }

  public async map(type: string, props: IServiceCaller) {
    const service = this.getContentService(type);
    return await service.map(props);
  }

  public async single(type: string, props: IServiceCaller) {
    const service = this.getContentService(type);
    return await service.single(props);
  }

  public async seo(type: string, props: IServiceCaller) {
    const service = this.getContentService(type);
    return await service.seo(props);
  }

  public async preview(token: string) {
    if (!this.previewToken.verifier(token)) {
      throw new Error("Invalid token");
    }

    const { type, document, params, locale } = this.previewToken.decode(token);

    const service = this.getContentService(type);
    const data = await service.preview(document, params, locale);

    return {
      data,
      type,
      params,
    };
  }

  public getPreviewToken(
    type: string,
    document: string,
    params: any,
    locale: string
  ) {
    return this.previewToken.tokenizer({ type, document, params, locale });
  }

  public async unique(
    type: string,
    documentId: string,
    kind: Partial<IDocumentKind>
  ) {
    const service = this.getContentService(type);
    return await service.unique("default", documentId, kind);
  }

  public async getParams(
    type: string,
    documentId: string,
    kind?: Partial<IDocumentKind>
  ) {
    const service = this.getContentService(type);
    return await service.getParams("default", documentId, kind);
  }

  public async findContentType(api: UID.ContentType, documentId: string) {
    if (!this.client) {
      throw new Error("Content client not initialized");
    }
    return await this.client.getContentTypeByID(api, documentId);
  }
}

export default ContentsService;
