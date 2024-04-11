
class LibraryList<K extends string, T = any> {
  data: Partial<Record<K, T>>
  length: number

  constructor(initialData?: Record<K, T>) {
    this.data = initialData || {}
    this.length = 0
  }

  public push(key: K, value: T) {
    this.data[key] = value
    this.length++

    return this.data[key]
  }

  public get(key: K) {
    return this.data[key]
  }

  public has(key: K) {
    return !!this.data[key]
  }

  public remove(key: K) {
    if (this.data[key]) {
      delete this.data[key]
      this.length--
    }
  }

  public isEmpty() {
    return this.length === 0
  }

  public keys() {
    return Object.keys(this.data)
  }

  public values() {
    return Object.values(this.data)
  }

  public entries() {
    return Object.entries(this.data)
  }

  public async map(callback: (key: K, value: T) => Promise<void> | void) {
    for (const key in this.data) {
      await callback(key, this.data[key])
    }
  }
}

export default LibraryList