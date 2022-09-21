import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import Loader from 'components/Loader'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import ConfirmModal from 'components/auth/ConfirmModal'
import { useRouter } from 'next/router'

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState<string>()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const { mutate, data, isLoading } = useMutation((email: any) => {
    return axios.post('/api/reset-request', {
      params: {
        email,
      },
    })
  })
  useEffect(() => {
    if (data) {
      setShowModal(true)
    }
  }, [data])

  return (
    <>
      {showModal && <ConfirmModal setShowModal={setShowModal} />}
      {isLoading && <Loader />}
      <div className="h-full w-full  flex flex-col items-center justify-center text-white text-sm md:text-lg">
        <img src="/logo.svg" className="h-[52px] w-auto mt-[50px] md:h-[10%]" alt="banxa_logo" />
        <div className="mt-[21px] mb-[10px] w-full h-[1px]  bg-gradient-to-r from-[#d9d9d9]/0 via-[#d9d9d9] to-[#d9d9d9]/0" />

        <div>Trouble logging in?</div>
        <div className="text-sm mt-2 px-4 ">
          Enter your email address below and we will send you a reset password link
        </div>
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
            </div>

            <button
              onClick={() => mutate(email)}
              className="font-bold mt-[11px] h-[47px] w-full rounded-md bg-gradient-to-r from-[#0472c0] to-[#00d1c0] "
            >
              Reset Password
            </button>
            <button className="mt-4 hover:underline" onClick={() => router.push('/')}>
              Return home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
