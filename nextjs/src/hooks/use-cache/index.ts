
import { cache } from 'react';

function cacheFunction<T> (initialValue: T) {
  return () => ({
    current: initialValue
  })
}

export function useCache<T> (initialValue: T) : [() => T, (newData: T) => void] {
  const ref = cache(cacheFunction<T>(initialValue))

  const getter = () => ref().current
  const setter = (newData: T) => {
    ref().current = newData
  }

  return [getter, setter]
}
