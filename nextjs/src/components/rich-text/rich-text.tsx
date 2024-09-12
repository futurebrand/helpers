import type { HTMLString } from '@futurebrand/types/strapi'
import React from 'react'

import { parseHtml } from './parser'

type Properties = {
  html: HTMLString
} & React.BaseHTMLAttributes<HTMLDivElement>

const RichText: React.FC<Properties> = ({
  html = '',
  className = '',
  ...rest
}) => {
  return (
    <div className={`cms-rich-text ${className}`} {...rest}>
      {parseHtml(html)}
    </div>
  )
}

export default RichText
