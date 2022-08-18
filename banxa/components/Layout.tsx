import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function Example({ children }: Props) {
  // const router = useRouter()
  // const [navigation, setNavigation] = useState([
  //   { name: 'Buy Crypto', href: '/', current: true },
  //   { name: 'Buy Fiat', href: '/fiat-buy', current: false },
  //   { name: 'Payment Methods', href: '/payment-methods', current: false },
  //   { name: 'Create Order', href: '/create-order', current: false },
  //   { name: 'Get Order', href: '/get-order', current: false },
  //   { name: 'Get Customer Orders', href: '/get-orders', current: false },
  // ])

  // useEffect(() => {
  //   if (router.pathname) {
  //     setNavigation((state) =>
  //       state.map((nav) => {
  //         if (router.pathname === nav.href) {
  //           return { ...nav, current: true }
  //         }

  //         return { ...nav, current: false }
  //       })
  //     )
  //   }
  // }, [router])

  return (
    <div className="min-w-screen h-screen  bg-gradient-to-br from-[#12162e] via-[#3d5d6e] to-[#12162e] font-sans">
      {children}
    </div>
  )
}
