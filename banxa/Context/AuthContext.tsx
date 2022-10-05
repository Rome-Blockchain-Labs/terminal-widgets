import React, { createContext, ReactNode } from 'react'
import useLocalStorage from 'utils/useLocalStorage'

export enum AUTH_STATUS {
  LOGGED_IN = 'logged-in',
  LOGGGED_OUT = 'logged-out',
}

interface IAuthContext {
  isLoggedIn: AUTH_STATUS
  setIsLoggedIn: (val: AUTH_STATUS) => void
}
export const AuthContext = createContext<IAuthContext>({
  isLoggedIn: AUTH_STATUS.LOGGGED_OUT,
  setIsLoggedIn: () => {},
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('loggedin', AUTH_STATUS.LOGGGED_OUT)

  const context = {
    isLoggedIn,
    setIsLoggedIn,
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
