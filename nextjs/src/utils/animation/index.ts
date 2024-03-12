import { tv } from 'tailwind-variants'

const MAX_DELAY = 'delay-2000'

const ANIMATIONS_DELAY: Record<number, string> = {
  0: 'delay-0',
  1: 'delay-200',
  2: 'delay-400',
  3: 'delay-600',
  4: 'delay-800',
  5: 'delay-1000',
  6: 'delay-1200',
  7: 'delay-1400',
  8: 'delay-1600',
  9: 'delay-1800',
  10: MAX_DELAY,
}

/**
 * Example usage:
 * import { animate } from '~/utils/animation'
 *
 * const MyComponent: React.FC = () => {
 *  return (
 *  <>
 *    <div className={animate({className: 'text-2xl', index: 1})}>
 *      My animated content 1
 *    </div>
 *    <div className={animate({className: 'text-3xl', index: { initial: 2, md: 3 } })}>
 *      My animated content 2
 *    </div>
 *    <div className={animate({className: 'text-4xl', index: { initial: 3, md: 2 } })}>
 *      My animated content 3
 *    </div>
 *  </>
 * )
 */

export const animate = tv(
  {
    base: 'animation-content',
    variants: {
      index: ANIMATIONS_DELAY,
      onlyOpacity: {
        true: 'opacity-only',
      },
    },
    defaultVariants: {
      delay: 0,
      onlyOpacity: false,
    },
  },
  {
    responsiveVariants: true,
  }
)
