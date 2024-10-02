'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AccordionContainerProps
  extends React.HTMLProps<HTMLDivElement> {
  isOpen?: boolean
  transitionScale?: number
}
const TRANSITION_SCALE = 0.75

const AccordionContainer: React.FC<AccordionContainerProps> = ({
  children,
  className,
  isOpen,
  transitionScale = TRANSITION_SCALE,
  ...rest
}) => {
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [internOpened, setInternOpened] = useState(isOpen ?? false)

  const containerReference = useRef<HTMLDivElement>(null)

  const transitionDuration = useMemo(() => {
    return Math.max(300, Math.min(1000, contentHeight * transitionScale))
  }, [contentHeight, transitionScale])

  const isAccordionOpened = useMemo(
    () => (isOpen != null ? isOpen : internOpened),
    [isOpen, internOpened]
  )

  useEffect(() => {
    const container = containerReference.current

    if (!container) return

    const content = container.querySelector('.accordion-content')
    if (!content) return

    setContentHeight(content.scrollHeight)
    const mutationObserver = new MutationObserver(function () {
      setContentHeight(content.scrollHeight)
    })

    mutationObserver.observe(content, {
      childList: true,
      subtree: true,
    })

    return () => {
      mutationObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (isOpen != null) {
      return
    }

    const container = containerReference.current

    if (!container) return

    const button =
      container.querySelector('.accordion-button') ??
      container.querySelector('button')

    if (!button) return

    const onClickButton = () => {
      setInternOpened((current) => !current)
      console.log('click')
    }

    button.addEventListener('click', onClickButton)

    return () => {
      button.removeEventListener('click', onClickButton)
    }
  }, [])

  useEffect(() => {
    if (isOpen != null) {
      setInternOpened(isOpen)
    }
  }, [isOpen])

  return (
    <div
      ref={containerReference}
      className={twMerge([
        'accordion',
        className,
        isAccordionOpened ? 'open' : '',
      ])}
      style={
        {
          '--accordion-height': isAccordionOpened ? `${contentHeight}px` : 0,
          '--accordion-duration': `${transitionDuration}ms`,
          ...(rest.style ?? {}),
        } as any
      }
      {...rest}
    >
      {children}
    </div>
  )
}

export default AccordionContainer
