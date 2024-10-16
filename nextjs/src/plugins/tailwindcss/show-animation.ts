/* eslint-disable @typescript-eslint/unbound-method */
import plugin from 'tailwindcss/plugin'

interface IPluginOptions {
  distance: string
  duration: string
  timingFunction: string
}

const defaultOptions: IPluginOptions = {
  distance: '4rem',
  duration: '1000ms',
  timingFunction: 'cubic-bezier(0, 0, 0.4, 1)',
}

export default plugin.withOptions<Partial<IPluginOptions> | undefined>(
  function (userOptions = {}) {
    return ({ addComponents, addBase, matchUtilities, theme }) => {
      const options = { ...defaultOptions, ...userOptions }

      addBase({
        ':root': {
          '--show-animation-distance': options.distance,
          '--show-animation-duration': options.duration,
          '--show-animation-function': options.timingFunction,
          '--show-animation-transform': 'none',
          '--show-animation-opacity': '0',
        },
      })

      addComponents({
        '.animation-content': {
          opacity: 'var(--show-animation-opacity)',
          transform: `var(--show-animation-transform)`,
          transitionProperty: 'opacity, transform',
          transitionDuration: 'var(--show-animation-duration)',
          transitionTimingFunction: 'var(--show-animation-function)',
        },
        '.animation-container': {
          '--show-animation-opacity': '0',
          '--show-animation-transform': `translateY(var(--show-animation-distance))`,
          '&.animation-visible,.animation-visible': {
            '--show-animation-opacity': '1',
            '--show-animation-transform': 'none',
            '&.animation-keyframes,.animation-keyframes': {
              animation: `show-animation var(--show-animation-duration) var(--show-animation-function)`,
            },
          },
        },
        '.animation-keyframes': {
          '--show-animation-transform': 'none',
          '&.animation-content,.animation-content': {
            transition: 'none',
          },
        },
        '.opacity-only': {
          '--show-animation-transform': 'none',
          '.animation-content': {
            '--show-animation-transform': 'none',
          },
        },
      })

      matchUtilities(
        {
          delay: (value) => ({ animationDelay: value, transitionDelay: value }),
        },
        { values: theme('transitionDelay') }
      )
    }
  },
  function (userOptions = {}) {
    return {
      theme: {
        extend: {
          transitionDelay: {
            400: '400ms',
            600: '600ms',
            800: '800ms',
            1200: '1200ms',
            1400: '1400ms',
            1600: '1600ms',
            1800: '1800ms',
            2000: '2000ms',
            2200: '2200ms',
            2400: '2400ms',
            2600: '2600ms',
            2800: '2800ms',
            3000: '3000ms',
            3200: '3200ms',
            3400: '3400ms',
            3600: '3600ms',
            3800: '3800ms',
            4000: '4000ms',
          },
          keyframes: {
            'show-animation': {
              '0%': {
                opacity: '0',
                transform: `var(--show-animation-transform)`,
              },
              '100%': {
                opacity: '1',
                transform: 'translateY(0)',
              },
            },
          },
        },
      },
    }
  }
)
