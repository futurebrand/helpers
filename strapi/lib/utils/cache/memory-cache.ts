class MemoryCache<T = any> {
  public data: T | null;
  public expires: number | null;

  constructor(public revalidate: number | false) {}

  public isExpired() {
    if (process.env.NODE_ENV === "development") {
      return true;
    }
    if (this.revalidate === false) {
      return false;
    }
    return this.revalidate === 0 || !this.expires || this.expires < Date.now();
  }

  public invalidate() {
    this.data = null;
    this.expires = null;
  }

  public set(data: T) {
    if (this.revalidate === 0) {
      return;
    }

    this.data = data;
    if (this.revalidate !== false) {
      this.expires = Date.now() + this.revalidate;
    }
  }

  private setValueFromResult(callbackResult: T): T;
  private setValueFromResult(callbackResult: Promise<T>): Promise<T>;
  private setValueFromResult(callbackResult: T | Promise<T>): T | Promise<T> {
    if (callbackResult instanceof Promise) {
      return new Promise<T>(async (resolve) => {
        const data = await callbackResult;
        this.set(data);
        resolve(data);
      });
    }

    this.set(callbackResult);
    return callbackResult;
  }

  public getValue() {
    if (!this.data) {
      return null;
    }

    if (this.isExpired()) {
      this.invalidate();
      return null;
    }

    return this.data;
  }

  private syncRevalidate(callback: () => T | Promise<T>) {
    const result = callback();
    void this.setValueFromResult(result as any);
  }

  public memorize(callback: () => T): T;
  public memorize(callback: () => Promise<T>): Promise<T>;
  public memorize(callback: () => T | Promise<T>): T | Promise<T> {
    if (!this.data || this.isExpired()) {
      const data = callback();
      return this.setValueFromResult(data as any);
    }

    return this.data;
  }

  public staleWhileRevalidate(callback: () => Promise<T>): Promise<T>;
  public staleWhileRevalidate(callback: () => T): T;
  public staleWhileRevalidate(callback: () => T | Promise<T>): T | Promise<T> {
    if (this.revalidate === 0) {
      return callback();
    }

    if (!this.data) {
      const data = callback();
      return this.setValueFromResult(data as any);
    }

    if (this.isExpired()) {
      this.syncRevalidate(callback);
    }

    return this.data;
  }
}

export default MemoryCache;
