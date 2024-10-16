'use client'

import { useIsPreview } from '@futurebrand/contexts/preview/preview'
import { useIsDefaultLocale } from '@futurebrand/hooks'
import NextLink, { type LinkProps } from 'next/link'
import React, { type PropsWithChildren, useMemo } from 'react'

export type LinkPropeties = {
  blank?: boolean
  name: string
} & LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

const Link: React.FC<PropsWithChildren<LinkPropeties>> = ({
  children,
  name,
  className,
  blank,
  href,
  ...props
}) => {
  const isPreview = useIsPreview()
  const isDefaultLocale = useIsDefaultLocale()

  const url = useMemo(() => {
    if (!href) {
      return '/'
    }

    if (isPreview && href.startsWith('/')) {
      if (isDefaultLocale) {
        return `/preview${href}`
      }

      const locale = href.split('/')[1]
      const path = href.split('/').slice(2).join('/')
      return `/${locale}/preview/${path}`
    }

    return href
  }, [isPreview, isDefaultLocale])

  return (
    <NextLink
      {...(props as LinkPropeties)}
      {...(blank ? { target: '_blank' } : {})}
      {...(isPreview ? { prefetch: false } : {})}
      className={`${name}${className ? ` ${className}` : ''}`}
      href={url}
    >
      {children}
    </NextLink>
  )
}

export default Link
