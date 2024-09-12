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
  autoLoad?: boolean
  priority?: boolean
  video: IStrapiMedia | IStrapiMediaAttributes
} & React.VideoHTMLAttributes<HTMLVideoElement>

interface IVideoRef {
  isLoaded: boolean
  play: () => void
  pause: () => void
  element?: HTMLVideoElement
}

const CmsVideo: React.ForwardRefRenderFunction<IVideoRef, Properties> = (
  { video, autoPlay, autoLoad = true, priority, ...rest },
  ref
) => {
  if (!video) {
    return null
  }

  const attributes =
    'url' in video
      ? video
      : ((video as any).data?.attributes as IStrapiMediaAttributes)

  const [isVisible, videoReference] = useIntersectObserver<HTMLVideoElement>()
  const [isLoaded, setIsLoaded] = useState(false)

  const playVideo = useCallback(async () => {
    if (!videoReference.current) {
      return
    }
    try {
      await videoReference.current?.play()
    } catch (error) {
      if (!(error instanceof DOMException)) {
        console.error('Error playing video:', error.message)
      }
    }
  }, [])

  const pauseVideo = useCallback(() => {
    videoReference.current?.pause()
  }, [])

  useEffect(() => {
    try {
      const video = videoReference.current
      if (!video) return

      const canPlay = isLoaded || video.canPlayType(attributes.mime)

      if (priority || !canPlay || !isVisible) {
        return
      }

      if (autoPlay) {
        void video.play()
      } else {
        video.pause()
      }
    } catch (error) {
      if (!(error instanceof DOMException)) {
        console.error('Error playing video:', error.message)
      }
    }
  }, [autoPlay, priority, isLoaded, isVisible, attributes.mime])

  useEffect(() => {
    return () => {
      setIsLoaded(false)
    }
  }, [])

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
      controlsList="nodownload"
      playsInline
      onCanPlay={() => {
        setIsLoaded(true)
      }}
      {...rest}
      {...(priority
        ? { autoPlay: true, muted: true }
        : { preload: isVisible ? 'auto' : 'none' })}
    >
      <source src={getCMSMediaUrl(attributes.url)} type={attributes.mime} />
    </video>
  )
}

export default React.forwardRef(CmsVideo)
