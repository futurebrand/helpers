import { LibraryList } from "../library"
import MemoryCache from "./memory-cache"

class LibraryCache<T = any> {
  private library: LibraryList<string, MemoryCache<T>>
  public expires: number

  constructor (private revalidate: number, private disabled: boolean = false) {
    this.library = new LibraryList()
    this.expires = Date.now() + revalidate

    if (process.env.NODE_ENV === 'development') {
      this.disabled = true
    }
  }

  public fromObject (data: Record<string, any>) : MemoryCache<T> | null {
    const key = Object.keys(data).reduce((acc, field) => {
      return `${acc}_${field}=${JSON.stringify(data[field])}`
    }, '')
    return this.get(key)
  }

  public isExpired() {
    return !this.expires || this.expires < Date.now()
  }

  public get (key: string) : MemoryCache<T> | null {
    if (this.disabled) {
      return null
    }    

    if (this.isExpired()) {
      this.invalidate()
      this.expires = Date.now() + this.revalidate
    }
    
    let cache = this.library.get(key)
    if (cache) {
      return cache
    }

    cache = new MemoryCache(this.revalidate)

    this.library.push(key, cache)

    return cache
  }

  public invalidate () : void {
    this.library.map((key, cache) => {
      cache?.invalidate()
    })
  }
}

export default LibraryCache