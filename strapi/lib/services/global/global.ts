import { GlobalClient } from "@futurebrand/modules";

class GlobalService {
  globalClient: GlobalClient | null;

  constructor() {
    this.globalClient = null;
  }

  async register(globalClient: GlobalClient) {
    this.globalClient = globalClient;
    await this.globalClient.register();
  }

  public getClient() {
    return this.globalClient;
  }

  public get client() {
    if (!this.globalClient) {
      throw new Error("Global client not initialized");
    }
    return this.globalClient;
  }

  async data(locale: string) {
    return this.client.getData(locale);
  }

  async seo(locale: string) {
    return this.client.getSeoData(locale);
  }

  async locales() {
    return this.client.getLocales();
  }

  public static getInstance() {
    const service = strapi.service(
      "plugin::futurebrand-strapi-helpers.global"
    ) as GlobalService;
    return service;
  }
}

export default GlobalService;
