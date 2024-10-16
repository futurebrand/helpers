import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'

import { useLocalStorage } from '../use-local-storage'

type TransitionFunction<T> = () => Promise<T>

interface ITransitionState<T> {
  response: T | null
  mounted: boolean
}

interface IPersistentTransition<T> {
  data: T | null
  isLoading: boolean
  hasError: boolean
  startTransition: (transition: TransitionFunction<T>) => Promise<boolean>
  setValue: (value: T) => void
}

export function usePersistentTransition<T>(
  key: string,
  initialTransition: TransitionFunction<T>
): IPersistentTransition<T> {
  const [state, setState] = useLocalStorage<ITransitionState<T>>(
    key,
    { response: null, mounted: false },
    null
  )
  const [isPending, internalStartTransition] = useTransition()
  const [isMounted, setIsMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  const queue = useRef<Array<TransitionFunction<T>>>([])
  const isLoading = useMemo(
    () => isPending || !isMounted,
    [isPending, isMounted]
  )

  const startTransition = useCallback(
    async (transition: () => Promise<T>): Promise<boolean> => {
      return await new Promise((resolve) => {
        if (isPending && isMounted) {
          queue.current.push(transition)
          return
        }

        internalStartTransition(async () => {
          let haveError = false
          try {
            const response = await transition()
            setState({ response, mounted: true })
          } catch (error) {
            console.error(error)
            setHasError(true)
            haveError = true
          } finally {
            const lastQueue = queue.current.pop()
            if (lastQueue) {
              void startTransition(lastQueue)
            }
            resolve(!haveError)
          }
        })
      })
    },
    [isPending, internalStartTransition, queue, setState]
  )

  const setValue = useCallback(
    (value: T) => {
      setState({
        response: value,
        mounted: true,
      })
    },
    [setState]
  )

  useEffect(() => {
    if (isMounted || hasError || state == null) {
      return
    }

    if (!state.mounted) {
      void startTransition(initialTransition)
    }
    setIsMounted(true)
  }, [isMounted, hasError, state])

  return {
    data: state ? state.response : null,
    hasError,
    isLoading,
    startTransition,
    setValue,
  }
}
