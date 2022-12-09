import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import Registration from '../components/auth/Registration'
import Login from 'components/auth/Login'
import Loader from 'components/Loader'
import { useAuthContext } from '../hooks/useAuthContext'
import { useRouter } from 'next/router'
import { AUTH_STATUS } from 'Context/AuthContext'
import { classNames } from 'utils/style'

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
      <div className="h-full w-full text-sm md:text-lg py-4 bg-gradient-to-br from-midnight to-november font-roboto grid place-items-center ">
        <div
          className={classNames(
            isLoginPage ? 'w-[360px]' : ' w-[360px] wg:w-[510px]',
            'flex flex-col justify-center mx-auto '
          )}
        >
          <div className="bg-midnight flex h-16 px-11 items-center rounded-t-md ">
            <img src="rt-logo.svg" />
            <div className="text-sm text-white ml-auto text-right">
              {isLoginPage ? (
                <>
                  <div>Login to your</div>
                  <div>Rome Terminal account</div>
                </>
              ) : (
                <div>Create your Rome Terminal Account</div>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full mx-auto bg-midnight/50 px-11 py-3 rounded-b-md text-white">
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
