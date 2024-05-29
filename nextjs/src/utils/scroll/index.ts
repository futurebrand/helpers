// eslint-disable-next-line no-unused-vars
type ScrollCallback = (scrollY: number) => void

/**
 * Example usage:
 * import { onScroll } from '@futurebrand/utils/scroll'
 * useEffect(() => {
 *   return onScroll((scrollPosition) => doSomething(scrollPosition))
 * }, [])
 */

export const onScroll = (callback: ScrollCallback) => {
  const updatePosition = () => {
    const scrollY =
      typeof window.scrollY === 'undefined'
        ? window.pageYOffset
        : window.scrollY
    callback(scrollY)
  }
  updatePosition()
  window.addEventListener('scroll', updatePosition)
  return () => {
    window.removeEventListener('scroll', updatePosition)
  }
}
