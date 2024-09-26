import { GlobalClient } from "@futurebrand/modules";

class GlobalService {
  client: GlobalClient | null;

  constructor() {
    this.client = null;
  }

  async register(newClient) {
    this.client = newClient;
    await this.client.register();
  }

  getClient() {
    return this.client;
  }

  async data(locale) {
    if (!this.client) {
      throw new Error("Global client not initialized");
    }
    return this.client.getData(locale);
  }

  async seo(locale) {
    if (!this.client) {
      throw new Error("Global client not initialized");
    }
    return this.client.getSeoData(locale);
  }

  async locales() {
    if (!this.client) {
      throw new Error("Global client not initialized");
    }
    return this.client.getLocales();
  }
}

export default GlobalService;
