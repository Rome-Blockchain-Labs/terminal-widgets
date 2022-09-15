import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import Registration from '../components/auth/Registration'
import Login from 'components/auth/Login'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const isLoggedIn = !!getCookie('banxa')
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/create-order')
    }
  }, [isLoggedIn, router])

  return (
    <div className="h-full w-full  flex flex-col items-center justify-center text-white text-sm md:text-lg">
      <img src="/logo.svg" className="h-[52px] w-auto mt-[50px] md:h-[10%]" alt="banxa_logo" />

      <div className="mt-[21px] mb-[10px] w-full h-[1px]  bg-gradient-to-r from-[#d9d9d9]/0 via-[#d9d9d9] to-[#d9d9d9]/0" />
      <div className="flex flex-col justify-center">
        <div className="mt-[8%] flex flex-col w-[346px] ">
          {isLogin ? <Login setIsLogin={setIsLogin} /> : <Registration setIsLogin={setIsLogin} />}
        </div>
      </div>
    </div>
  )
}

export default Home
