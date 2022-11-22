import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import Registration from '../components/auth/Registration'
import Login from 'components/auth/Login'
import Loader from 'components/Loader'
import { useAuthContext } from '../hooks/useAuthContext'
import { useRouter } from 'next/router'
import { AUTH_STATUS } from 'Context/AuthContext'

const Home: NextPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true)
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
      <div className="flex flex-col items-center justify-center text-white text-sm md:text-lg py-4">
        <img src="/logo.svg" className="h-9 w-auto mt-5 md:h-[10%]" alt="banxa_logo" />
        <div className="my-3 w-full h-[1px]  bg-gradient-to-r from-transparent via-[#d9d9d9] to-transparent" />
        <div className="flex flex-col justify-center">
          <div className="mt-[8%] flex flex-col w-[346px] ">
            {isLoginPage ? (
              <Login setIsLoginPage={setIsLoginPage} setLoading={setLoading} />
            ) : (
              <Registration setLoading={setLoading} setIsLoginPage={setIsLoginPage} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
