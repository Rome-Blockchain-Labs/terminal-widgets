import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from 'components/Loader'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import AuthModal from 'components/auth/AuthModal'
import ErrorModal from 'components/auth/ErrorModal'

const ForgotPassword: NextPage = ({ resetToken }: any) => {
  const router = useRouter()

  const { mutate, data, error, isLoading } = useMutation<any, AxiosError, any>(({ password }: { password: string }) => {
    return axios.post('/api/reset-password', {
      params: {
        resetToken,
        password,
      },
    })
  })
  const [showModal, setShowmModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ password: string; repeatPassword: string }>({
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  })

  const onSubmit = handleSubmit((data) => mutate(data))
  useEffect(() => {
    if (!resetToken) {
      router.push('/')
    }
  }, [resetToken, router])
  useEffect(() => {
    if (data) {
      setShowmModal(true)
    }
  }, [data])

  return (
    <>
      <div className="bg-gradient-to-br from-midnight to-november font-roboto h-full w-full grid place-items-center">
        {showModal && <AuthModal setShowModal={setShowmModal} />}
        {error && <ErrorModal message={error?.response?.data as string} />}
        {isLoading && <Loader />}
        <div className="flex flex-col items-center justify-center text-white text-sm md:text-lg py-4 w-[380px]">
          <div className="bg-midnight flex h-16 px-11 items-center w-full rounded-t-md ">
            <img src="rt-logo.svg" />
            <div className="text-sm text-white ml-auto text-right">
              <div>Rome Terminal</div>
              <div>Password Recovery</div>
            </div>
          </div>
          <div className="bg-midnight/50 w-full px-11 pb-4 rounded-b-md">
            <div className="text-sm mt-2">Type in your new password</div>
            <div className="flex flex-col justify-center">
              <form onSubmit={onSubmit}>
                <div className="mt-[8%] flex flex-col ">
                  <label htmlFor="email" className="block text-sm font-medium ">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="password"
                      className="h-[47px] text-black  w-full rounded-md"
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required',

                        minLength: {
                          value: 8,
                          message: 'Password should be at least 8 characters',
                        },
                      })}
                    />
                    {errors && errors.password && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors && (
                    <p className="mt-2 text-sm text-red-400" id="email-error">
                      {errors.password?.message}
                    </p>
                  )}
                  <label htmlFor="email" className="block text-sm font-medium ">
                    Repeat Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="password"
                      className="h-[47px] text-black  w-full rounded-md"
                      placeholder="Enter your password"
                      {...register('repeatPassword', {
                        required: 'Please repeat password',
                        validate: (val: string) => {
                          if ((watch('password') as string) !== val) {
                            return 'Your passwords do not match'
                          }
                        },
                      })}
                    />
                    {errors && errors.repeatPassword && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors && (
                    <p className="mt-2 text-sm text-red-400" id="email-error">
                      {errors.repeatPassword?.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className=" mt-[11px] h-[47px] w-full rounded-md bg-november text-sour hover:bg-midnight hover:text-white"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword

export async function getServerSideProps({ query }: any) {
  return {
    props: {
      resetToken: query.resetToken ? query.resetToken : null,
    },
  }
}
