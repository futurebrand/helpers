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

const SCROLL_OFFSET_SCALE = 0.3

export function smoothScrollTo(id: string, offsetScale = SCROLL_OFFSET_SCALE) {
  const element = document.getElementById(id)
  if (element) {
    const elementTop = element.getBoundingClientRect().top
    const scrollTop = window.scrollY
    const offset = window.innerHeight * offsetScale
    window.scrollTo({
      top: elementTop + scrollTop - offset,
      behavior: 'smooth',
    })
  }
}
