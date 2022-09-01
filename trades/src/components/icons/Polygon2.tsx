import React, { FC, memo } from 'react';

import { IIconProps, TransitionCircle, TransitionPath } from '.';

export const Polygon2Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 25}
      viewBox="0 0 25 25"
      width={width ?? 25}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(-1792.333 -664.499)">
        <TransitionCircle
          cx="12.5"
          cy="12.5"
          fill="#fff"
          r="12.5"
          transform="translate(1792.333 664.499)"
        />
        <TransitionPath
          d="M1807.481 699.226a1.146 1.146 0 0 0-1.075 0l-2.511 1.48-1.7.941-2.466 1.48a1.146 1.146 0 0 1-1.076 0l-1.928-1.166a1.093 1.093 0 0 1-.538-.941v-2.242a1.106 1.106 0 0 1 .538-.942l1.928-1.12a1.141 1.141 0 0 1 1.076 0l1.928 1.165a1.093 1.093 0 0 1 .538.942v1.477l1.7-.987v-1.524a1.1 1.1 0 0 0-.538-.941l-3.586-2.107a1.141 1.141 0 0 0-1.076 0l-3.676 2.152a.985.985 0 0 0-.538.9v4.214a1.106 1.106 0 0 0 .538.942l3.631 2.107a1.141 1.141 0 0 0 1.076 0l2.466-1.435 1.7-.986 2.466-1.434a1.141 1.141 0 0 1 1.075 0l1.928 1.12a1.093 1.093 0 0 1 .538.941v2.238a1.106 1.106 0 0 1-.538.942l-1.883 1.12a1.141 1.141 0 0 1-1.075 0l-1.928-1.12a1.093 1.093 0 0 1-.538-.942v-1.434l-1.7.987v1.479a1.1 1.1 0 0 0 .538.941l3.632 2.107a1.141 1.141 0 0 0 1.075 0l3.632-2.107a1.093 1.093 0 0 0 .537-.941v-4.259a1.107 1.107 0 0 0-.537-.942z"
          fill="#8247e5"
          transform="translate(1.767 -25.165)"
        />
      </g>
    </svg>
  )
);
