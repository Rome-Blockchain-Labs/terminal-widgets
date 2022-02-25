import { ReactNode } from 'react'
import tw, { styled } from 'twin.macro'
import { LoadingSpinner } from './icons/LoadingSpinner'

const Button = styled.button`
  ${tw`m-[2px] py-2 flex-grow grid place-items-center text-white font-bold cursor-pointer text-[11px] rounded-[50px] bg-secondary`}
`
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
    <Button onClick={onClick} disabled={disabled}>
      {!loading ? children : <LoadingSpinner />}
    </Button>
  )
}

export default ButtonLoading
