import Anchor from '@futurebrand/components/anchor'
import { slugify } from '@futurebrand/utils'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import AnimatedController from './animation-controller'

interface Props extends React.HTMLProps<HTMLDivElement> {
  name: string
  anchor?: string
  Tag?: React.ElementType
  firstElement?: boolean
  spacing?: 'none' | 'margin' | 'padding'
  distance?: 'small' | 'medium' | 'large'
  relative?: boolean
}

const blockClass = tv({
  base: 'section z-10 w-full',
  variants: {
    spacing: {
      none: 'no-spacing',
      margin: 'with-margin',
      padding: 'with-padding',
    },
    distance: {
      small: 'small-distance',
      medium: 'medium-distance',
      large: 'large-distance',
    },
    relative: {
      true: 'relative',
      false: '',
    },
  },
  defaultVariants: {
    spacing: 'margin',
    distance: 'medium',
    relative: true,
  },
})

const AnimatedSection: React.FC<Props> = ({
  name,
  className,
  anchor,
  children,
  Tag = 'section',
  spacing,
  distance,
  relative,
  firstElement,
  ...rest
}) => {
  const id = anchor ? slugify(anchor) : ''

  if (firstElement) {
    return (
      <Tag
        className={twMerge(
          name,
          className,
          'animation-container animation-visible animation-keyframes',
          blockClass({
            spacing,
            distance,
            relative,
          })
        )}
        {...(id ? { id } : {})}
        {...rest}
      >
        {id && <Anchor id={id} />}
        {children}
      </Tag>
    )
  }

  return (
    <AnimatedController
      className={twMerge(
        name,
        className,
        'animation-container',
        blockClass({
          spacing,
          distance,
          relative,
        })
      )}
      Tag={Tag}
      lcp={firstElement}
      {...(id ? { id } : {})}
      {...rest}
    >
      {id && <Anchor id={id} />}
      {children}
    </AnimatedController>
  )
}

export default AnimatedSection
