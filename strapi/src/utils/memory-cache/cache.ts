class MemoryCache<T> {
  private values: Record<string, T>
  private readonly enabled: boolean

  constructor(enabled?: boolean) {
    this.values = {}
    this.enabled = enabled ?? process.env.NODE_ENV !== 'development'
  }

  public get(key: string): T | null {
    if (!this.enabled) return null
    try {
      return this.values[key] ?? null
    } catch (error) {
      return null
    }
  }

  public set(key: string, value: T) {
    this.values[key] = value
  }
}

export default MemoryCache
