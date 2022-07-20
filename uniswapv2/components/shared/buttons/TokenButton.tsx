import React, { FC, memo, useState } from 'react'
import { theme } from 'twin.macro'

interface IIconProps {
  color?: string
  className?: string
  activeColor?: string
  active?: boolean
  grayscale?: boolean
  width?: number | string
  height?: number | string
  backgroundColor?: string
  activeBackgroundColor?: string
  ref?: any
  type?: any
  isBackground?: boolean
}

type TokenButtonProps = {
  icon: FC<IIconProps>
  title: string
  onClick?: () => void
}

// eslint-disable-next-line react/display-name
export const TokenButton: FC<TokenButtonProps> = memo(
  ({ icon: Icon, onClick, title }) => {
    const [active, setActive] = useState(false)

    return (
      <button
        tw="flex items-center mx-1.5 font-medium hover:text-yellow-400"
        onClick={onClick}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <Icon
          active={active}
          activeColor={theme`colors.yellow.400`}
          color={theme`colors.gray.200`}
          height={16}
          width={16}
        />
        &nbsp; {title}
      </button>
    )
  },
)
