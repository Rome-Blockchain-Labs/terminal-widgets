import React, { ReactNode, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useRouter } from 'next/router'
import { AUTH_STATUS } from 'Context/AuthContext'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const { isLoggedIn } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (router.pathname === '/privacy-policy' || router.pathname === '/terms-of-use') {
      return
    }
    if (
      router.pathname !== '/forgot-password' &&
      router.pathname !== '/reset-password' &&
      isLoggedIn === AUTH_STATUS.LOGGGED_OUT
    ) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-700 min-w-screen h-screen  bg-gradient-to-br from-[#12162e] via-[#3d5d6e] to-[#12162e] font-sans overflow-hidden wg:overflow-auto">
      {children}
    </div>
  )
}
