import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-700 min-w-screen h-screen  bg-gradient-to-br from-[#12162e] via-[#3d5d6e] to-[#12162e] font-sans overflow-hidden wg:overflow-auto">
      {children}
    </div>
  )
}
