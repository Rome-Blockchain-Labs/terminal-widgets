import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const CoinmarketcapIcon: FC<IIconProps> = memo(
  ({ activeColor, height, width }) => (
    <SVG
      height={height ?? 9.059}
      hoverColor={activeColor}
      viewBox="0 0 8.928 9.059"
      width={width ?? 8.928}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M-288.839-295.586a.479.479,0,0,1-.487.032.722.722,0,0,1-.277-.663v-.994c0-.478-.189-.816-.506-.909-.533-.156-.932.5-1.085.744l-.945,1.529v-1.866c-.011-.43-.15-.688-.416-.765-.175-.051-.437-.031-.693.359l-2.112,3.39a3.709,3.709,0,0,1-.425-1.741,3.678,3.678,0,0,1,3.645-3.706,3.682,3.682,0,0,1,3.65,3.706v.022a.92.92,0,0,1-.351.863Zm1.167-.884v-.02a4.51,4.51,0,0,0-4.466-4.51,4.506,4.506,0,0,0-4.462,4.53,4.5,4.5,0,0,0,4.462,4.53,4.411,4.411,0,0,0,3.033-1.209.416.416,0,0,0,.022-.583.4.4,0,0,0-.566-.028l0,0a3.608,3.608,0,0,1-5.1-.135c-.034-.036-.066-.071-.1-.108l1.9-3.056v1.41c0,.677.263.9.482.962s.558.02.911-.553l1.051-1.7c.032-.054.063-.1.093-.142v.864a1.514,1.514,0,0,0,.7,1.39,1.284,1.284,0,0,0,1.308-.053,1.738,1.738,0,0,0,.73-1.589Z"
        fill="#17181b"
        transform="translate(296.6 301)"
      />
    </SVG>
  )
)