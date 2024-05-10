import { tv } from 'tailwind-variants'

const MAX_DELAY = 'delay-4000'

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
  10: 'delay-2000',
  11: 'delay-2200',
  12: 'delay-2400',
  13: 'delay-2600',
  14: 'delay-2800',
  15: 'delay-3000',
  16: 'delay-3200',
  17: 'delay-3400',
  18: 'delay-3600',
  19: 'delay-3800',
  20: MAX_DELAY,
  21: MAX_DELAY,
  22: MAX_DELAY,
  23: MAX_DELAY,
  24: MAX_DELAY,
  25: MAX_DELAY,
  26: MAX_DELAY,
  27: MAX_DELAY,
  28: MAX_DELAY,
  29: MAX_DELAY,
  30: MAX_DELAY,
}

/**
 * Example usage:
 * import { animate } from '@futurebrand/utils/animation'
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
