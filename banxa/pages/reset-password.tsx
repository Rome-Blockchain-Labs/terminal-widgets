import type { NextPage } from 'next'

import { useEffect } from 'react'
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

  return (
    <>
      {data && <AuthModal />}
      {error && <ErrorModal message={error?.response?.data as string} />}
      {isLoading && <Loader />}
      <div className="h-full w-full  flex flex-col items-center justify-center text-white text-sm md:text-lg">
        <img src="/logo.svg" className="h-[52px] w-auto mt-[50px] md:h-[10%]" alt="banxa_logo" />
        <div className="mt-[21px] mb-[10px] w-full h-[1px]  bg-gradient-to-r from-[#d9d9d9]/0 via-[#d9d9d9] to-[#d9d9d9]/0" />

        <div>Password Reset</div>
        <div className="text-sm mt-2">Type in your new password</div>
        <div className="flex flex-col justify-center">
          <form onSubmit={onSubmit}>
            <div className="mt-[8%] flex flex-col w-[346px] ">
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
                    minLength: 8,
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
              className="font-bold mt-[11px] h-[47px] w-full rounded-md bg-gradient-to-r from-[#0472c0] to-[#00d1c0] "
            >
              Submit
            </button>
          </form>
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
