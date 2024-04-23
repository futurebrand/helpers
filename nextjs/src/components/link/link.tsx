import NextLink, { type LinkProps } from 'next/link'
import React, { PropsWithChildren } from 'react'

export type LinkPropeties = {
  blank?: boolean
  name: string
} & LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

const Link: React.FC<PropsWithChildren<LinkPropeties>> = ({ children, name, className, blank, ...props }) => {
  return (
    <NextLink 
      {...(props as LinkPropeties)} 
      {...(blank ? { target: '_blank' } : {})}
      className={`${name}${className ? ` ${className}` : ''}`}
    >
      {children}
    </NextLink>
  )
}

export default Link
