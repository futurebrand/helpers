'use client'

import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react'

export interface IPreviewContext {
  isPreview: boolean
  setPreview: (isPreview: boolean) => void
}

const initialState: Partial<IPreviewContext> = {
  isPreview: false,
}

export const PreviewContext = createContext<IPreviewContext>(
  initialState as IPreviewContext
)

const PreviewContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isPreview, setPreview] = React.useState(false)

  return (
    <PreviewContext.Provider
      value={{
        isPreview,
        setPreview,
      }}
    >
      {children}
    </PreviewContext.Provider>
  )
}

export const useIsPreview = () => {
  const { isPreview } = useContext(PreviewContext)
  return useMemo(() => isPreview, [isPreview])
}

export const PreviewLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { setPreview } = useContext(PreviewContext)

  useEffect(() => {
    setPreview(true)
  }, [])

  return <>{children}</>
}

export default PreviewContextProvider
