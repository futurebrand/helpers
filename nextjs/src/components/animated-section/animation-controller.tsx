'use client'

import { useIntersectObserver } from '@futurebrand/hooks'
import React from 'react'
import { tv } from 'tailwind-variants'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  Tag: React.ElementType
  lcp?: boolean
}

const animationClass = tv({
  variants: {
    animated: {
      true: 'animation-visible',
    },
    lcp: {
      true: 'animation-keyframes',
    },
  },
})

const AnimationController: React.FC<Props> = ({
  children,
  className,
  Tag,
  lcp,
  ...rest
}) => {
  const [isVisible, intersectReference] = useIntersectObserver()

  return (
    <Tag
      ref={intersectReference}
      className={animationClass({ className, animated: isVisible || lcp, lcp })}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default AnimationController
