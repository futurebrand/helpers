import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface AccordionButtonProps
  extends React.HTMLProps<HTMLButtonElement> {}

const AccordionButton: React.FC<AccordionButtonProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      type="button"
      className={twMerge(['accordion-button', className])}
    >
      {children}
    </button>
  )
}

export default AccordionButton
