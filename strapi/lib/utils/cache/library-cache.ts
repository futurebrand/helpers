import { getPluginConfigs } from "@futurebrand/configs/plugin/plugin";
import { LibraryList } from "../library";
import MemoryCache from "./memory-cache";

interface ICacheData<T> {
  cache: MemoryCache<T>;
  expires: number;
}

const __cacheLibrary = new Map<string, ICacheData<any>>();

class LibraryCache<T = any> {
  public maxDuration: number;
  public revalidate: number | false;
  private lengthLimit = 0;

  constructor(public key: string, revalidate?: number | false) {
    const configs = getPluginConfigs();
    this.revalidate = revalidate || (configs.cacheRevalidate ?? 60);
    this.lengthLimit = configs.cacheMaxMemory;
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

    __cacheLibrary.set(key, record);
    return cache;
  }

  public invalidate() {
    __cacheLibrary.forEach(async (record, key) => {
      if (key.startsWith(this.key)) {
        record.cache.invalidate();
      }
    });
  }

  public invalidateKey(key: string) {
    const record = __cacheLibrary.get(key);
    if (record) {
      record.cache?.invalidate();
    }
  }

  public invalidateExpiredCaches() {
    let totalLength = 0;

    __cacheLibrary.forEach((record) => {
      if (record.expires < Date.now() || !record.cache.data) {
        record.cache.invalidate();
      } else {
        totalLength += record.cache.length;
      }
    });

    if (totalLength >= this.lengthLimit) {
      const sorted = Array.from(__cacheLibrary.values()).sort((a, b) => {
        if (a.cache.usages === b.cache.usages) {
          return a.expires - b.expires;
        }
        return a.cache.usages - b.cache.usages;
      });

      for (const record of sorted) {
        if (totalLength < this.lengthLimit) {
          break;
        }

        if (!record.cache.data) {
          continue;
        }

        totalLength -= record.cache.length;
        record.cache.invalidate();
      }
    }
  }
}

export default LibraryCache;
