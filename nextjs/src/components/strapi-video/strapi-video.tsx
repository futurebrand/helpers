'use client'

import type {
  IStrapiMedia,
  IStrapiMediaAttributes,
} from '@futurebrand/types/strapi'
import React, { useEffect, useState } from 'react'

import { getCMSMediaUrl } from '@futurebrand/utils'
import { useIntersectObserver } from '@futurebrand/hooks/use-intersect-observer'

type Properties = {
  video: IStrapiMedia | IStrapiMediaAttributes
} & React.VideoHTMLAttributes<HTMLVideoElement>

const CmsVideo: React.FC<Properties> = ({ video, autoPlay, ...rest }) => {
  const attributes = 'url' in video ? video : (video as any).data?.attributes as IStrapiMediaAttributes

  const [isVisible, videoReference] = useIntersectObserver()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isVisible) {
      if (!isLoaded) {
        videoReference.current?.load()
        setIsLoaded(true)
      }
      if (autoPlay) {
        videoReference.current?.play()
      } else {
        videoReference.current?.pause()
      }
    }
  }, [autoPlay, isLoaded, isVisible, videoReference])

  if (!attributes) {
    return
  }

  return (
    <video
      ref={videoReference}
      autoPlay={autoPlay}
      preload="none"
      controlsList="nodownload"
      {...rest}
    >
      <source src={getCMSMediaUrl(attributes.url)} type={attributes.mime} />
    </video>
  )
}

export default CmsVideo
