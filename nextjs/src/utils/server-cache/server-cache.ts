let cache = global.__helpersCache

if (!cache || !cache.current) {
  cache = global.__helpersCache = {
    current: {}
  };
}

function cacheFunction<T extends (...args: any[]) => Promise<any>>(key: string, cb: T) {
  return (async (...args) => {
    if (cache.current[key]) {
      return cache.current[key]
    }
    const cbResponse = await cb(...args)
    cache.current[key] = cbResponse
    return cbResponse
  }) as T
}

export default cacheFunction;