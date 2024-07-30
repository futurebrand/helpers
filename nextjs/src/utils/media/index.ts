import { IResponsiveImage, IStrapiMedia, IStrapiMediaAttributes } from "@futurebrand/types/strapi"
import { ImageProps, getImageProps } from "next/image"

const cmsType = process.env.cmsType || 'strapi'

export const getCMSMediaUrl = (path: string) => {
  if (cmsType === 'strapi' && path && path.startsWith('/')) {
    return `${process.env.cmsUrl}${path}`
  }
  return path
}

export function getResponsiveSrcSet(srcString: string, isMobile: boolean) {
  const getSetSize = (src: string) => {
    const [, size] = src.split(' ')
    const [width] = size.split('w')
    return Number(width)
  }

  if (!srcString) return ''

  const srcSet = srcString.split(', ').filter((src) => {
    if (isMobile) {
      return getSetSize(src) <= 768
    } else {
      return getSetSize(src) > 768
    }
  })

  return srcSet.join(', ')
}

const DEAFULT_IMAGE_PROPS = {
  alt: '',
  sizes: '100vw',
  quality: 85,
  priority: false,
}

function getCMSImageProps(
  media: IStrapiMedia | IStrapiMediaAttributes,
  imageProps: Partial<ImageProps> = {},
  isMobile: boolean
) {
  const attributes = 'url' in media ? media : (media as any).data?.attributes as IStrapiMediaAttributes
  const placeholder = attributes.mime !== 'image/png' ? attributes.placeholder : 'empty'

  const imageSize = imageProps.fill ? {
    fill: true
  } : {
    width: attributes.width,
    height: attributes.height
  }

  const { props } = getImageProps({
    ...DEAFULT_IMAGE_PROPS,
    ...imageProps,
    ...imageSize,
    src: getCMSMediaUrl(attributes.url),
    placeholder: placeholder && !imageProps.priority ? placeholder : 'empty',
  })

  return {
    ...props,
    alt: attributes.alternativeText,
    srcSet: getResponsiveSrcSet(String(props.srcSet), isMobile),
  }
}

export function getResponsiveImageProps(
  { desktop, mobile }: IResponsiveImage,
  props: Partial<ImageProps> = {}
): {
  desktop: JSX.IntrinsicElements['img']
  mobile: JSX.IntrinsicElements['img']
} {
  const desktopProps = getCMSImageProps(desktop, props, false)
  const mobileProps = getCMSImageProps(mobile, props, true)

  return {
    desktop: desktopProps,
    mobile: mobileProps,
  }
}