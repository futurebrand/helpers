import type { HTMLString } from '@futurebrand/types/strapi'
import React from 'react'

type Properties = {
  html: HTMLString
} & React.BaseHTMLAttributes<HTMLDivElement>

const RichText: React.FC<Properties> = ({
  html = '',
  className = '',
  ...rest
}) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={`cms-rich-text ${className}`}
      {...rest}
    />
  )
}

export default RichText
