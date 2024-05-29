'use client'

import React from 'react'

const { useEffect, useRef } = React

export function useMutationObserver(callback: () => void, options: MutationObserverInit = {}) {
  const reference = useRef(null)

  useEffect(() => {
    if (!reference.current) return

    const observer = new MutationObserver(callback)

    observer.observe(reference.current as Element, {
      childList: true,
      subtree: true,
      ...options,
    })

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return reference as any
}
