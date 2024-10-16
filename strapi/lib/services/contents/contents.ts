import { Common } from "@strapi/strapi";
import type {
  IPreviewParams,
  IServiceCaller,
} from "@futurebrand/types/contents";
import { ContentClient, Token } from "@futurebrand/modules";
import { getHelpersPluginConfigs } from "@futurebrand/configs";

export class ContentsService<T = string> {
  private contentClient: ContentClient<T> | null;
  private previewToken: Token<IPreviewParams>;

  constructor() {
    this.contentClient = null;
    this.previewToken = new Token<IPreviewParams>();
  }

  public async register(client: ContentClient<T>) {
    this.contentClient = client;

    const config = getHelpersPluginConfigs();
    if (config.previewSecret && typeof config.previewSecret === "string") {
      this.previewToken.setSecret(config.previewSecret);
    }

    await this.contentClient.register();
  }

  public get client() {
    if (!this.contentClient) {
      throw new Error("Content client not initialized");
    }
    return this.contentClient;
  }

  public getContentService(type: T) {
    return this.client.getContentByType(type);
  }

  public async query(type: T, props: IServiceCaller) {
    const service = this.getContentService(type);
    return await service.query(props);
  }

  public async map(type: T, props: IServiceCaller) {
    const service = this.getContentService(type);
    return await service.map(props);
  }

  public async single(type: T, props: IServiceCaller) {
    const service = this.getContentService(type);
    return await service.single(props);
  }

  public async seo(type: T, props: IServiceCaller) {
    const service = this.getContentService(type);
    return await service.seo(props);
  }

  public async preview(token: string) {
    if (!this.previewToken.verifier(token)) {
      throw new Error("Invalid token");
    }

    const { type, id, params } = this.previewToken.decode(token);

    const service = this.getContentService(type as T);
    const data = await service.preview(id, params);

    return {
      data,
      type,
      params,
    };
  }

  public getPreviewToken(type: string, id: number, params: any) {
    return this.previewToken.tokenizer({ type, id, params });
  }

  public async unique(type: T, id: number) {
    const service = this.getContentService(type);
    return await service.unique("default", id);
  }

  public async getParams(type: T, id: number) {
    const service = this.getContentService(type);
    return await service.getParams("default", id);
  }

  public async findContentType(api: Common.UID.ContentType, id: number) {
    return await this.client.getContentTypeByID(api, id);
  }

  public static getInstance() {
    const service = strapi.service(
      "plugin::futurebrand-strapi-helpers.contents"
    ) as ContentsService;
    return service;
  }
}

export default ContentsService;
