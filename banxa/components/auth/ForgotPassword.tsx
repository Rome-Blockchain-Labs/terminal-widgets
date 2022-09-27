import { ExclamationCircleIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

const ForgotPassword = ({
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
    setError,
  } = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true)
    try {
      await axios.post('/api/banxa/login', {
        params: {
          email: formData.email,
          password: formData.password,
        },
      })
    } catch (error: any) {
      if (error.response.data.error === 'password') {
        setError('password', { type: 'custom', message: 'Invalid password' })
      }
      if (error.response.data.error === 'user') {
        setError('email', { type: 'custom', message: 'User doesnt exist' })
      }
    }
    setLoading(false)
    router.push('/create-order')
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
        <button
          type="submit"
          className="font-bold mt-[11px] h-[47px] w-full rounded-md bg-gradient-to-r from-[#0472c0] to-[#00d1c0] "
        >
          Continue
        </button>
      </form>

      <button onClick={() => setIsLogin(false)} className="mt-4 text-base">
        No Account? Sign up here
      </button>

      <button className="mt-2 text-sm">Forgot your password?</button>
    </>
  )
}
export default ForgotPassword
