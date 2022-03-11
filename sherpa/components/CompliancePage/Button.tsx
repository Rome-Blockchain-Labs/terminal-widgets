import { ReactNode } from 'react'
import { LoadingSpinner } from '../shared/LoadingSpinner'

interface ButtonLoadingProps {
  loading?: boolean
  children?: ReactNode
  onClick: any
  disabled?: boolean
}
const ButtonLoading = ({
  disabled,
  onClick,
  loading,
  children,
}: ButtonLoadingProps) => {
  return (
    <button
      className="m-[2px] py-2 flex-grow grid place-items-center text-white font-bold cursor-pointer text-[2vw] lg:text-2xl rounded-[50px] bg-secondary"
      onClick={onClick}
      disabled={disabled}
    >
      {!loading ? children : <LoadingSpinner />}
    </button>
  )
}

export default ButtonLoading
