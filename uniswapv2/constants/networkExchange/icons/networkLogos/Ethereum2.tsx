import React, { FC, memo } from 'react';

import { IIconProps, TransitionPath } from '../../../../components/icons';

export const Ethereum2Icon: FC<IIconProps> = memo(
  ({ grayscale, height, width }) => (
    <svg
      height={height ?? 16}
      viewBox="0 0 16 16"
      width={width ?? 16}
      xmlns="http://www.w3.org/2000/svg"
    >
      {!grayscale && (
        <TransitionPath
          d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
          fill="#FFFFFF"
        />
      )}
      <TransitionPath
        d="M8.00088 0.733032L7.90088 1.03303V10.633L8.00088 10.733L12.5009 8.13303L8.00088 0.733032Z"
        fill={grayscale ? '#B4BBC7' : '#343434'}
        opacity={grayscale ? '0.4' : '1'}
      />
      <TransitionPath
        d="M8.00098 0.733032L3.50098 8.13303L8.00098 10.733V0.733032Z"
        fill={grayscale ? '#B4BBC7' : '#8C8C8C'}
        opacity={grayscale ? '0.6' : '1'}
      />
      <TransitionPath
        d="M8.00088 11.633L7.90088 15.1331L8.00088 15.3331L12.5009 9.03302L8.00088 11.633Z"
        fill={grayscale ? '#B4BBC7' : '#3C3C3B'}
        opacity={grayscale ? '0.4' : '1'}
      />
      <TransitionPath
        d="M8.00098 15.2331V11.533L3.50098 8.93304L8.00098 15.2331Z"
        fill={grayscale ? '#B4BBC7' : '#8C8C8C'}
        opacity={grayscale ? '0.6' : '1'}
      />
      <TransitionPath
        d="M8.00098 10.7331L12.501 8.13305L8.00098 6.13306V10.7331Z"
        fill={grayscale ? '#B4BBC7' : '#141414'}
        opacity={grayscale ? '0.2' : '1'}
      />
      <TransitionPath
        d="M3.50098 8.13302L8.00098 10.733V6.03302L3.50098 8.13302Z"
        fill={grayscale ? '#B4BBC7' : '#393939'}
        opacity={grayscale ? '0.6' : '1'}
      />
    </svg>
  )
);
