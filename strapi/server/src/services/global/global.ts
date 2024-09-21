import { GlobalClient } from "../../../../lib/modules";
import type { IGlobalService } from "@futurebrand/types/contents";

const globalService = (): IGlobalService => {
  let client: GlobalClient | null = null;

  const register = async (newClient: GlobalClient) => {
    client = newClient;
    await client.register();
  };

  const getClient = () => {
    return client;
  };

  const data = async (locale: string) => {
    if (!client) {
      throw new Error("Global client not initialized");
    }
    return client.getData(locale);
  };

  const seo = async (locale: string) => {
    if (!client) {
      throw new Error("Global client not initialized");
    }
    return client.getSeoData(locale);
  };

  const locales = async () => {
    if (!client) {
      throw new Error("Global client not initialized");
    }
    return client.getLocales();
  };

  return {
    data,
    seo,
    locales,
    getClient,
    register,
  };
};

export default globalService;
