'use client'

import { useEffect, useState } from 'react'

interface IWindowSize {
  width: number
  height: number
}

export function useWindowSize(): IWindowSize {
  const [size, setSize] = useState<IWindowSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}
