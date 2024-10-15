'use client'

import React from 'react'

const { useEffect, useState, useRef } = React

export function useIntersectObserver<T = any>() {
  const [isVisible, setVisible] = useState(false)
  const reference = useRef<T>(null)

  useEffect(() => {
    if (!reference.current || isVisible) return

    const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        setVisible(true)
      }
    }

    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: '0px 0px -33.3333% 0px',
    })

    observer.observe(reference.current as Element)

    return () => {
      observer.disconnect()
    }
  }, [isVisible])

  return [isVisible, reference] as [boolean, React.MutableRefObject<T>]
}
