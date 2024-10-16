type SyncCallback = () => Promise<void>;

class SyncService {
  private callbacks: Map<string, SyncCallback>;

  constructor() {
    this.callbacks = new Map();
  }

  public register(key: string, callback: SyncCallback) {
    this.callbacks.set(key, callback);
  }

  public async run() {
    for (const [key, callback] of this.callbacks) {
      await callback();
    }
  }

  public static getInstance() {
    const service = strapi.service(
      "plugin::futurebrand-strapi-helpers.sync"
    ) as SyncService;
    return service;
  }
}

export default SyncService;
