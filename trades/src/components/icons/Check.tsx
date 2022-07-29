import React, { FC, memo } from 'react';

import { IIconProps, TransitionPath } from '.';

export const CheckIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      fill="none"
      height={height ?? 10}
      viewBox="0 0 10 10"
      width={width ?? 10}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M1 6L4 9L9 1"
        data-name="Path 18499"
        id="Path_18499"
        stroke={color}
        stroke-linecap="round"
      />
    </svg>
  )
);
