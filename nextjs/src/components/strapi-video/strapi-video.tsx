'use client'

import { useIntersectObserver } from '@futurebrand/hooks/use-intersect-observer'
import type {
  IStrapiMedia,
  IStrapiMediaAttributes,
} from '@futurebrand/types/strapi'
import { getCMSMediaUrl } from '@futurebrand/utils'
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

type Properties = {
  video: IStrapiMedia | IStrapiMediaAttributes
} & React.VideoHTMLAttributes<HTMLVideoElement>

interface IVideoRef {
  isLoaded: boolean
  play: () => void
  pause: () => void
  element?: HTMLVideoElement
}

const CmsVideo: React.ForwardRefRenderFunction<IVideoRef, Properties> = (
  { video, autoPlay, ...rest },
  ref
) => {
  if (!video) {
    return null
  }

  const attributes =
    'url' in video
      ? video
      : ((video as any).data?.attributes as IStrapiMediaAttributes)

  const [isVisible, videoReference] = useIntersectObserver()
  const [isLoaded, setIsLoaded] = useState(false)

  const playVideo = useCallback(() => {
    videoReference.current?.play()
  }, [videoReference])

  const pauseVideo = useCallback(() => {
    videoReference.current?.pause()
  }, [videoReference])

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

  useImperativeHandle(ref, () => ({
    isLoaded,
    element: videoReference.current,
    play: playVideo,
    pause: pauseVideo,
  }))

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

export default React.forwardRef(CmsVideo)
