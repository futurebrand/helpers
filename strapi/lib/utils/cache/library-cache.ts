import { getPluginConfigs } from "@futurebrand/configs/plugin/plugin";
import { LibraryList } from "../library";
import MemoryCache from "./memory-cache";

interface ICacheData<T> {
  cache: MemoryCache<T>;
  expires: number;
}

const __cacheLibrary = new LibraryList<string, ICacheData<any>>();

class LibraryCache<T = any> {
  public maxDuration: number;
  public revalidate: number | false;

  constructor(public key: string, revalidate?: number | false) {
    const configs = getPluginConfigs();
    this.revalidate = revalidate || (configs.cacheRevalidate ?? 60);
    this.maxDuration = configs.cacheMaxDuration;
  }

  public fromObject(data: Record<string, any>, revalidate?: number | false) {
    const key = Object.keys(data).reduce((acc, field) => {
      return `${acc}_${field}=${JSON.stringify(data[field])}`;
    }, this.key);
    return this.getCache(key, revalidate);
  }

  public fromKey(key: string, revalidate?: number | false) {
    const cacheKey = `${this.key}_${key}`;
    return this.getCache(cacheKey, revalidate);
  }

  private getCache(key: string, revalidate?: number | false): MemoryCache<T> {
    this.invalidateExpiredCaches();

    let record = __cacheLibrary.get(key);
    if (record) {
      return record.cache;
    }

    const cache = new MemoryCache(revalidate ?? this.revalidate);
    record = {
      cache,
      expires: Date.now() + this.maxDuration,
    };

    __cacheLibrary.push(key, record);
    return cache;
  }

  public invalidate() {
    __cacheLibrary.map(async (cacheKey) => {
      if (cacheKey.startsWith(this.key)) {
        __cacheLibrary.remove(cacheKey);
      }
    });
  }

  public invalidateKey(key: string) {
    __cacheLibrary.remove(key);
  }

  public invalidateExpiredCaches() {
    __cacheLibrary.map((key, record) => {
      if (!record) {
        return;
      }

      if (record.expires < Date.now() || !record.cache.data) {
        __cacheLibrary.remove(key);
      }
    });
  }
}

export default LibraryCache;
