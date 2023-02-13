import React, { createContext, ReactNode } from 'react'
import { useCookies } from 'react-cookie'

import { AUTH_COOKIES_MAX_AGE, LOGGED_IN } from 'constants/cookies'

interface IAuthContext {
  isLoggedIn: boolean
  setLoggedIn: () => void
  logout: () => void
}
export const AuthContext = createContext<IAuthContext>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  logout: () => {},
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies([LOGGED_IN]);

  const context = {
    isLoggedIn: LOGGED_IN in cookies,
    setLoggedIn: () => {
      setCookie(LOGGED_IN, true, {
        maxAge: AUTH_COOKIES_MAX_AGE,
      });
    },
    logout: () => {
      removeCookie(LOGGED_IN);
    },
  }

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

export default AuthContextProvider
