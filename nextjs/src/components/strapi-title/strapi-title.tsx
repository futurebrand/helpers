import { type IStrapiTitle } from '@futurebrand/types/strapi'
import React, { type HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLBaseElement> {
  component: IStrapiTitle
}

const Title: React.FC<Props> = ({ component, className, ...rest }) => {
  if (!component) return

  const CustomTag = component.htmlTag as unknown as React.ElementType

  return (
    <CustomTag className={`cms-title ${className}`} {...rest}>
      {component.text}
    </CustomTag>
  )
}

export default Title
