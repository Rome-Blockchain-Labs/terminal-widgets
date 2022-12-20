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
    console.log('rerender')
    if (router.pathname === '/privacy-policy' || router.pathname === '/terms-of-use') {
      return
    }
    if (
      router.pathname !== '/' &&
      router.pathname !== '/forgot-password' &&
      router.pathname !== '/reset-password' &&
      isLoggedIn === AUTH_STATUS.LOGGGED_OUT
    ) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen grid place-items-center  bg-gradient-to-br from-[#12162e] via-[#3d5d6e] to-[#12162e] overflow-auto font-sans ">
      {children}
    </div>
  )
}

//
