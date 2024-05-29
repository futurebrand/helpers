/* eslint-disable @next/next/no-img-element */
import { IResponsiveImage } from '@futurebrand/types/strapi'
import { type ImageProps } from 'next/image'
import React from 'react'
import ReactDOM from 'react-dom'

import { getResponsiveImageProps } from '@futurebrand/utils'

type Properties = {
  components: IResponsiveImage
} & Partial<ImageProps>

const CmsImageResponsive: React.FC<Properties> = ({
  components,
  className,
  priority,
  loading,
  alt,
  ...rest
}) => {
  const { desktop, mobile } = getResponsiveImageProps(components, rest)

  if (priority) {
    ReactDOM.preload(String(mobile.src), {
      as: 'image',
      imageSrcSet: mobile.srcSet,
      imageSizes: mobile.sizes,
    })
  }

  return (
    <picture>
      <source
        media="(min-width: 768px)"
        sizes={desktop.sizes}
        srcSet={desktop.srcSet}
        width={desktop.width}
        height={desktop.height}
      />
      <img
        {...mobile}
        alt={mobile.alt ?? desktop.alt ?? 'Image without alt'}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        className={className}
      />
    </picture>
  )
}

export default CmsImageResponsive
