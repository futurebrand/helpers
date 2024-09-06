'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AccordionContainerProps
  extends React.HTMLProps<HTMLDivElement> {
  isOpen?: boolean
}

const AccordionContainer: React.FC<AccordionContainerProps> = ({
  children,
  className,
  isOpen,
  ...rest
}) => {
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [internOpened, setInternOpened] = useState(isOpen ?? false)

  const contentReference = useRef<HTMLDivElement>(null)

  const isAccordionOpened = useMemo(
    () => (isOpen != null ? isOpen : internOpened),
    [isOpen, internOpened]
  )

  useEffect(() => {
    const content = contentReference.current

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

    const content = contentReference.current

    if (!content) return

    const button =
      content.querySelector('.accordion-button') ??
      content.querySelector('button')
    if (!button) return

    const onClickButton = () => {
      setInternOpened((current) => !current)
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
      {...rest}
      className={twMerge([
        'accordion',
        className,
        isAccordionOpened ? 'open' : '',
      ])}
      style={
        {
          '--accordion-height': `${contentHeight}px`,
          ...(rest.style ?? {}),
        } as any
      }
    >
      {children}
    </div>
  )
}

export default AccordionContainer
