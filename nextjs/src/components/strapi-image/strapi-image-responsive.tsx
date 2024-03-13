import { type ImageProps } from 'next/image'
import React from 'react'
import { tv } from 'tailwind-variants'

import type { IResponsiveImage } from '@futurebrand/types/strapi'

import CmsImage from './strapi-image'

type Properties = {
  components: IResponsiveImage
  variants?: {
    mobile?: Partial<ImageProps>
    desktop?: Partial<ImageProps>
  }
} & Partial<ImageProps>

const CmsImageResponsive: React.FC<Properties> = ({
  components,
  variants,
  className,
  ...rest
}) => {
  const isSameImage =
    !variants &&
    components.desktop?.data?.attributes?.url ===
      components.mobile?.data?.attributes?.url

  if (isSameImage) {
    return (
      <CmsImage image={components.mobile} className={className} {...rest} />
    )
  }

  const classNames = tv({})

  return (
    <>
      <CmsImage
        image={components.mobile}
        {...rest}
        {...variants?.mobile}
        className={classNames({
          className: ['flex md:hidden', className, variants?.mobile?.className],
        })}
      />
      <CmsImage
        image={components.desktop}
        {...rest}
        {...variants?.desktop}
        className={classNames({
          className: [
            'hidden md:flex',
            className,
            variants?.desktop?.className,
          ],
        })}
      />
    </>
  )
}

export default CmsImageResponsive
