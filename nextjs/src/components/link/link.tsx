import NextLink, { type LinkProps } from 'next/link'
import React, { PropsWithChildren } from 'react'

export type LinkPropeties = {
  blank?: boolean
} & LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

const Link: React.FC<PropsWithChildren<LinkPropeties>> = ({ children, blank, ...props }) => {
  return (
    <NextLink {...(props as LinkPropeties)} target={blank ? '_blank' : ''}>
      {children}
    </NextLink>
  )
}

export default Link
