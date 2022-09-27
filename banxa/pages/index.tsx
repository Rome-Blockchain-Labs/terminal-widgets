import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import Registration from '../components/auth/Registration'
import Login from 'components/auth/Login'
import Loader from 'components/Loader'
import { useAuthContext } from '../hooks/useAuthContext'
import { useRouter } from 'next/router'
import { AUTH_STATUS } from 'Context/AuthContext'

const Home: NextPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { isLoggedIn } = useAuthContext()

  useEffect(() => {
    if (isLoggedIn === AUTH_STATUS.LOGGED_IN) {
      router.push('/create-order')
    }
  }, [isLoggedIn, router])

  return (
    <>
      {loading && <Loader />}
      <div className="h-full w-full  flex flex-col items-center justify-center text-white text-sm md:text-lg ">
        <img src="/logo.svg" className="h-9 w-auto mt-5 md:h-[10%]" alt="banxa_logo" />
        <div className="my-3 w-full h-[1px]  bg-gradient-to-r from-[#d9d9d9] via-[#d9d9d9] to-[#d9d9d9]/0" />
        <div className="flex flex-col justify-center">
          <div className="mt-[8%] flex flex-col w-[346px] ">
            {isLogin ? (
              <Login setIsLogin={setIsLogin} setLoading={setLoading} />
            ) : (
              <Registration setLoading={setLoading} setIsLogin={setIsLogin} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
