import { roughSizeOfObject } from "../object";

class MemoryCache<T = any> {
  private current: T | null;
  public expires: number | null;
  public length: number;
  public usages: number;

  constructor(public revalidate: number | false) {
    this.current = null;
    this.expires = null;
    this.length = 0;
    this.usages = 0;
  }

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
    this.current = null;
    this.expires = null;
    this.length = 0;
  }

  public set(data: T) {
    if (this.revalidate === 0) {
      return;
    }

    this.current = data;
    this.length = roughSizeOfObject(this.current);
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

  public get data() {
    this.usages += 1;

    if (!this.current) {
      return null;
    }

    if (this.isExpired()) {
      this.invalidate();
      return null;
    }

    return this.current;
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
      return this.setValueFromResult(data as T);
    }

    if (this.isExpired()) {
      this.syncRevalidate(callback);
    }

    return this.data;
  }
}

export default MemoryCache;
