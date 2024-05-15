
class MemoryCache<T = any> {
  public data: T | null
  public revalidate: number
  public expires: number | null

  constructor (revalidate: number) {
    this.revalidate = revalidate
  }

  public isExpired() {
    return !this.expires || this.expires < Date.now()
  }

  public invalidate() {
    if (this.isExpired) {
      this.data = null
      this.expires = null
    }
  }

  public set (data: T) {
    this.data = data
    this.expires = Date.now() + this.revalidate
  }

  public get() {
    if (!this.data) {
      return null
    }

    if (this.isExpired()) {
      return null
    }
    
    return this.data
  }
}

export default MemoryCache