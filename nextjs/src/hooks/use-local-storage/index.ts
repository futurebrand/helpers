import { useCallback, useEffect, useState } from 'react'

interface ISavedValue<T> {
  current: T
}

export function useLocalStorage<T, U = null>(
  key: string,
  initialValue: T,
  unloadedValue?: U
): [T | U, (value: T) => boolean] {
  const [state, setState] = useState<T | U>(
    unloadedValue === undefined ? initialValue : unloadedValue
  )

  useEffect(() => {
    const storedValue = localStorage.getItem(key)
    if (storedValue) {
      const savedState = (JSON.parse(storedValue) as ISavedValue<T>)?.current
      if (savedState) setState(savedState)
    } else {
      setState(initialValue)
    }
  }, [key])

  const setValue = useCallback(
    (value: T) => {
      try {
        setState(value)
        const savedData: ISavedValue<T> = {
          current: value,
        }
        localStorage.setItem(key, JSON.stringify(savedData))
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    [key]
  )

  return [state, setValue]
}