/* eslint-disable @typescript-eslint/unbound-method */
// const plugin = require("tailwindcss/plugin");

import plugin from 'tailwindcss/plugin'

interface IPluginOptions {
  variables?: {
    small?: string
    medium?: string
    large?: string
  }
}

const defaultOptions: IPluginOptions = {
  variables: {
    small: '--space-small',
    medium: '--space-medium',
    large: '--space-large',
  },
}

export default plugin.withOptions<Partial<IPluginOptions> | undefined>(
  function (userOptions = {}) {
    return function ({ addComponents, addBase, matchUtilities, theme }) {
      const options = {
        ...defaultOptions,
        ...userOptions,
        variables: { ...defaultOptions.variables, ...userOptions.variables },
      }

      addBase({
        ':root': {
          '--section-distance': '6rem',
        },
      })

      addComponents({
        '.section': {
          '&.small-distance': {
            '--section-distance': `var(${options.variables.small}, var(--section-distance))`,
          },
          '&.medium-distance': {
            '--section-distance': `var(${options.variables.medium}, var(--section-distance))`,
          },
          '&.large-distance': {
            '--section-distance': `var(${options.variables.large}, var(--section-distance))`,
          },
          '&.with-margin': {
            margin: 'var(--section-distance) 0',
          },
          '&.with-padding': {
            padding: 'var(--section-distance) 0',
          },
        },
      })
    }
  },
  function (userOptions = {}) {
    return {}
  }
)
