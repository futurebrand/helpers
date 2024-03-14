import { getCMSMediaUrl } from '@futurebrand/utils/media'
import Image, { type ImageProps } from 'next/image'
import React from 'react'

import type { IStrapiMedia, IStrapiMediaAttributes } from '@futurebrand/types/strapi'

type Properties = {
  image?: IStrapiMedia | IStrapiMediaAttributes
  responsive?: boolean
} & Partial<ImageProps>

const StrapiImage: React.FC<Properties> = ({
  image,
  responsive = true,
  sizes,
  priority,
  ...rest
}) => {
  const attributes = ((image as IStrapiMedia)?.data?.attributes || image) as IStrapiMediaAttributes

  if (!attributes) {
    return
  }

  const { url, width, height, mime, alternativeText } = attributes

  const placeholder = attributes.placeholder
  if (mime === 'image/svg+xml') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getCMSMediaUrl(url)}
        width={width}
        height={height}
        alt={alternativeText || 'Image without alt'}
        {...(rest as any)}
      />
    )
  }

  return (
    <Image
      src={getCMSMediaUrl(url)}
      width={width}
      height={height}
      alt={alternativeText || 'Image without alt'}
      placeholder={placeholder && !priority ? placeholder : 'empty'}
      sizes={sizes ?? (responsive ? '100vw' : undefined)}
      priority={priority}
      quality={85}
      {...rest}
    />
  )
}

export default StrapiImage
