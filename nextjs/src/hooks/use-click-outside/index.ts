import { useEffect, useRef } from 'react'

// How to use
// import useOutsideClick from '~/helpers/use-click-outside'
// const reference = useOutsideClick(() => { // do something })
// <div ref={reference}>...</div>

export function useOutsideClick<T = HTMLElement>(callback: () => void) {
  const reference = useRef<HTMLElement>()

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as Node)
      ) {
        callback()
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [reference, callback]) // eslint-disable-line react-hooks/exhaustive-deps

  return reference as React.MutableRefObject<T>
}
