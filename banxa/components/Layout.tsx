import React, { ReactNode, useEffect } from 'react'
import { useAppContext } from '../context/AppProvider'
import { useRouter } from 'next/router'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const { accountReference } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (!accountReference && router.pathname !== '/') {
      router.push('/')
    }
  }, [accountReference, router])

  return (
    <div className="min-w-screen h-screen  bg-gradient-to-br from-[#12162e] via-[#3d5d6e] to-[#12162e] font-sans overflow-hidden wg:overflow-auto">
      {children}
    </div>
  )
}
