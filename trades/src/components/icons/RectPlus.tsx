import React, { FC, memo } from 'react';

import { IIconProps, TransitionPath } from '.';

export const RectPlusIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      fill="none"
      height={height ?? 16}
      viewBox="0 0 16 16"
      width={width ?? 16}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="14.75"
        stroke="#7A808A"
        strokeLinejoin="round"
        strokeWidth="1.25"
        width="14.75"
        x="0.625"
        y="0.625"
      />

      <TransitionPath
        d="M8 4V12M4 8H12"
        stroke="#7A808A"
        strokeLinecap="round"
        strokeWidth="1.25"
      />
    </svg>
  )
);
