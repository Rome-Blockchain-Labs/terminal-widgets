import type { NextPage } from 'next'

import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useAppContext } from '../context/AppProvider'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const { setAccountReference } = useAppContext()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: {
      email: '',
    },
  })
  const router = useRouter()
  const onSubmit = handleSubmit(async (data) => {
    const res = await axios.post('/api/banxa/login', {
      params: {
        email: data.email,
      },
    })
    setAccountReference(res.data.account_reference)
    router.push('/create-order')
  })

  return (
    <div className="h-full w-full bg-gradient-to-br from-[#12162e] via-[#3d5d6e] to-[#12162e] flex flex-col items-center justify-center text-white text-sm md:text-lg">
      <img src="/logo.svg" className="h-[52px] w-auto mt-[50px] md:h-[10%]" alt="banxa_logo" />

      <div className="mt-[21px] mb-[10px] w-full h-[1px]  bg-gradient-to-r from-[#d9d9d9]/0 via-[#d9d9d9] to-[#d9d9d9]/0" />
      <div className="flex flex-col justify-center">
        <div className="text-center">Please enter your e-mail to use the Banxa app </div>
        <div className="mt-[8%] flex flex-col w-[346px] ">
          <form onSubmit={onSubmit}>
            <label htmlFor="email" className="block text-sm font-medium ">
              Email
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                className="h-[47px] text-black  w-full rounded-md"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: { value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i, message: 'Email is invalid' },
                })}
              />
              {errors && errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            {errors && (
              <p className="mt-2 text-sm text-red-400" id="email-error">
                {errors.email?.message}
              </p>
            )}
            <button
              type="submit"
              className="font-bold mt-[11px] h-[47px] w-full rounded-md bg-gradient-to-r from-[#0472c0] to-[#00d1c0] "
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
