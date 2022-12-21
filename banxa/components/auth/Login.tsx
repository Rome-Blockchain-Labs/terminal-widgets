import { ExclamationCircleIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { AUTH_STATUS } from 'Context/AuthContext'
import { useAuthContext } from 'hooks/useAuthContext'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

const Login = ({
  setIsLoginPage,
  setLoading,
}: {
  setIsLoginPage: (val: boolean) => void
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
  const { setLoggedIn } = useAuthContext()
  const onSubmit = handleSubmit(async (formData) => {
    setLoading(true)
    try {
      await axios.post('/api/banxa/login', {
        params: {
          email: formData.email,
          password: formData.password,
        },
      })
      setLoggedIn()
      setLoading(false)
      router.push('/create-order')
    } catch (error: any) {
      setError('email', { type: 'custom', message: 'Email or password is invalid' })
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
            className="h-[47px] text-november  w-full rounded-md"
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
            className="h-[47px] text-november w-full rounded-md"
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
        <button
          type="submit"
          className="mt-[11px] h-[47px] w-full rounded-md bg-november text-sour hover:bg-midnight hover:text-white"
        >
          Continue
        </button>
      </form>
      <button
        onClick={() => router.push('/forgot-password')}
        className="mt-2 text-sm hover:underline  text-center underline-offset-4"
      >
        Recover your password.
      </button>
      <button onClick={() => setIsLoginPage(false)} className="mt-2 mb-4 hover:underline  underline-offset-4 text-sm">
        <span className="text-winter">No Rometerminal account? </span>Create one now.
      </button>
    </>
  )
}
export default Login
