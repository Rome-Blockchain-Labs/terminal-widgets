import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from 'components/Loader'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const ForgotPassword: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>()
  const { mutate, data, error, isLoading } = useMutation((email: any) => {
    return axios.post('/api/reset-request', {
      params: {
        email,
      },
    })
  })
  console.log(error)
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push('/create-order')
  //   }
  // }, [isLoggedIn, router])

  return (
    <>
      {isLoading && <Loader />}
      <div className="h-full w-full  flex flex-col items-center justify-center text-white text-sm md:text-lg">
        <img src="/logo.svg" className="h-[52px] w-auto mt-[50px] md:h-[10%]" alt="banxa_logo" />
        <div className="mt-[21px] mb-[10px] w-full h-[1px]  bg-gradient-to-r from-[#d9d9d9]/0 via-[#d9d9d9] to-[#d9d9d9]/0" />

        <div>Trouble logging in?</div>
        <div className="text-sm mt-2">Enter your email address below and we will send you a reset password link</div>
        <div className="flex flex-col justify-center">
          <div className="mt-[8%] flex flex-col w-[346px] ">
            <div className="relative mt-1">
              <input
                type="email"
                className="h-[47px] text-black  w-full rounded-md"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* {errors && errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )} */}
            </div>

            <button
              onClick={() => mutate(email)}
              className="font-bold mt-[11px] h-[47px] w-full rounded-md bg-gradient-to-r from-[#0472c0] to-[#00d1c0] "
            >
              Reset Password
            </button>
            <button
              onClick={() =>
                axios.post('/api/register-dup', {
                  params: {
                    email,
                  },
                })
              }
            >
              asdas
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
