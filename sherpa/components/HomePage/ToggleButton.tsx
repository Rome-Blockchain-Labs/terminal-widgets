import { ReactNode } from 'react'

export const ToggleButton = ({
  disabled,
  children,
  onClick,
}: {
  disabled: boolean
  children?: ReactNode
  onClick?: any
}) => {
  return (
    <button
      onClick={onClick}
      className={` ${
        !disabled ? 'bg-white text-primary' : 'text-white bg-secondary'
      } m-[2px] py-2 flex-grow  font-bold cursor-pointer text-[11px] rounded-[50px] `}
    >
      {children}
    </button>
  )
}
