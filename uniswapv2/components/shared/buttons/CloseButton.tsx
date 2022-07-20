import { CloseIcon } from 'components/icons/Close'
import React, { FC, memo } from 'react'
import { theme } from 'twin.macro'

type CloseButtonProps = {
  onClick: () => void
  width?: number
  height?: number
  color?: string
}

// eslint-disable-next-line react/display-name
export const CloseButton: FC<CloseButtonProps> = memo(
  ({ onClick, width = 16, height = 16, color = theme`colors.yellow.400` }) => {
    return (
      <button onClick={onClick}>
        <CloseIcon color={color} height={height} width={width} />
      </button>
    )
  },
)
