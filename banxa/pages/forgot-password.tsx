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
    <div className="bg-gradient-to-br from-midnight to-november font-roboto h-full w-full grid place-items-center">
      {showModal && <ConfirmModal setShowModal={setShowModal} />}
      {isLoading && <Loader />}
      <div className="  flex flex-col items-center justify-center text-white text-sm md:text-lg py-4 w-[360px]">
        <div className="bg-midnight flex h-16 px-11 items-center rounded-t-md  w-full">
          <img src="rt-logo.svg" />
          <div className="text-sm text-white ml-auto text-right">
            <div>Rome Terminal</div>
            <div>Password Recovery</div>
          </div>
        </div>
        <div className="bg-midnight/50 p-3 px-11 w-full text-winter">
          <div className="mr-auto">Trouble logging in?</div>
          <div className="text-sm mt-2">Enter your email address below and we will send you a reset password link</div>
          <div className="flex flex-col justify-center">
            <div className="mt-[8%] flex flex-col">
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
                className="mt-[11px] h-[47px] w-full rounded-md bg-november text-sour hover:bg-midnight hover:text-white"
              >
                Reset Password
              </button>
              <button className="mt-4 hover:underline text-sm text-white" onClick={() => router.push('/')}>
                Return home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
