import React, { ReactNode, useState } from 'react'
import { createContext, useContext } from 'react'

export const AppContext = createContext<{
  accountReference: string | undefined
  setAccountReference: (arg: string) => void
}>({
  accountReference: undefined,
  setAccountReference: () => {},
})

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [accountReference, setAccountReference] = useState<string>()

  return <AppContext.Provider value={{ accountReference, setAccountReference }}>{children}</AppContext.Provider>
}

export default AppProvider

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error(`Must run useAppContext in component inside AppProvider`)
  }
  return context
}
