
class MemoryCache<T = any> {
  public data: T | null
  public expires: number | null

  constructor (public revalidate: number | false) {}

  public isExpired() {
    return this.revalidate === 0 || !this.expires || this.expires < Date.now()
  }

  public invalidate() {
    this.data = null
    this.expires = null
  }

  public set (data: T) {
    if (this.revalidate === 0) {
      return
    }

    this.data = data
    if (this.revalidate !== false) {
      this.expires = Date.now() + this.revalidate
    }
  }

  private dynamicUpdate (callback: () => Promise<T>) {
    callback()
      .then(data => this.set(data))
      .catch(() => this.invalidate())
  }

  public getValue () {
    if (!this.data) {
      return null
    }

    if (this.isExpired()) {
      this.invalidate()
      return null
    }
    
    return this.data
  }

  public async staleWhileRevalidate (callback: () => Promise<T>) {
    if (this.revalidate === 0) {
      return await callback()
    }

    if (!this.data) {
      const data = await callback()
      this.set(data)
      return data
    }

    if (this.isExpired() && this.revalidate !== false) {
      this.dynamicUpdate(callback)
    }

    return this.data  
  }
}

export default MemoryCache