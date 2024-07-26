"use server";

import { GlobalDataService } from "@futurebrand/services";
import { IGlobalData } from "@futurebrand/types/global-options";
import { createCacheContext } from "@futurebrand/utils";

type GlobalDataCache = Record<string, IGlobalData>;

const [getGlobalDataCache, setGlobalDataCache] =
  createCacheContext<GlobalDataCache>({});

export async function getGlobalData(locale: string): Promise<IGlobalData> {
  const cache = getGlobalDataCache();
  if (cache[locale]) {
    return cache[locale];
  }

  const service = new GlobalDataService();
  const data = await service.get(locale);

  cache[locale] = data;
  setGlobalDataCache(cache);

  return data;
}
