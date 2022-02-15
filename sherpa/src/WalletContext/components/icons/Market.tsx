import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const MarketIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      data-name="navicon - Markets"
      height={height ?? 11.868}
      hoverColor={activeColor}
      viewBox="0 0 12.505 11.868"
      width={width ?? 12.505}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M62.847,791.352v-.625a.527.527,0,0,0-.015-.135.563.563,0,0,0-.045-.119l-1.268-2.536a.523.523,0,0,0-.468-.29H52.139a.523.523,0,0,0-.468.29L50.4,790.472a.511.511,0,0,0-.059.228h0v.652a2.426,2.426,0,0,0,1.273,2.126v4.989h-.75a.524.524,0,1,0,0,1.047H62.324a.524.524,0,1,0,0-1.047h-.75v-4.989A2.426,2.426,0,0,0,62.847,791.352Zm-1.047-.113v.113a1.386,1.386,0,0,1-2.772,0v-.113Zm-9.338-2.546h8.265l.75,1.5H51.713Zm5.518,2.546v.113a1.386,1.386,0,0,1-2.772,0v-.113Zm-6.591,0h2.772v.113a1.386,1.386,0,0,1-2.772,0Zm6.591,7.228H55.208v-2.022a.75.75,0,0,1,.75-.749h1.273a.75.75,0,0,1,.75.749Zm2.546,0h-1.5v-2.022a1.8,1.8,0,0,0-1.8-1.8H55.958a1.8,1.8,0,0,0-1.8,1.8v2.022h-1.5v-4.693c.038,0,.074.011.113.011a2.428,2.428,0,0,0,1.909-.927,2.43,2.43,0,0,0,3.819,0,2.429,2.429,0,0,0,1.91.927c.038,0,.074-.009.112-.011Z"
        data-name="Path 6930"
        fill={active ? activeColor : color}
        id="Path_6930"
        transform="translate(-50.342 -787.646)"
      />
    </SVG>
  )
)