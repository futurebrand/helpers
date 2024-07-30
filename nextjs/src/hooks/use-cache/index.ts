
import { unstable_cache as cache } from 'next/cache';

interface ICacheConfigs {
  tags?: string[]
  revalidate?: number | false
}

const fetchRevalidate = process.env.fetchRevalidate
const revalidate = fetchRevalidate ? Number(fetchRevalidate) : 60

export async function useCache<T> (key: string, cb: () => Promise<T>, configs: ICacheConfigs = {}) : Promise<T> {
  const CachedFunction = cache(cb, [key], {
    revalidate: configs.revalidate ?? revalidate,
    tags: configs.tags ?? [key]
  })

  return await CachedFunction()
}
