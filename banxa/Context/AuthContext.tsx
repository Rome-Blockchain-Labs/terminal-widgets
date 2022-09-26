import React, { createContext, ReactNode, useEffect } from 'react'
import useLocalStorage from 'utils/useLocalStorage'
import { useRouter } from 'next/router'

interface IAuthContext {
  isLoggedIn: string
  setIsLoggedIn: (val: string) => void
}
export const AuthContext = createContext<IAuthContext>({
  isLoggedIn: 'false',
  setIsLoggedIn: () => {},
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('loggedin', 'false')

  const context = {
    isLoggedIn,
    setIsLoggedIn,
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
