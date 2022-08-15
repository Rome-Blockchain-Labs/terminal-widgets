/* This example requires Tailwind CSS v2.0+ */
import { useRouter } from 'next/router'
import React, { useEffect, useState, ReactNode } from 'react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  children: ReactNode
}

export default function Example({ children }: Props) {
  const router = useRouter()
  const [navigation, setNavigation] = useState([
    { name: 'Buy Crypto', href: '/', current: true },
    { name: 'Buy Fiat', href: '/fiat-buy', current: false },
    { name: 'Payment Methods', href: '/payment-methods', current: false },
    { name: 'Create Order', href: '/create-order', current: false },
    { name: 'Get Order', href: '/get-order', current: false },
    { name: 'Get Customer Orders', href: '/get-orders', current: false },
  ])

  useEffect(() => {
    if (router.pathname) {
      setNavigation((state) =>
        state.map((nav) => {
          if (router.pathname === nav.href) {
            return { ...nav, current: true }
          }

          return { ...nav, current: false }
        })
      )
    }
  }, [router])

  return (
    <div className="flex h-screen flex-col">
      <div className="absolute top-0 left-0 right-0 bottom-0 m-auto aspect-video max-h-full max-w-full bg-black ">
        asdas
      </div>
    </div>
  )
}
