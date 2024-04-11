'use client'

import React, { createContext } from 'react'
import { IDictonary } from '@futurebrand/types/global-options'

export interface IDictonaryContext {
  dictionary: IDictonary
}

const initialState: Partial<IDictonaryContext> = {
  dictionary: {}
}

export const DictonaryContext = createContext<IDictonaryContext>(
  initialState as IDictonaryContext
)

export interface IDictionaryContextProps {
  dictionary: IDictonary,
}

const DictonaryContextProvider: React.FC<React.PropsWithChildren<IDictionaryContextProps>> = ({
  children,
  dictionary,
}) => {
  return (
    <DictonaryContext.Provider
      value={{
        dictionary,
      }}
    >
      {children}
    </DictonaryContext.Provider>
  )
}

export default DictonaryContextProvider
