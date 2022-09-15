import { ExclamationCircleIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

const Registration = ({
  setIsLogin,
  setLoading,
}: {
  setIsLogin: (val: boolean) => void

  setLoading: (val: boolean) => void
}) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<{
    email: string
    password: string
    repeatPassword: string
    banxaPromotion: boolean
    RBLPromotion: boolean
  }>({
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
      banxaPromotion: false,
      RBLPromotion: false,
    },
  })

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true)
    try {
      await axios.post('/api/register', {
        params: {
          email: formData.email,
          password: formData.password,
          banxaPromotion: formData.banxaPromotion,
          RBLPromotion: formData.RBLPromotion,
        },
      })

      setLoading(false)
      router.push('/create-order')
    } catch (error: any) {
      const message = error.response.data

      setError('email', { type: 'custom', message })

      setLoading(false)
    }
  })

  return (
    <>
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

        <div className="relative flex items-start mt-2">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              {...register('banxaPromotion', {})}
            />
          </div>
          <div className="ml-3 text-sm">
            <span id="comments-description" className="text-white">
              I agree to receive informational e-mails directly related to Banxa on Rome Blockchain Labs
            </span>
          </div>
        </div>

        <div className="relative flex items-start mt-2">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              {...register('RBLPromotion', {})}
            />
          </div>
          <div className="ml-3 text-sm">
            <span id="comments-description" className="text-white">
              I agree to receive promotional e-mails from Rome Blockchain Labs
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="font-bold mt-[11px] h-[47px] w-full rounded-md bg-gradient-to-r from-[#0472c0] to-[#00d1c0] "
        >
          Continue
        </button>
      </form>

      <button
        onClick={() => router.push('/forgot-password')}
        className="mt-2 text-sm hover:underline  text-left underline-offset-4"
      >
        Forgot your password?
      </button>
      <button onClick={() => setIsLogin(true)} className="mt-4 text-base hover:underline  underline-offset-4">
        Have an RBL Account? Login here
      </button>
    </>
  )
}
export default Registration
