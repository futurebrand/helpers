import { usePathname } from 'next/navigation'
import { useLayoutEffect, useState } from 'react'

export function useNavigateObserver(callback: () => void) {
  const [lastPathName, setLastPathName] = useState<string>()
  const pathName = usePathname()

  useLayoutEffect(() => {
    if (!lastPathName && pathName) {
      setLastPathName(pathName)
      return
    }

    if (lastPathName !== pathName) {
      callback()
      setLastPathName(pathName)
    }
  }, [callback, lastPathName, pathName])
}