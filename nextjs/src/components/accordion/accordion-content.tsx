import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface AccordionContentProps
  extends React.BaseHTMLAttributes<HTMLDivElement> {}

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={twMerge([
        'accordion-content overflow-hidden transition-all ease-in-out',
        className,
      ])}
      style={{
        maxHeight: 'var(--accordion-height)',
        transitionDuration: 'var(--accordion-duration)',
        ...(rest.style ?? {}),
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default AccordionContent
